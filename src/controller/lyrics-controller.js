const path = require('path');
const { BrowserWindow } = require('electron');

class LyricsWindow {

  constructor() {
    this.init();
  }

  init() {
      this.window = new BrowserWindow({
        width: 500,
        height: 200,
        transparent: true,
        autoHideMenuBar: true,
        show: false
      });
    //   this.window.loadURL(`file://${path.join(__dirname, '../view/setting.html')}`);
      this.window.on('close', (e) => {
        if (this.window.isVisible()) {
          e.preventDefault();
          this.window.hide();
        }
      });
  }

  toggle() {
    this.window.isVisible() ? this.window.hide() : this.window.show();
  }
}

module.exports = LyricsWindow;