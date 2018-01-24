const {app} = require('electron');
const fs = require('fs-extra')
const PlayerController = require('./controller/player-controller');
const SettingsController = require('./controller/settings-controller');
const AppTray = require('./controller/app-tray-controller');
const LyricsController = require('./controller/lyrics-controller');
const UpdateController = require('./controller/update-controller');

class ElectronXiami {

  // constructor.
  constructor() {
    app.disableHardwareAcceleration();
    this.lyricsController = null;
    this.settingsController = null;
    this.playerController = null;
    this.tray = null;
  }

  // init method, the entry point of the app.
  init() {
    if (this.isRunning()) {
      app.quit();
    } else {
      this.initApp();
    }
  }

  // check if the app is already running. return true if already launched, otherwise return false.
  isRunning() {
    return app.makeSingleInstance(() => {
      if (this.playerController) this.playerController.show();
    });
  }

  // init the main app.
  initApp() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', () => {
      this.createLyrics();
      this.createSettings();
      this.createPlayer(this.lyricsController);
      this.createTray(this.settingsController, this.lyricsController, this.playerController);

      // check update
      new UpdateController().checkUpdate();
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit()
      }
    });

    app.on('quit', () => {
      // empty cover cache folder before exit.
      fs.remove(`${app.getPath('userData')}/covers`);
      // empty lyrics cache
      fs.remove(`${app.getPath('userData')}/lyrics`);
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.playerController === null) {
        this.createPlayer();
      } else {
        this.playerController.show();
      }
    });
  }

  createSettings() {
    this.settingsController = new SettingsController();
  }

  createLyrics() {
    this.lyricsController = new LyricsController();
  }

  createPlayer(lyricsController) {
    this.playerController = new PlayerController(lyricsController);
  }

  createTray(settingController, lyricsController, playerController) {
    this.tray = new AppTray(playerController, settingController, lyricsController);
  }
}

new ElectronXiami().init();