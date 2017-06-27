const path = require('path');
const { app, Menu, nativeImage, Tray, ipcMain } = require('electron');

class AppTray {
    constructor(player) {
        this.player = player;
        this.init();
    }

    init() {

        //initial the tray
        let trayIcon;
        if (process.platform === 'linux' || process.platform === 'win32') {
            trayIcon = nativeImage.createFromPath(path.join(__dirname, '../../../assets/icon_white.png'));
        } else {
            trayIcon = nativeImage.createFromPath(path.join(__dirname, '../../../assets/icon_black_macos.png'))
        }
        trayIcon.setTemplateImage(true);
        this.tray = new Tray(trayIcon);
        this.tray.setToolTip('Xiami Music');

        //set the context menu
        const context = Menu.buildFromTemplate([
            {label: 'Show', click: () => this.player.show()},
            {label: 'Play | Pause', click: () => this.togglePlay()},
            {label: 'Next', click: () => this.player.next()},
            {label: 'Previous', click: () => this.player.previous()},
            {label: 'Exit', click: () => app.exit(0)},
        ]);

        this.tray.setContextMenu(context);

        this.tray.on('click', () => this.togglePlayerWindow());
    }

    togglePlay() {
        this.player.getWebContents().executeJavaScript("document.querySelector('.pause-btn')", (result) => {
            result ? this.player.pause() : this.player.play();
        });
    }

    togglePlayerWindow() {
        if (this.player.isVisible()) {
            this.player.hide();
        } else {
            this.player.show();
        }
    }
}

module.exports = AppTray;