const {BrowserWindow, session, ipcMain, TouchBar, nativeImage} = require('electron');
const {TouchBarButton} = TouchBar;
const urlLib = require('url');
const https = require('https');
const path = require('path');
const storage = require('electron-json-storage');
const settings = require('electron-settings');
const CssInjector = require('../configuration/css-injector');
const Lyrics = require('../js/lib/lyrics');
const timeFormat = require('hh-mm-ss');
const UpdateController = require('./update-controller');
const URLS = require('../configuration/urls');
const download = require('download');

const getPlayInfoUrlPrefix = 'https://www.xiami.com/api/song/getPlayInfo*';
const getSongDetailsUrlPrefix = 'https://www.xiami.com/api/song/getSongDetails*';

// const language = fs.existsSync(`${app.getPath('userData')}/Settings`) ? settings.get('language', 'sc') : 'sc';
// const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');
const Locale = require('../locale/locale_sc');

class XiamiPlayer {
  constructor(lyricsController, notificationController) {
    this.notificationController = notificationController;
    this.lyricsController = lyricsController;
    this.getSongDetailsUrl = null;
    this.init();
  }

  init() {
    this.lyrics = new Lyrics('');
    const customLayout = settings.get('customLayout', 'suggestion');

    if (customLayout === 'mini') {
      this.window = new BrowserWindow({
        show: false,
        width: 520,
        height: 160,
        frame: false,
        autoHideMenuBar: true,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
          javascript: true,
          plugins: true,
          webSecurity: false,
          nodeIntegration: false,
          preload: path.join(__dirname, 'preload.js')
        }
      });
    } else {
      if (process.platform === 'darwin') {
        this.window = new BrowserWindow({
          show: false, width: 1150, height: 700, titleBarStyle: 'hiddenInset',
          webPreferences: {
            javascript: true,
            plugins: true,
            webSecurity: false,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js')
          }
        });
      } else {
        this.window = new BrowserWindow({
          show: false, width: 1150, height: 700, frame: settings.get('showWindowFrame', true), autoHideMenuBar: true,
          webPreferences: {
            javascript: true,
            plugins: true,
            webSecurity: false,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js')
          }
        });
      }
    }

    // load xiami player page.
    this.window.loadURL(URLS.getUrl(customLayout));

    // set the touch bar.
    this.window.setTouchBar(this.createTouchBar());

    // inject the custom layout.
    this.window.webContents.on('dom-ready', () => {

      this.window.webContents.insertCSS(CssInjector.main);

      if (process.platform == 'darwin') {
        this.window.webContents.insertCSS(CssInjector.macos);
      }
      if (settings.get('darkMode', false)) {
        this.window.webContents.insertCSS(CssInjector.dark);
      }
      if (settings.get('hideScrollbar', false)) {
        this.window.webContents.insertCSS(CssInjector.hideScrollbar);
      }

      this.window.show();
      // this.window.webContents.openDevTools();

      // check update
      new UpdateController().checkUpdate();
    });

    // triggering when user try to close the play window.
    this.window.on('close', (e) => {
      if (this.window.isVisible()) {
        e.preventDefault();
        this.window.hide();
      }
    });

    // triggering after the play window closed.
    this.window.on('closed', () => {
      ipcMain.removeAllListeners('playtime');
      this.window = null;
    });

    // intercept the ajax call response
    session.defaultSession.webRequest.onCompleted({urls: [getPlayInfoUrlPrefix, getSongDetailsUrlPrefix]}, (details) => this.handleResponse(details));

    ipcMain.on('playtime', (event, value) => {
      let playingTime = value.match(/^(.*)\//)[1];
      const timeline = this.lyrics.select(timeFormat.toS(playingTime));
      if (timeline !== this.previousTime) {
        this.previousTime = timeline;
        if (timeline >= 0) {
          let lyric = this.lyrics.getLyric(timeline);
          if (lyric) {
            let text = lyric.text;
            this.lyricsController.window.webContents.send('lyricsChange', this.prettyLyric(text));
          }
        } else {
          this.lyricsController.window.webContents.send('lyricsChange', '这首没有歌词 (-_-!)');
        }
      }
    });

    ipcMain.on('lyricsOpenPlayer', () => this.toggleWindow());
  }

  toggleWindow() {
    if (this.window.isVisible()) {
      this.window.hide();
    } else {
      this.show();
    }
  }

  // display and focus the player window.
  show() {
    this.window.show();
    this.window.focus();
  }

