const path = require('path');
const { app, Menu, nativeImage, Tray, ipcMain } = require('electron');
const storage = require('electron-json-storage');
const fs = require('fs-extra');
const settings = require('electron-settings');
const SettingsController = require('./settings-controller');
const URLS = require('../configuration/urls');

// const language = fs.existsSync(`${app.getPath('userData')}/Settings`) ? settings.get('language', 'sc') : 'sc';
// const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');
const Locale = require('../locale/locale_sc');
const macOS = process.platform === 'darwin';

class AppTray {
  constructor(playerController, lyricsController, notificationController) {
    this.playerController = playerController;
    this.lyricsController = lyricsController;
    this.notificationController = notificationController;
    this.settingController = new SettingsController();
    this.init();
  }

  init() {
    this.tray = new Tray(this.createTrayIcon(settings.get('trayClickEvent', 'showMain')));
    this.tray.setToolTip(Locale.TRAY_TOOLTIP);

    //set the context menu
    const context = Menu.buildFromTemplate([
      {label: Locale.TRAY_SHOW_MAIN, click: () => this.togglePlayerWindow()},
      {label: Locale.TRAY_PLAY_PAUSE, click: () => this.playerController.pausePlay()},
      {label: Locale.TRAY_NEXT, click: () => this.playerController.next()},
      {label: Locale.TRAY_PREVIOUS, click: () => this.playerController.previous()},
      {label: 'Separator', type: 'separator'},
      {label: Locale.TRAY_WINDOW_FRAME, type: 'checkbox', checked: settings.get('showWindowFrame', true), click: () => this.toggleWindowFrame()},
      {label: Locale.TRAY_DARK_MODE, type: 'checkbox', checked: settings.get('darkMode', false), click: () => this.toggleDarkMode()},
      {label: Locale.TRAY_HIDE_SCROLLBAR, type: 'checkbox', checked: settings.get('hideScrollbar', false), click: () => this.togglescrollbar()},
      {label: Locale.TRAY_PLAYER_MODE, submenu: [
        {label: Locale.TRAY_PLAYER_MODE_SUGGESTION, type: 'radio', checked: 'suggestion' === settings.get('customLayout', 'suggestion'), click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_SUGGESTION_VALUE)},
        {label: Locale.TRAY_PLAYER_MODE_BILLBOARD, type: 'radio', checked: 'billboard' === settings.get('customLayout', 'suggestion'), click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_BILLBOARD_VALUE)},
        {label: Locale.TRAY_PLAYER_MODE_COLLECTION, type: 'radio', checked: 'collection' === settings.get('customLayout', 'suggestion'), click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_COLLECTION_VALUE)},
        {label: Locale.TRAY_PLAYER_MODE_ARTIST, type: 'radio', checked: 'artist' === settings.get('customLayout', 'suggestion'), click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_ARTIST_VALUE)},
        {label: Locale.TRAY_PLAYER_MODE_ALBUM, type: 'radio', checked: 'album' === settings.get('customLayout', 'suggestion'), click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_ALBUM_VALUE)},
        // {label: Locale.TRAY_PLAYER_MODE_MINI, type: 'radio', checked: 'mini' === settings.get('customLayout', 'suggestion'), click: () => this.changePlayerMode(Locale.TRAY_PLAYER_MODE_MINI_VALUE)}
      ]},
      {label: Locale.TRAY_LYRICS_TOGGLE, click: () => this.toggleLyrics()},
      {label: Locale.TRAY_SWITCH_TO_RADIO, click: () => this.switchToRadioMode()},
      {label: 'Separator', type: 'separator'},
      {label: Locale.TRAY_SETTINGS, click: () => this.openSettings()},
      {label: `${Locale.TRAY_EXIT} (Version: ${app.getVersion()})`, click: () => this.cleanupAndExit()},
    ]);

    this.tray.setContextMenu(context);

    this.tray.on('click', () => this.fireClickTrayEvent());

    ipcMain.on('trayClickEvent', (event, value) => {
      this.tray.setImage(this.createTrayIcon(value));
    });

    ipcMain.on('lyricsClose', () => this.toggleLyrics());
    ipcMain.on('lyricsPrevious', () => this.playerController.previous());
    ipcMain.on('lyricsNext', () => this.playerController.next());
    ipcMain.on('lyricsPausePlay', () => this.playerController.pausePlay());
  }

  createTrayIcon(trayClickMode) {
    switch (trayClickMode) {
      case 'playPause':
        return macOS ? nativeImage.createFromPath(path.join(__dirname, '../../assets/icon_play_pause_black.png')) : nativeImage.createFromPath(path.join(__dirname, '../../assets/icon_play_pause_white.png'));
      case 'nextTrack':
        return macOS ? nativeImage.createFromPath(path.join(__dirname, '../../assets/icon_next_black.png')) : nativeImage.createFromPath(path.join(__dirname, '../../assets/icon_next_white.png'));
      default:
        return macOS ? nativeImage.createFromPath(path.join(__dirname, '../../assets/icon_black_macos.png')) : nativeImage.createFromPath(path.join(__dirname, '../../assets/icon_white.png'));
    }
  }

  toggleWindowFrame() {
    settings.set('showWindowFrame', !settings.get('showWindowFrame'));
    this.playerController.window.destroy();
    this.playerController.init();
  }

  toggleDarkMode() {
    settings.set('darkMode', !settings.get('darkMode'));
    this.playerController.window.destroy();
    this.playerController.init();
  }

  togglescrollbar() {
    settings.set('hideScrollbar', !settings.get('hideScrollbar'));
    this.playerController.window.destroy();
    this.playerController.init();
  }

  toggleLyrics() {
    if (!this.lyricsController.window.isVisible()) {
      this.playerController.addPlaytimeObserver();
    } else {
      this.playerController.removePlaytimeObserver();
    }
    this.lyricsController.toggle();
  }

  fireClickTrayEvent() {
    const option = settings.get('trayClickEvent', 'showMain');
    if( option === 'showMain') {
      this.togglePlayerWindow();
    } else if (option === 'showTrackInfo') {
      this.notifyTrackInfo();
    } else if (option === 'nextTrack') {
      this.playerController.next();
    } else {
      this.playerController.toggle();
    }
  }

  notifyTrackInfo() {
    storage.get('currentTrackInfo', (error, trackInfo) => {
      if (error) throw error;

      // notify the current playing track
      if (Object.keys(trackInfo).length > 0) {
        const title = `${Locale.NOTIFICATION_TRACK}: ${trackInfo.songName}`;
        const body = `${Locale.NOTIFICATION_ARTIST}: ${trackInfo.artist_name}
${Locale.NOTIFICATION_ALBUM}: ${trackInfo.album_name}`;

        this.notificationController.notify(trackInfo.pic, title, body);
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

  switchToRadioMode() {
    settings.set('radio', true);
    const appImagePath = process.env.APPIMAGE;
    if (appImagePath) {
      app.relaunch({execPath: appImagePath});
    } else {
      app.relaunch();
    }
    app.exit();
  }

  changePlayerMode(mode) {
    settings.set('customLayout', mode);
    this.playerController.window.loadURL(URLS.getUrl(mode));
  }

  openSettings() {
    this.settingController.show();
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