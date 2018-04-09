<img src="assets/icon.png" alt="logo" height="80" align="right" />

# Electron Xiami

[中文说明](README.md)

A [xiami](http://www.xiami.com/) desktop application for Linux.
Supported by [Electron](https://electron.atom.io/).

![screenshot_macos](https://user-images.githubusercontent.com/13460738/34644583-38a2a2b6-f39e-11e7-8831-e21475427ccb.jpg)

![linux_player_full](https://user-images.githubusercontent.com/13460738/38477881-769de2b6-3c09-11e8-8c75-75a13da42df2.png)

![linux_player_mini](https://user-images.githubusercontent.com/13460738/38477883-79400990-3c09-11e8-804f-b2e7bdd262fc.png)

![linux_player_radio](https://user-images.githubusercontent.com/13460738/38477885-7bd5355e-3c09-11e8-93a5-794250b5ceb9.png)

*This is not the official desktop client. It's released under open source. If you are facing any issue, please use [this link](https://github.com/eNkru/electron-xiami/issues) to report.*

## Feature
* Play Xiami online music on Linux platform
* Xiami Radio (BETA)
* Mini mode
* Desktop Lyrics (BETA)
* Close to minimise
* Dock tray support
* System notification
* Play control in context menu
* Local configuration support
* Multi-language support

## Pre-Request
* [GIT](https://git-scm.com/)
* [NPM](https://www.npmjs.com/)

## Build & Install
Clone the repository and run in development mode.
```
git clone https://github.com/eNkru/electron-xiami.git
cd electron-xiami
npm install
npm start
```
Build the application 
```
npm run dist:linux
```

## Release
```
npm version (new release version)
git push origin master
git push origin --tags
npm publish
```

## Download
The released application can be downloaded [here](https://github.com/eNkru/electron-xiami/releases).

## License
[MIT](https://github.com/eNkru/electron-xiami/blob/master/LICENSE)
