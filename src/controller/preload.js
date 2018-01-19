const {ipcRenderer} = require('electron');
process.once('loaded', function() {
  global.ipc= ipcRenderer;
});