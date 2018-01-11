class Locale {}

Locale.TRAY_TOOLTIP = '虾米播放器';
Locale.TRAY_SHOW_MAIN = '显示播放器';
Locale.TRAY_PLAY_PAUSE = '播放 | 暂停';
Locale.TRAY_NEXT = '下一首';
Locale.TRAY_PREVIOUS = '上一首';
Locale.TRAY_RELOAD_PLAYER = '重置播放界面';
Locale.TRAY_SETTINGS = '设置';
Locale.TRAY_EXIT = '退出';

Locale.NOTIFICATION_TRACK = '歌曲名';
Locale.NOTIFICATION_ARTIST = '演唱者';
Locale.NOTIFICATION_ALBUM = '专辑';

Locale.SETTINGS_SETTINGS_TITLE = '设置';
Locale.SETTINGS_SETTINGS = '管理设置面板';
Locale.SETTINGS_LANGUAGE = '语言（重启生效）';
Locale.SETTINGS_LANGUAGE_OPTIONS = [{value: 'en', text: '英文', name: '英文'}, {value: 'sc', text: '简体中文', name: '简体中文'}];

Locale.SETTINGS_TRAY = '系统托盘（重启生效）';
Locale.SETTINGS_TRAY_CLICK = '左键单击托盘图标';
Locale.SETTINGS_TRAY_CLICK_OPTIONS = [{value: 'showMain', text: '显示播放器界面', name: '显示播放器界面'}, {value: 'showTrackInfo', text: '显示播放信息', name: '显示播放信息'}];

Locale.SETTINGS_LAYOUT = '播放器布局';
Locale.SETTINGS_LAYOUT_OPTIONS = [
  {value: 'default', text: '默认', name: '默认'},
  {value: 'hideSidebar', text: '隐藏侧边栏', name: '隐藏侧边栏'},
  {value: 'hideLyrics', text: '隐藏歌词面板', name: '隐藏歌词面板'},
  {value: 'songListOnly', text: '只显示歌曲列表', name: '只显示歌曲列表'},
  {value: 'mini', text: '迷你播放器', name: '迷你播放器'}
];

Locale.SETTINGS_NOTIFICATION = '显示通知';

module.exports = Locale;