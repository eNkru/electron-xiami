const path = require('path');
const { BrowserWindow, protocol } = require('electron');

class LyricsWindow {

  constructor() {
    this.timer = null;
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
    })
  }

  toggle() {
    if (this.window.isVisible()) {
      this.hide()
    } else {
      this.show()
    }
  }

  hide() {
    clearInterval(this.timer)
    this.window.hide()
  }

  show() {
    this.timer = setInterval(() => {this.window.setAlwaysOnTop(true)}, 1000)
    this.window.show()
  }
}

module.exports = LyricsWindow;