  // return a boolean to indicate if the window is visible or not
  isVisible() {
    return this.window.isFocused();
  }

  pausePlay() {
    this.window.webContents.executeJavaScript("document.querySelector('.main-control .play-btn').click();");
  }

  next() {
    this.window.webContents.executeJavaScript("document.querySelector('.main-control .next').click();");
  }

  previous() {
    this.window.webContents.executeJavaScript("document.querySelector('.main-control .prev').click();");
  }

  /**
   * Create the touch bar for macOS
   */
  createTouchBar() {
    return new TouchBar([
      new TouchBarButton({
        icon: nativeImage.createFromNamedImage('NSTouchBarRewindTemplate', [-1, 0, 1]),
        click: () => this.previous()
      }),
      new TouchBarButton({
        icon: nativeImage.createFromNamedImage('NSTouchBarPlayPauseTemplate', [-1, 0, 1]),
        click: () => this.pausePlay()
      }),
      new TouchBarButton({
        icon: nativeImage.createFromNamedImage('NSTouchBarFastForwardTemplate', [-1, 0, 1]),
        click: () => this.next()
      })
    ]);
  }

  /**
   * Add the listener to monitor the play time.
   */
  addPlaytimeObserver() {
    this.window.webContents.executeJavaScript(`
        var playtime = document.querySelector('.audio-progress .bar .handle');
        var observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                ipc.send('playtime', playtime.innerText);
            });
        });
    
        observer.observe(playtime, {attributes: true});
    `)
  }

  /**
   * Remove the listener to monitor the play time.
   */
  removePlaytimeObserver() {
    this.window.webContents.executeJavaScript(`
      observer.disconnect();
    `)
  }

  prettyLyric(lyric) {
    return lyric.replace(/<\d*>/g, '');
  }

  /**
   * Handle the received response after the web content make a request.
   * @param {*} details the response details
   */
  handleResponse(details) {
    const url = details.url;
    RegExp(getPlayInfoUrlPrefix).test(url) && this.getTrackInfo(url);
    RegExp(getSongDetailsUrlPrefix).test(url) && (this.getSongDetailsUrl = url);
  }

  getTrackInfo(url) {
    const songId = url.match(/\[(.*)\]/)[1];
    if (this.getSongDetailsUrl) {
      this.getTrackDetails(songId);
    } else {
      setTimeout(() => this.getTrackInfo(url), 1000);
    }
  }

  getTrackDetails(songId) {
    let urlWithPath = urlLib.parse(this.getSongDetailsUrl);

    // get the cookie, make call with the cookie
    let session = this.window.webContents.session;
    session.cookies.get({url: 'https://www.xiami.com'}, (error, cookies) => {
      let cookieString = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

      const req = https.request({
        hostname: urlWithPath.host,
        path: urlWithPath.path,
        method: 'POST',
        headers: {
          'Referer': URLS.home,
          'Cookie': cookieString,
          'User-Agent': this.window.webContents.getUserAgent(),
          'Content-Type': 'application/json'
        }
      }, (response) => {
        let playlistData = '';

        response.on('data', (chunk) => {
          playlistData += chunk;
        });

        response.on('end', () => {
          const response = JSON.parse(playlistData);
          if (response.result) {
            const details = response.result.data.songDetails[0];
            const {songName, singers, albumName, albumLogo, lyric} = details;
            details && this.notify(songName, singers, albumName, albumLogo);
            lyric && this.loadLyrics(lyric);
            albumLogo && this.lyricsController.window.webContents.send('albumUpdate', albumLogo);
          }
        });
      });

      req.write(`{"songIds": [${songId}]}`);
      req.end();
    });
  }

  notify(trackName, singers, albumName, albumLogo) {
    const showNotification = settings.get('showNotification', 'check');
    if ('check' === showNotification) {
      const title = `${Locale.NOTIFICATION_TRACK}: ${trackName}`;
      const body = `${Locale.NOTIFICATION_ARTIST}: ${singers}
${Locale.NOTIFICATION_ALBUM}: ${albumName}`;
      this.notificationController.notify(albumLogo, title, body);
    }
  }

  /**
   * Load the lyrics into the application
   * @param {string} url the lyrics url
   */
  loadLyrics(url) {
    this.lyrics.load('');
    download(url).then(buffer => {
      this.lyrics.load(buffer);
    });
  }


}

module.exports = XiamiPlayer;
