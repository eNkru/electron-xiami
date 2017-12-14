const { app, BrowserWindow } = require('electron');
const urlLib = require('url');
const http = require('http');
const path = require('path');
const storage = require('electron-json-storage');
const notifier = require('node-notifier');
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
    this.window = new BrowserWindow({
      height: 768,
      width: 1024,
      resizable: true,
      frame: true,
      autoHideMenuBar: true,
      webPreferences: {
        javascript: true,
        plugins: true,
        webSecurity: false,
        nodeIntegration: false
      }
    });

    // load xiami player page.
    this.window.loadURL(playerUrl);

    // inject the custom layout.
    this.window.webContents.on('dom-ready', () => {
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
    this.updatePlaylistListener(requestUrl);
    this.changeTrackListener(requestUrl);
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
              notifier.notify({
                icon: dl.getSavePath(),
                title: `${Locale.NOTIFICATION_TRACK}: ${trackInfo.songName}`,
                contentImage: dl.getSavePath(),
                message: `${Locale.NOTIFICATION_ARTIST}: ${trackInfo.artist_name}
${Locale.NOTIFICATION_ALBUM}: ${trackInfo.album_name}`
              });
            }).catch(console.error);
        }
      });
    }
  }
}

module.exports = XiamiPlayer;