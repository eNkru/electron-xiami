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

module.exports = CssInjector;