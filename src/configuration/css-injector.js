class CssInjector {}

CssInjector.main = `
  .top-nav {
    -webkit-app-region: drag;
  }
  .top-nav-wrapper > a {
    margin-left: 16px;
    -webkit-app-region: no-drag;
  }
  .top-nav-wrapper .links a:nth-last-of-type(-n+4) {
    display: none;
  }
  .top-nav-wrapper a {
    order: -1;
    -webkit-app-region: no-drag;
  }
  .top-nav-wrapper .message-center {
    -webkit-app-region: no-drag;
  }
  .top-nav-wrapper .user {
    -webkit-app-region: no-drag;
  }
  .top-nav-wrapper .search {
    order: -1;
    margin-left: auto;
    margin-right: 0;
    -webkit-app-region: no-drag;
  }
  .top-nav-wrapper .links {
    margin-right: 20px !important;
  }
  .discovery-view .sticky-leftbar {
    position: absolute !important;
    width: fit-content !important;
  }
  .download-panel {
    display: none;
  }
  .discovery-view .leftbar-content {
    background-color: transparent !important;
    width: fit-content !important;
    height: fit-content !important;
  }
  .discovery-view .leftbar-content .links a {
    background-color: #747474;
    width: 30px;
    border-radius: 50%;
    overflow: hidden;
    border: 0 !important;
    padding: 1px;
    color: #FFF !important;
    font-weight: bolder !important;
  }
  .discovery-view .leftbar-content .links a:hover {
    background: #ff410f;
  }
  .page-container .content-wrapper .discovery-view .view-body {
    margin: 0 !important;
    padding: 125px 0 0 0 !important;
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

CssInjector.dark = `
  .page-container {
    background-color: #0c0c0c !important;
    color: #d6d6d6 !important;
  }
  .page-container .button {
    background: #4a4a4a;
  }
  .song-tags {
    color: #ff410f !important;
  }
  .top-nav {
    background-color: rgba(0, 0, 0, 0.95) !important;
  }
  .play-bar {
    background-color: rgba(0, 0, 0, 0.95) !important;
  }
  .play-list-container .play-list {
    background-color: rgba(0, 0, 0, 0.95) !important;
  }
  .player .common-mode .play-bar .music .info .title {
    color: #999 !important;
  }
  .table table tbody tr td .em {
    color: #999 !important;
  }
  .table table tbody tr.odd {
    background-color: #4a4a4a !important;
  }
  .page-container .billboard-view .title {
    color: #4a4a4a !important;
  }
  .page-container .billboard-view .external {
    color: #4a4a4a !important;
  }
  .back-to-top {
    color: #4a4a4a !important;
  }
  .select {
    color: #4a4a4a !important;
  }
  .button.unselectable {
    color: #fff !important;
  }
  .button.remarkable {
    color: #fff !important;
  }
  .leftbar-content {
    background-color: #0c0c0c !important;
  }
  .related-songs .table {
    background-color: #0c0c0c !important;
  }
  .text-area {
    background-color: #4a4a4a !important;
  }
  .search input {
    background: #4a4a4a !important;
  }
  .count-list {
    background-color: #4a4a4a !important;
  }
  .search-content-wrapper {
    background-color: rgba(0,0,0,.95) !important;
  }
  .search-content-wrapper .block.hot {
    color: #fff !important;
  }
  .popular-songs .table {
    background-color: #4a4a4a !important;
  }
  .table table tbody tr:hover, .table table tbody tr:hover+.extended-row {
    background-color: #060606 !important;
  }
  .immersion .table table tbody tr:hover, .table table tbody tr:hover+.extended-row {
    background-color: #f4f4f4 !important;
  }
  .immersion.night-mode .table table tbody tr:hover, .table table tbody tr:hover+.extended-row {
    background-color: #444 !important;
  }
`;

CssInjector.hideScrollbar = `
  ::-webkit-scrollbar {
    width: 0 !important;
    background: transparent !important;
  }
`;

CssInjector.macos = `
  .top-nav {
    padding-top: 16px;
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