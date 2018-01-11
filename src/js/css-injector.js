class CssInjector {}

CssInjector.main = `
  #playInAppWrap, .tip-twitter {
    display: none !important;
  }
`;

CssInjector.macos = `
  #top {
    -webkit-app-region: drag;
  }
  #J_header .logo {
    padding-left: 100px !important;
  }
  .search-result {
    left: 300px !important;
  }
  .search-wrap {
    left: 300px !important;
  }
`;

CssInjector.hideSidebar = `
  .main-wrap {
    padding-left: 0 !important;
  }
  .main-sidebar {
    display:none;
  }
`;

CssInjector.hideLyrics = `
  .main-wrap {
    padding-right: 0 !important;
  }
  .main-outher {
    display:none;
  }
  .ui-track-all {
    width: initial !important;
  }
`;

CssInjector.songListOnly = `
  .main-wrap {
    padding: 0 !important;
  }
  .main-outher {
    display:none;
  }
  .main-sidebar {
    display:none;
  }
  .ui-track-all {
    width: initial !important;
  }
`;

CssInjector.mini = `
  #player-main {
    height: 160px !important;
    width: 520px !important;
    min-width: 0px !important;
    min-height: 0px !important;
  }
  #player-main #top, #player-main #middle {
    display: none;
  }
  #bottom {
    height: 100% !important;
    width: 100% !important;
  }
  #J_playerWrap {
    padding-right: 0px !important;
  }
  .player-info {
    height: 80px !important;
    position: absolute !important;
    left: 200px !important;
    width: 300px !important;
  }
  .player-info .player-length {
    top: 53px !important;
  }
  #J_trackShare, #J_trackComment, #J_trackMore {
    display: none !important;
  }
  #J_trackFav {
    right: 0 !important;
  }

  .player-controls {
    width: 278px !important;
    height: 80px !important;
    position: absolute !important;
    top: 80px !important;
    left: 200px !important;
  }
  #J_prevBtn {
    left: 0px !important;
  }
  #J_playBtn {
    left: 43px !important;
  }
  #J_nextBtn {
    left: 86px !important;
  }
  .player-mode {
    left: 134px !important;
  }

  .player-volume {
      width: 100px !important;
      height: 80px !important;
      position: absolute !important;
      right: 0 !important;
      top: 80px !important;
  }
  .player-volume #J_playerHQ, .player-volume #J_translate {
    display: none !important;
  }
  .player-volume #volume {
      position: absolute !important;
      top: 31px !important;
      right: 20px !important;
      width: 110px !important;
      height: 18px !important;
  }
`;

module.exports = CssInjector;