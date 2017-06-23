const { BrowserWindow } = require('electron');
const urlLib = require('url');
const path = require('path');
const fetch = require('electron-fetch');
const storage = require('electron-json-storage');

const playlistUrl = 'http://www.xiami.com/song/playlist';
const getSongUrl = 'http://www.xiami.com/song/gethqsong';

class XiamiPlayer {
    constructor() {
        this.playerWindow = null;
        this.playerUrl = 'http://www.xiami.com/play';
        this.init();
    }

    init() {
        this.playerWindow = new BrowserWindow({
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
        this.playerWindow.loadURL(this.playerUrl);

        // triggering when user try to close the play window.
        this.playerWindow.on('close', (e) => {
            if (this.playerWindow.isVisible()) {
                e.preventDefault();
                this.playerWindow.hide();
            }
        });

        // triggering after the play window closed.
        this.playerWindow.on('closed', () => {
            this.playerWindow = null;
        });

        this.playerWindow.webContents.on('did-get-response-details', ((status, newURL, originalURL) => this.registerResponseFilters(originalURL)));
    }

    // display and focus the player window.
    show() {
        this.playerWindow.show();
        this.playerWindow.focus();
    }

    // hide the play window.
    hide() {
        this.playerWindow.hide();
    }

    // return a boolean to indicate if the window is visible or not
    isVisible() {
        return this.playerWindow.isVisible();
    }

    registerResponseFilters(requestUrl) {
        this.updatePlaylistListener(requestUrl);
        this.changeTrackListener(requestUrl);
    }

    updatePlaylistListener(requestUrl) {
        if (requestUrl.startsWith(playlistUrl)) {
            let urlWithPath = urlLib.parse(requestUrl, false);
            delete urlWithPath.search;
            console.log('Retrieve the playlist from url ' + urlLib.format(urlWithPath));
            fetch(urlLib.format(urlWithPath)).then(res => res.json()).then(json => {
                // clear the local storage.
                storage.clear((error) => {
                    if (error) console.log(error);
                });

                // refresh the local storage.
                json.data.trackList.forEach(track => {
                    storage.set(track.songId, track, (error) => {
                        if (error) console.log(error);
                    });
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    changeTrackListener(requestUrl) {
        if (requestUrl.startsWith(getSongUrl)) {
            let pathname = urlLib.parse(requestUrl).pathname;
            console.log(path.parse(pathname).base);
        }
    }
}

module.exports = XiamiPlayer;