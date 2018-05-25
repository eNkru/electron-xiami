const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
const settings = require('electron-settings');

class UpdateController {

  constructor() {
    autoUpdater.autoDownload = false;

    const language = settings.get('language', 'en');
    const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');

    autoUpdater.on('update-available', (info) => {
      dialog.showMessageBox({
        type: "info",
        buttons: [Locale.UPDATE_CANCEL_BUTTON, Locale.UPDATE_OK_BUTTON],
        defaultId: 1,
        cancelId: 0,
        title: Locale.UPDATE_TITLE,
        message: Locale.UPDATE_MESSAGE,
        detail: `${info.releaseNotes}`
      }, response => {
        if (response) {
          autoUpdater.downloadUpdate().then(downloads => {
            autoUpdater.quitAndInstall();
          });
        }
      });
    });
  }

  checkUpdate() {
    autoUpdater.checkForUpdates()
  }
}

module.exports = UpdateController;