const {BrowserWindow, ipcMain} = require('electron')
const CssInjector = require('../configuration/css-injector');
const path = require('path');
const isOnline = require('is-online');

class RadioController {

  constructor() {
    this.initSplash();
    setTimeout(() => this.checkConnectionAndStart(), 500);
  }

  init() {
    this.window = new BrowserWindow({
      width: 1000,
      height: 470,
      show: false,
      frame: true,
      autoHideMenuBar: true,
      webPreferences: {
        plugins: true
      },
    });

    this.window.on('close', (e) => {
      if (this.window.isVisible()) {
        e.preventDefault();
        this.window.hide();
      }
    });

    this.window.loadURL('http://www.xiami.com/radio');

    this.window.webContents.on('dom-ready', () => {
      this.window.webContents.insertCSS(CssInjector.radio);
      this.show();
    });
  }

  show() {
    this.window.show();
    this.window.focus();
  }

  initSplash() {
    this.splashWin = new BrowserWindow({
      width: 300,
      height: 300,
      frame: false,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true
      }
    });
    this.splashWin.loadURL(`file://${path.join(__dirname, '../view/splash.html')}`);

    ipcMain.on('reconnect', () => {
      this.checkConnectionAndStart();
    });
  }

  checkConnectionAndStart() {
    (async () => await isOnline({timeout: 15000}))().then(result => {
      if (result) {
        setTimeout(() => this.init(), 1000);
      } else {
        this.splashWin.webContents.send('connect-timeout');
      }
    });
  }
}

module.exports = RadioController;