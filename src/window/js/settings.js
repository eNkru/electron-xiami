require('../../../resources/semantic.min.js');
const settings = require('electron-settings');

$('#language').dropdown('set selected', 'sc');

$('#language').dropdown({
  onChange: (value) => {
    settings.set('language', value);
  }
});
