const {app, globalShortcut} = require('electron');
const path = require('path');
const fs = require('fs-extra')
const dbus = require('dbus-native');
const PlayerController = require('./controller/player-controller');
const AppTray = require('./controller/app-tray-controller');
const LyricsController = require('./controller/lyrics-controller');
const NotificationController = require('./controller/notification-controller');
const settings = require('electron-settings');
const RadioController = require('./controller/radio-controller');
const RadioTrayController = require('./controller/radio-tray-controller');

class ElectronXiami {
  constructor() {
    this.lyricsController = null;
    this.notificationController = null;
    this.playerController = null;
    this.tray = null;
    console.log(`${app.getPath('userData')}/Settings`)
    this.radioMode = fs.existsSync(`${app.getPath('userData')}/Settings`) ? settings.get('radio', false) : false;
    if (this.radioMode) {
      // Specify flash path, supposing it is placed in the same directory with main.js.
      let pluginName
      switch (process.platform) {
        case 'win32':
          pluginName = 'pepflashplayer.dll'
          break
        case 'darwin':
          pluginName = 'PepperFlashPlayer.plugin'
          break
        case 'linux':
          pluginName = 'libpepflashplayer.so'
          break
      }
      app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, `plugin/pepperflash/${pluginName}`));
      app.commandLine.appendSwitch('ppapi-flash-version', '29.0.0.113-1');
    }
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

      if (this.radioMode) {
        this.playerController = new RadioController();
        this.tray = new RadioTrayController(this.playerController);
      } else {
        this.lyricsController = new LyricsController();
        this.notificationController = new NotificationController();
        this.playerController = new PlayerController(this.lyricsController, this.notificationController);
        this.tray = new AppTray(this.playerController, this.lyricsController, this.notificationController);

        this.registerMediaKeys('gnome');
        this.registerMediaKeys('mate');
      }
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit()
      }
    });

    app.on('before-quit', () => {
      this.tray.tray.destroy();
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
        this.playerController = new PlayerController(this.lyricsController);
      } else {
        this.playerController.show();
      }
    });
  }

  registerMediaKeys(desktopEnvironment) {
    try {
      const sessionBus = dbus.sessionBus();
      sessionBus.getService(`org.${desktopEnvironment}.SettingsDaemon.MediaKeys`).getInterface(
        `/org/${desktopEnvironment}/SettingsDaemon/MediaKeys`, 
        `org.${desktopEnvironment}.SettingsDaemon.MediaKeys`, (error, mediaKeys) => {
          if(!error) {
            mediaKeys.on('MediaPlayerKeyPressed', (n, keyName) => {
              switch (keyName) {
                case 'Next': this.playerController.next(); return;
                case 'Previous': this.playerController.previous(); return;
                case 'Play': this.playerController.toggle(); return;
                case 'Stop': this.playerController.pause(); return;
              }
            });
  
            mediaKeys.GrabMediaPlayerKeys('org.gnome.SettingsDaemon.MediaKeys', 0);
          } else {
            this.addMediaGlobalShortcut();
          }
        }
      )
    } catch (error) {
      this.addMediaGlobalShortcut();
    }
  }

  addMediaGlobalShortcut() {
    globalShortcut.register('MediaPlayPause', () => this.playerController.toggle());
    globalShortcut.register('MediaNextTrack', () => this.playerController.next());
    globalShortcut.register('MediaPreviousTrack', () => this.playerController.previous());
    globalShortcut.register('MediaStop', () => this.playerController.pause());
  }

}

new ElectronXiami().init();