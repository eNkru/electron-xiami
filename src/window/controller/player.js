const { BrowserWindow } = require('electron');

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

        this.playerWindow.loadURL(this.playerUrl);

        this.playerWindow.on('closed', () => {
            this.playerWindow = null;
        });
    }

    show() {
        this.playerWindow.show();
        this.playerWindow.focus();
    }
}

module.exports = XiamiPlayer;