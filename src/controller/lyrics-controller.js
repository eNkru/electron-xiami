const path = require('path');
const { BrowserWindow, protocol } = require('electron');

class LyricsWindow {

  constructor() {
    this.init();
  }

  init() {
    protocol.unregisterProtocol('', () => {
      this.window = new BrowserWindow({
        width: 850,
        height: 50,
        transparent: true,
        frame: false,
        autoHideMenuBar: true,
        x: 300,
        y: 800,
        show: false
      });

      this.window.loadURL(`file://${path.join(__dirname, '../view/lyrics.html')}`);
      this.window.on('close', (e) => {
        if (this.window.isVisible()) {
          e.preventDefault();
          this.window.hide();
        }
      });

      setInterval(() => {this.window.setAlwaysOnTop(true, "floating");}, 1000);
    })
  }

  toggle() {
    this.window.isVisible() ? this.window.hide() : this.window.show();
  }
}

module.exports = LyricsWindow;