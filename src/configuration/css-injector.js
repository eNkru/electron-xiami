class CssInjector {}

CssInjector.main = `
  .top-nav {
    display: none;
  }
  div#banner-container {
    top: 0;
  }
  .sticky-leftbar {
    display: none;
  }
  .page-container .content-wrapper .view-body {
    margin: 0 !important;
    padding: 0 !important;
  }
  .billboard-view {
    padding-top: 1px !important;
  }
  .list-view.view-without-leftbar {
    margin: 32px 0 0 32px !important;
  }
  .xm-footer {
    display: none !important;
  }
  .page-container {
    padding-bottom: 88px !important;
  }
  .iconfont.button-home {
    position: fixed;
    right: 40px;
    top: 40px;
    font-size: 32px;
    z-index: 9;
    background: #4a4a4a;
    color: white;
    width: 36px;
    border-radius: 50%;
    height: 36px;
    cursor: pointer;
    transition: opacity .2s;
  }
  .iconfont.button-home:hover {
    background: #ff410f;
  }
  .iconfont.button-home.hide {
    display: none;
    opacity: 0;
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

CssInjector.mini = `
  #player-main {
    height: 160px !important;
    width: 520px !important;
    min-width: 0px !important;
    min-height: 0px !important;
    -webkit-app-region: drag;
  }
  
  #player-main #top{
    display: none;
  }

  #middle .main-sidebar, #middle .main-body, #J_lyricScrollWrap{
    display: none !important;
  }
  #middle {
    top: 0 !important;
    background-color: transparent !important;
  }
  .main-wrap{
    padding: 0 !important;
  }
  #J_lrcWrap {
    top: 0 !important;
    left: 0 !important;
  }
  .ui-album-cover {
    padding: 10px 0 0 20px !important;
    width: 130px !important;
    height: 130px !important;
  }
  .ui-album-img {
    width: 130px !important;
    height: 130px !important;
  }
  .ui-album-img img {
    border: 5px solid #FFF
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
  .track-info {
    -webkit-app-region: no-drag;
  }
  .player-progress {
    -webkit-app-region: no-drag;
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
  #J_prevBtn, #J_playBtn, #J_nextBtn, .player-mode {
    -webkit-app-region: no-drag;
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
      -webkit-app-region: no-drag;
  }
`;

CssInjector.radio = `
  .radioID_grid {
    display: none;
  }
  .footer_copyright {
    display: none;
  }
  div#sidebutton {
    display: none;
  }
  .radio_rec_tips {
    display: none;
  }
  a#feedback {
    display: none;
  }
`;

module.exports = CssInjector;