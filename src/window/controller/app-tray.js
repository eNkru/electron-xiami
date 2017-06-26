const path = require('path');
const { app, Menu, nativeImage, Tray, ipcMain } = require('electron');

class AppTray {
    constructor(playerWindow) {
        this.playerWindow = playerWindow;
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
            {label: 'Show', click: () => this.playerWindow.show()},
            {label: 'Play | Pause', click: () => this.playerWindow.isPlaying ? this.playerWindow.pause() : this.playerWindow.play()},
            {label: 'Next', click: () => this.playerWindow.next()},
            {label: 'Previous', click: () => this.playerWindow.previous()},
            {label: 'Exit', click: () => app.exit(0)},
        ]);

        this.tray.setContextMenu(context);

        this.tray.on('click', () => this.togglePlayerWindow());
    }

    togglePlayerWindow() {
        if (this.playerWindow.isVisible()) {
            this.playerWindow.hide();
        } else {
            this.playerWindow.show();
        }
    }
}

module.exports = AppTray;