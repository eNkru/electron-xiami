class Locale {

}

Locale.TRAY_TOOLTIP = 'Xiami Player';
Locale.TRAY_SHOW_MAIN = 'Show Player';
Locale.TRAY_PLAY_PAUSE = 'Play | Pause';
Locale.TRAY_NEXT = 'Next';
Locale.TRAY_PREVIOUS = 'Previous';
Locale.TRAY_RELOAD_PLAYER = 'Reload Player Window';
Locale.TRAY_SETTINGS = 'Settings';
Locale.TRAY_EXIT = 'Exit';

Locale.NOTIFICATION_TRACK = 'Track';
Locale.NOTIFICATION_ARTIST = 'Artist';
Locale.NOTIFICATION_ALBUM = 'Album';

Locale.SETTINGS_SETTINGS_TITLE = 'Settings';
Locale.SETTINGS_SETTINGS = 'Manage your preferences';
Locale.SETTINGS_LANGUAGE = 'Language (Restart Required)';
Locale.SETTINGS_LANGUAGE_OPTIONS = [{value: 'en', text: 'English', name: 'English'}, {value: 'sc', text: 'Chinese', name: 'Chinese'}];

Locale.SETTINGS_TRAY = 'Tray (Restart Required)';
Locale.SETTINGS_TRAY_CLICK = 'Click Tray Icon';
Locale.SETTINGS_TRAY_CLICK_OPTIONS = [{value: 'showMain', text: 'Show Main Player', name: 'Show Main Player'}, {value: 'showTrackInfo', text: 'Show Track Info', name: 'Show Track Info'}];

Locale.SETTINGS_LAYOUT = 'Custom Layout (Restart Required)';
Locale.SETTINGS_LAYOUT_OPTIONS = [
  {value: 'default', text: 'Default', name: 'Default'},
  {value: 'hideSidebar', text: 'Hide Side Panel', name: 'Hide Side Panel'},
  {value: 'hideLyrics', text: 'Hide Lyrics Panel', name: 'Hide Lyrics Panel'},
  {value: 'songListOnly', text: 'Playlist Only', name: 'Playlist Only'},
  {value: 'mini', text: 'Mini Player', name: 'Mini Player'}
];

Locale.SETTINGS_NOTIFICATION = 'Show Notification';

module.exports = Locale;