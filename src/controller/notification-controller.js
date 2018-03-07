const download = require('download');
const {nativeImage, Notification} = require('electron');

class NotificationController {

  constructor() {
    this.notification = null;
  }

  notify(iconUrl, title, body) {
    download(iconUrl).then(buffer => {
      this.notification && this.notification.close();
      this.notification = new Notification({
        title: title,
        body: body,
        silent: true,
        icon: nativeImage.createFromBuffer(buffer)
      });
      this.notification.show();
    });
  }
}

module.exports = NotificationController;