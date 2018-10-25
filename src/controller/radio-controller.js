const {BrowserWindow} = require('electron')
const CssInjector = require('../js/css-injector');

class RadioController {

  constructor() {
    this.init();
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
}

module.exports = RadioController;