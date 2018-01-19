const {ipcRenderer} = require('electron');

ipcRenderer.on('lyricsChange', (event, value) => {
  $('.lyrics-line').text(value);
});