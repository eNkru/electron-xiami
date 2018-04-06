const { app, Menu, nativeImage, Tray } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const settings = require('electron-settings');

const language = fs.existsSync(`${app.getPath('userData')}/Settings`) ? settings.get('language', 'en') : 'en';
const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');
const macOS = process.platform === 'darwin' ? true : false;

class RadioTray {
  constructor(radioController) {
    this.radioController = radioController;
    this.init();
  }

  init() {
    const trayIconPath = macOS ? '../../assets/icon_radio_black.png' : '../../assets/icon_radio_white.png';
    this.tray = new Tray(nativeImage.createFromPath(path.join(__dirname, trayIconPath)));
    this.tray.setToolTip(Locale.TRAY_TOOLTIP_RADIO);

    const content = Menu.buildFromTemplate([
      {label: Locale.TRAY_SWITCH_TO_PLAYER, click: () => this.switchToPlayerMode()},
      {label: `${Locale.TRAY_EXIT} (Version: ${app.getVersion()})`, click: () => this.cleanupAndExit()},
    ]);

    this.tray.setContextMenu(content);

    this.tray.on('click', () => this.toggleRadioWindow());
  }

  switchToPlayerMode() {
    settings.set('radio', false);
    app.relaunch();
    app.exit();
  }

  toggleRadioWindow() {
    if (this.radioController.window.isVisible()) {
      this.radioController.window.hide();
    } else {
      this.radioController.window.show();
    }
  }

  cleanupAndExit() {
    app.exit(0);
  }
}

module.exports = RadioTray;