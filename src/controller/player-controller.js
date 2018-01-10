const { app, BrowserWindow, Notification } = require('electron');
const urlLib = require('url');
const http = require('http');
const path = require('path');
const storage = require('electron-json-storage');
const settings = require('electron-settings');
const CssInjector = require('../js/css-injector');
const { download } = require('electron-dl');

const playerUrl = 'http://www.xiami.com/play';
const playlistUrl = 'http://www.xiami.com/song/playlist';
const getLyricUrl = 'http://img.xiami.net/lyric/';

const language = settings.get('language', 'en');
const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');

class XiamiPlayer {
  constructor() {
    this.init();
  }

  init() {
    if (process.platform == 'darwin') {
      this.window = new BrowserWindow({
        width: 1000,
        height: 670,
        minWidth: 1000,
        minHeight: 670,
        titleBarStyle: 'hidden-inset',
        center: true,
        webPreferences: {
          javascript: true,
          plugins: true,
          webSecurity: false,
          nodeIntegration: false
        }
      });
    } else {
      this.window = new BrowserWindow({
        width: 1000,
        height: 670,
        minWidth: 1000,
        minHeight: 670,
        frame: true,
        autoHideMenuBar: true,
        center: true,
        webPreferences: {
          javascript: true,
          plugins: true,
          webSecurity: false,
          nodeIntegration: false
        }
      });
    }


    // load xiami player page.
    this.window.loadURL(playerUrl);

    // inject the custom layout.
    this.window.webContents.on('dom-ready', () => {
      if (process.platform == 'darwin') {
        this.window.webContents.insertCSS(CssInjector.macos);
      }

      const customLayout = settings.get('customLayout', 'default');
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
        default:
          // using the default layout from the xiami play
          break;
      }
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
      this.window = null;
    });

    // intercept the ajax call response
    this.window.webContents.on('did-get-response-details', ((event, status, newURL, originalURL) => this.registerResponseFilters(originalURL)));
  }

  // display and focus the player window.
  show() {
    this.window.show();
    this.window.focus();
  }

  // hide the play window.
  hide() {
    this.window.hide();
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

  reload() {
    this.window.reload();
  }

  getWebContents() {
    return this.window.webContents;
  }

  registerResponseFilters(requestUrl) {
    const showNotification = settings.get('showNotification', 'check');
    if ('check' === showNotification) {
      this.updatePlaylistListener(requestUrl);
      this.changeTrackListener(requestUrl);
    }
  }

  updatePlaylistListener(requestUrl) {
    if (requestUrl.startsWith(playlistUrl)) {
      let urlWithPath = urlLib.parse(requestUrl, false);
      delete urlWithPath.search;
      // console.log('Retrieve the playlist from url ' + urlLib.format(urlWithPath));

      // get the cookie, make call with the cookie
      let session = this.window.webContents.session;
      session.cookies.get({ url : 'http://www.xiami.com' }, (error, cookies) => {
        let cookieString =cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

        http.get({hostname: urlWithPath.host, path: urlWithPath.pathname, headers: {
          'Referer': playerUrl,
          'Cookie': cookieString,
          'User-Agent': this.window.webContents.getUserAgent()
        }}, (response) => {
          let playlistData = '';

          response.on('data', (chunk) =>{
            playlistData += chunk;
          });

          response.on('end', () =>{
            let tracks = JSON.parse(playlistData).data.trackList;
            // set the first track as current playing
            // this will avoid the current playing tack is not available because the switch song start early then this callback return.
            storage.set('currentTrackInfo', tracks[0], (error) => {
              if(error) throw error;
            });

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
  }

  changeTrackListener(requestUrl) {
    if (requestUrl.startsWith(getLyricUrl)) {
      const lyricPath = urlLib.parse(requestUrl).pathname;
      const songId = lyricPath.match(/\/(\d*)_/)[1];
      // console.log(songId);

      storage.get(songId, (error, trackInfo) => {
        if (error) throw error;
        // update the current playing track
        storage.set('currentTrackInfo', trackInfo, (error) => {
          if (error) console.log(error);
        })

        // notify the current playing track
        if (Object.keys(trackInfo).length > 0) {

          // download the covers
          download(this.window, trackInfo.pic, {directory: `${app.getPath('userData')}/covers`})
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
              }).catch(console.error);
        }
      });
    }
  }
}

module.exports = XiamiPlayer;