const path = require('path');
const { app, Menu, nativeImage, Tray, ipcMain, Notification } = require('electron');
const storage = require('electron-json-storage');
const settings = require('electron-settings');
const { download } = require('electron-dl');

const language = settings.get('language', 'en');
const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');

class AppTray {
  constructor(playerController, settingsController, lyricsController) {
    this.playerController = playerController;
    this.settingsController = settingsController;
    this.lyricsController = lyricsController;
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
      {label: Locale.TRAY_PLAYER_MODE, submenu: [
        {label: Locale.TRAY_PLAYER_MODE_DEFAULT, click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_DEFAULT_VALUE)},
        {label: Locale.TRAY_PLAYER_MODE_HIDE_LYRICS, click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_HIDE_LYRICS_VALUE)},
        {label: Locale.TRAY_PLAYER_MODE_HIDE_SIDEBAR, click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_HIDE_SIDEBAR_VALUE)},
        {label: Locale.TRAY_PLAYER_MODE_SONG_LIST_ONLY, click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_SONG_LIST_ONLY_VALUE)},
        {label: Locale.TRAY_PLAYER_MODE_MINI, click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_MINI_VALUE)}
      ]},
      {label: "歌词开/关", click: () => this.lyricsController.toggle()},
      {label: 'Separator', type: 'separator'},
      {label: Locale.TRAY_SETTINGS, click: () => this.openSettings()},
      {label: Locale.TRAY_EXIT, click: () => this.cleanupAndExit()},
    ]);

    this.tray.setContextMenu(context);

    this.tray.on('click', () => this.fireClickTrayEvent());
  }

  togglePlay() {
    this.playerController.window.webContents.executeJavaScript("document.querySelector('.pause-btn')", (result) => {
      result ? this.playerController.pause() : this.playerController.play();
    });
  }

  fireClickTrayEvent() {
    if(settings.get('trayClickEvent', 'showMain') === 'showMain') {
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
          // download the covers
          download(this.playerController.window, trackInfo.pic, {directory: `${app.getPath('userData')}/covers`})
          .then(dl => {
            new Notification({
              title: `${Locale.NOTIFICATION_TRACK}: ${trackInfo.songName}`,
              body: `${Locale.NOTIFICATION_ARTIST}: ${trackInfo.artist_name}
${Locale.NOTIFICATION_ALBUM}: ${trackInfo.album_name}`,
              silent: true,
              icon: dl.getSavePath()
            }).show();
          }).catch(console.error);
      }
    });
  }

  togglePlayerWindow() {
    if (this.playerController.isVisible()) {
      this.playerController.window.hide();
    } else {
      this.playerController.show();
    }
  }

  changePlayerMode(mode) {
    settings.set('customLayout', mode);
    this.playerController.window.destroy();
    this.playerController.init();
  }

  openSettings() {
    this.settingsController.show();
  }

  cleanupAndExit() {
    storage.clear((error) => {
      if (error) throw error;
      // console.log(app.getPath('userData'));
      app.exit(0);
    });
  }
}

module.exports = AppTray;