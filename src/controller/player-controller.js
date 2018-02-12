const {app, BrowserWindow, Notification, ipcMain} = require('electron');
const urlLib = require('url');
const http = require('http');
const path = require('path');
const storage = require('electron-json-storage');
const settings = require('electron-settings');
const CssInjector = require('../js/css-injector');
const {download} = require('electron-dl');
const Lyrics = require('../js/lib/lyrics');
const fs = require('fs-extra');
const timeFormat = require('hh-mm-ss');
const UpdateController = require('./update-controller');

const playerUrl = 'http://www.xiami.com/play';
const playlistUrl = 'http://www.xiami.com/song/playlist';
const getLyricUrl = 'http://img.xiami.net/lyric/';

const language = fs.existsSync(`${app.getPath('userData')}/Settings`) ? settings.get('language', 'en') : 'en';
const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');

class XiamiPlayer {
  constructor(lyricsController) {
    this.lyricsController = lyricsController;
    this.init();
  }

  init() {
    this.lyrics = new Lyrics('');
    const customLayout = settings.get('customLayout', 'default');

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
          show: false, width: 1000, height: 670, titleBarStyle: 'hiddenInset',
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
          show: false, width: 1000, height: 670, frame: true, autoHideMenuBar: true,
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
    this.window.loadURL(playerUrl);

    // inject the custom layout.
    this.window.webContents.on('dom-ready', () => {

      this.window.webContents.insertCSS(CssInjector.main);

      if (process.platform == 'darwin') {
        this.window.webContents.insertCSS(CssInjector.macos);
      }

      switch (customLayout) {
        case 'hideSidebar':
          this.window.webContents.insertCSS(CssInjector.hideSidebar);
          break;
        case 'hideLyrics':
          this.window.webContents.insertCSS(CssInjector.hideLyrics);
          break;
        case 'songListOnly':
          this.window.webContents.insertCSS(CssInjector.songListOnly);
          break;
        case 'mini':
          this.window.webContents.insertCSS(CssInjector.mini);
          break;
        default:
          // using the default layout from the xiami play
          break;
      }

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
    this.window.webContents.on('did-get-response-details', ((event, status, newURL, originalURL) => this.handleResponse(originalURL)));

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

  pause() {
    this.window.webContents.executeJavaScript("document.querySelector('.pause-btn').dispatchEvent(new MouseEvent('click'));");
  }

  play() {
    this.window.webContents.executeJavaScript("document.querySelector('.play-btn').dispatchEvent(new MouseEvent('click'));");
  }

  next() {
    this.window.webContents.executeJavaScript("document.querySelector('.next-btn').dispatchEvent(new MouseEvent('click'));");
  }

  previous() {
    this.window.webContents.executeJavaScript("document.querySelector('.prev-btn').dispatchEvent(new MouseEvent('click'));");
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
   * @param {*} requestUrl the request URL for the event
   */
  handleResponse(requestUrl) {
    requestUrl.startsWith(playlistUrl) && this.updatePlaylist(requestUrl);

    if (requestUrl.startsWith(getLyricUrl)) {
      this.loadLyrics(requestUrl).then(() => {

        const showNotification = settings.get('showNotification', 'check');
        if ('check' === showNotification) {
          const lyricPath = urlLib.parse(requestUrl).pathname;
          const songId = lyricPath.match(/\/(\d*)_/)[1];
          this.changeTrack(songId);
        }
      }).catch(console.error);
    }
  }

  /**
   * Update the playlist if the request URL is for playlist update.
   * @param {*} requestUrl the request URL for the event
   */
  updatePlaylist(requestUrl) {
    let urlWithPath = urlLib.parse(requestUrl, false);
    delete urlWithPath.search;
    // console.log('Retrieve the playlist from url ' + urlLib.format(urlWithPath));

    // get the cookie, make call with the cookie
    let session = this.window.webContents.session;
    session.cookies.get({url: 'http://www.xiami.com'}, (error, cookies) => {
      let cookieString = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

      http.get({
        hostname: urlWithPath.host, path: urlWithPath.pathname, headers: {
          'Referer': playerUrl,
          'Cookie': cookieString,
          'User-Agent': this.window.webContents.getUserAgent()
        }
      }, (response) => {
        let playlistData = '';

        response.on('data', (chunk) => {
          playlistData += chunk;
        });

        response.on('end', () => {
          let tracks = JSON.parse(playlistData).data.trackList;
          // refresh the local storage.
          tracks.forEach(track => {
            // console.log(track);
            storage.set(track.songId, track, (error) => {
              if (error) console.log(error);
            });
          });
        });
      });
    });
  }

  /**
   * Handle the track changed.
   * @param {*} songId the changed song ID
   */
  changeTrack(songId) {
    storage.get(songId, (error, trackInfo) => {

      if (error) throw error;

      // notify the current playing track
      if (Object.keys(trackInfo).length > 0) {
        // update the current playing track
        storage.set('currentTrackInfo', trackInfo, (error) => {
          if (error) console.log(error);
        })

        // download the covers
        return download(this.window, trackInfo.pic, {directory: `${app.getPath('userData')}/covers`})
            .then(dl => {
              const notification = new Notification({
                title: `${Locale.NOTIFICATION_TRACK}: ${trackInfo.songName}`,
                body: `${Locale.NOTIFICATION_ARTIST}: ${trackInfo.artist_name}
${Locale.NOTIFICATION_ALBUM}: ${trackInfo.album_name}`,
                silent: true,
                icon: dl.getSavePath()
              });

              notification.on("click", () => this.show());
              notification.show();
            });
      } else {
        setTimeout(() => this.changeTrack(songId), 1000);
      }
    });
  }

  loadLyrics(url) {
    return download(this.window, url, {directory: `${app.getPath('userData')}/lyrics`})
        .then(dl => {
          fs.readFile(dl.getSavePath(), 'utf8', (error, data) => {
            this.lyrics.load(data);
          });
        });
  }
}

module.exports = XiamiPlayer;