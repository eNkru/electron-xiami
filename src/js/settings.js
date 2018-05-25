require('../../resources/semantic.min.js');
const settings = require('electron-settings');
const {ipcRenderer} = require('electron');

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
  $('#custom-layout-title').text(Locale.SETTINGS_LAYOUT);
  $('#show-notification-title').text(Locale.SETTINGS_NOTIFICATION);
}

function loadSettings() {
  // language setting
  const $language = $('#language');
  $language.dropdown('setup menu', {values: Locale.SETTINGS_LANGUAGE_OPTIONS});
  $language.dropdown('set selected', language);

  $language.dropdown({
    onChange: (value) => {
      settings.set('language', value);
    }
  });

  // tray click setting
  
  if (process.platform === 'darwin') {
    $('#tray-segment').hide();
  } else {
    const trayClick = settings.get('trayClickEvent', 'showMain');
    const $trayClick = $('#tray-click');
    $trayClick.dropdown('setup menu', {values: Locale.SETTINGS_TRAY_CLICK_OPTIONS});
    $trayClick.dropdown('set selected', trayClick);
  
    $trayClick.dropdown({
      onChange: (value) => {
        settings.set('trayClickEvent', value);
        ipcRenderer.send('trayClickEvent', value);
      }
    });
  }

  // show notification
  const showNotification = settings.get('showNotification', 'check');
  const $showNotification = $('#show-notification');
  $showNotification.checkbox(showNotification);
  $showNotification.checkbox({
    onChecked: () => {
      settings.set('showNotification', 'check');
    },
    onUnchecked: () => {
      settings.set('showNotification', 'uncheck');
    }
  });
}