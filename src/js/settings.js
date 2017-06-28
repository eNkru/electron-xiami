require('../../resources/semantic.min.js');
const settings = require('electron-settings');

const language = settings.get('language', 'en');
const Locale = language === 'en' ? require('../locale/locale_en') : require('../locale/locale_sc');

$(() => {
  setLocale();
  loadSettings();
});

function setLocale() {
  document.title = Locale.SETTINGS_SETTINGS_TITLE;
  $('#setting-header').text(Locale.SETTINGS_SETTINGS);
  $('#language-title').text(Locale.SETTINGS_LANGUAGE);
}

function loadSettings() {
  $('#language').dropdown('set selected', language);

  $('#language').dropdown({
    onChange: (value) => {
      settings.set('language', value);
    }
  });
}