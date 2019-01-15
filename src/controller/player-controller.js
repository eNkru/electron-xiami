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

const playlistUrlPrefix = 'https://www.xiami.com/song/playlist*';
const getLyricUrlPrefix = 'https://img.xiami.net/lyric/*';

// const language = fs.existsSync(`${app.getPath('userData')}/Settings`) ? settings.get('language', 'sc') : 'sc';
// const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');
const Locale = require('../locale/locale_sc');

class XiamiPlayer {
  constructor(lyricsController, notificationController) {
    this.notificationController = notificationController;
    this.lyricsController = lyricsController;
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
          show: false, width: 1150, height: 650, titleBarStyle: 'hiddenInset',
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
          show: false, width: 1150, height: 650, frame: false, autoHideMenuBar: true,
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

      // if (process.platform == 'darwin') {
      //   this.window.webContents.insertCSS(CssInjector.macos);
      // }

      this.window.show();

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
    session.defaultSession.webRequest.onCompleted({urls: [playlistUrlPrefix, getLyricUrlPrefix]}, (details) => this.handleResponse(details));

    ipcMain.on('playtime', (event, value) => {
      const timeline = this.lyrics.select(timeFormat.toS(value));
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
  }

  // display and focus the player window.
  show() {
    this.window.show();
    this.window.focus();
  }

  // return a boolean to indicate if the window is visible or not
  isVisible() {
    return this.window.isVisible();
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
        click: () => this.toggle()
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
        let playtime = document.querySelector('.player-position');
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                ipc.send('playtime', playtime.innerHTML);
            });
        });
    
        observer.observe(playtime, {childList: true});
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
    // const url = details.url
    // RegExp(playlistUrlPrefix).test(url) && this.updatePlaylist(url);
    //
    // if (RegExp(getLyricUrlPrefix).test(url)) {
    //   // Load Lyrics.
    //   this.loadLyrics(url);
    //
    //   // Load track change notification.
    //   const showNotification = settings.get('showNotification', 'check');
    //   if ('check' === showNotification) {
    //     const lyricPath = urlLib.parse(url).pathname;
    //     const songId = lyricPath.match(/\/(\d*)_/)[1];
    //     this.notifyTrackChange(songId);
    //   }
    // }
  }

  /**
   * Update the playlist if the request URL is for playlist update.
   * @param {string} requestUrl the request URL for the event
   */
  updatePlaylist(requestUrl) {
    let urlWithPath = urlLib.parse(requestUrl, false);
    delete urlWithPath.search;
    // console.log('Retrieve the playlist from url ' + urlLib.format(urlWithPath));

    // get the cookie, make call with the cookie
    let session = this.window.webContents.session;
    session.cookies.get({url: 'https://www.xiami.com'}, (error, cookies) => {
      let cookieString = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

      https.get({
        hostname: urlWithPath.host, path: urlWithPath.pathname, headers: {
          'Referer': URLS.home,
          'Cookie': cookieString,
          'User-Agent': this.window.webContents.getUserAgent()
        }
      }, (response) => {
        let playlistData = '';

        response.on('data', (chunk) => {
          playlistData += chunk;
        });

        response.on('end', () => {
          const tracks = JSON.parse(playlistData).data.trackList;
          // refresh the local storage.
          tracks && tracks.forEach(track => {
            storage.set(track.songId, track, (error) => {
              if (error) console.log(error);
            });
          });
        });
      });
    });
  }

  /**
   * Load the lyrics into the application
   * @param {string} url the lyrics url
   */
  loadLyrics(url) {
    https.get(url, (response) => {
      let lyricContent = '';

      response.on('data', (chunk) => {
        lyricContent += chunk;
      });

      response.on('end', () => {
        this.lyrics.load(lyricContent)
      });
    })
  }

  /**
   * Handle the track changed.
   * @param {string} songId the changed song ID
   */
  notifyTrackChange(songId) {
    // console.log(songId)
    storage.get(songId, (error, trackInfo) => {

      if (error) throw error;

      // notify the current playing track
      if (Object.keys(trackInfo).length > 0) {
        // update the current playing track
        storage.set('currentTrackInfo', trackInfo, (error) => {
          if (error) console.log(error);
        });

        const title = `${Locale.NOTIFICATION_TRACK}: ${trackInfo.songName}`;
        const body = `${Locale.NOTIFICATION_ARTIST}: ${trackInfo.artist_name}
${Locale.NOTIFICATION_ALBUM}: ${trackInfo.album_name}`;
        this.notificationController.notify(trackInfo.pic, title, body);
      } else {
        setTimeout(() => this.notifyTrackChange(songId), 1000);
      }
    });
  }
}

module.exports = XiamiPlayer;
