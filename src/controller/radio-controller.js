const {BrowserWindow} = require('electron')
class RadioController {

  constructor() {
    this.init();
  }

  init() {
    this.window = new BrowserWindow({
      width: 1000,
      height: 400,
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
  }

  show() {
    this.window.show();
    this.window.focus();
  }
}

module.exports = RadioController;