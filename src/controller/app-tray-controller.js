const path = require('path');
const { app, Menu, nativeImage, Tray, ipcMain } = require('electron');
const storage = require('electron-json-storage');
const settings = require('electron-settings');

const language = settings.get('language', 'en');
const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');

class AppTray {
    constructor(playerController, settingsController) {
        this.playerController = playerController;
        this.settingsController = settingsController;
        this.init();
    }

    init() {

        //initial the tray
        let trayIcon;
        if (process.platform === 'linux' || process.platform === 'win32') {
            trayIcon = nativeImage.createFromPath(path.join(__dirname, '../../assets/icon_white.png'));
        } else {
            trayIcon = nativeImage.createFromPath(path.join(__dirname, '../../assets/icon_black_macos.png'))
        }
        trayIcon.setTemplateImage(true);
        this.tray = new Tray(trayIcon);
        this.tray.setToolTip(Locale.TRAY_TOOLTIP);

        //set the context menu
        const context = Menu.buildFromTemplate([
            {label: Locale.TRAY_PLAY_PAUSE, icon: path.join(__dirname, '../../assets/icon_play.png'), click: () => this.togglePlay()},
            {label: Locale.TRAY_NEXT, icon: path.join(__dirname, '../../assets/icon_next.png'), click: () => this.playerController.next()},
            {label: Locale.TRAY_PREVIOUS, icon: path.join(__dirname, '../../assets/icon_previous.png'), click: () => this.playerController.previous()},
            {label: 'Separator', type: 'separator'},
            {label: Locale.TRAY_SETTINGS, icon: path.join(__dirname, '../../assets/icon_settings.png'), click: () => this.openSettings()},
            {label: Locale.TRAY_EXIT, click: () => this.cleanupAndExit()},
        ]);

        this.tray.setContextMenu(context);

        this.tray.on('click', () => this.togglePlayerWindow());
    }

    togglePlay() {
        this.playerController.getWebContents().executeJavaScript("document.querySelector('.pause-btn')", (result) => {
            result ? this.playerController.pause() : this.playerController.play();
        });
    }

    togglePlayerWindow() {
        if (this.playerController.isVisible()) {
            this.playerController.hide();
        } else {
            this.playerController.show();
        }
    }

    openSettings() {
        this.settingsController.show();
    }

    cleanupAndExit() {
        storage.clear((error) => {
            if (error) throw error;
            console.log(app.getPath('userData'));
            app.exit(0);
        });
    }
}

module.exports = AppTray;