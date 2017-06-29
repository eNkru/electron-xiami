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
  $('#tray-title').text(Locale.SETTINGS_TRAY);
  $('#tray-click-title').text(Locale.SETTINGS_TRAY_CLICK);
}

function loadSettings() {
  // language setting
  $('#language').dropdown('setup menu', {values: Locale.SETTINGS_LANGUAGE_OPTIONS});
  $('#language').dropdown('set selected', language);

  $('#language').dropdown({
    onChange: (value) => {
      settings.set('language', value);
    }
  });

  // tray click setting
  let trayClick = settings.get('trayClickEvent', 'showMain');
  $('#tray-click').dropdown('setup menu', {values: Locale.SETTINGS_TRAY_CLICK_OPTIONS});
  $('#tray-click').dropdown('set selected', trayClick);

    $('#tray-click').dropdown({
    onChange: (value) => {
      settings.set('trayClickEvent', value);
    }
  });
}