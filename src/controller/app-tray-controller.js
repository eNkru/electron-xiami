const path = require('path');
const { app, Menu, nativeImage, Tray, ipcMain } = require('electron');
const storage = require('electron-json-storage');
const settings = require('electron-settings');
const notifier = require('node-notifier');

const language = settings.get('language', 'en');
const trayClickEvent = settings.get('trayClickEvent', 'showMain');
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
            {label: Locale.TRAY_SHOW_MAIN, click: () => this.playerController.show()},
            {label: Locale.TRAY_PLAY_PAUSE, click: () => this.togglePlay()},
            {label: Locale.TRAY_NEXT, click: () => this.playerController.next()},
            {label: Locale.TRAY_PREVIOUS, click: () => this.playerController.previous()},
            {label: 'Separator', type: 'separator'},
            {label: Locale.TRAY_SETTINGS, click: () => this.openSettings()},
            {label: Locale.TRAY_EXIT, click: () => this.cleanupAndExit()},
        ]);

        this.tray.setContextMenu(context);

        this.tray.on('click', () => this.fireClickTrayEvent());
    }

    togglePlay() {
        this.playerController.getWebContents().executeJavaScript("document.querySelector('.pause-btn')", (result) => {
            result ? this.playerController.pause() : this.playerController.play();
        });
    }

    fireClickTrayEvent() {
        if(trayClickEvent === 'showMain') {
            this.togglePlayerWindow();
        } else {
            this.notifyTrackInfo();
        }
    }

    notifyTrackInfo() {
        storage.get('currentTrackInfo', (error, trackInfo) => {
            if (error) throw error;

            // notify the current playing track
                if (Object.keys(trackInfo).length > 0) {
                    notifier.notify({
                        'icon': path.join(__dirname, '../../assets/icon.png'),
                        'title': `${Locale.NOTIFICATION_TRACK}: ${trackInfo.songName}`,
                        'message': `${Locale.NOTIFICATION_ARTIST}: ${trackInfo.artist_name}
${Locale.NOTIFICATION_ALBUM}: ${trackInfo.album_name}`
                    });
                }
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