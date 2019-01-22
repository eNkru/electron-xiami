<img src="build/icons/128x128.png" alt="logo" height="80" align="right" />

# Electron Xiami

[English README](README.en.md)

Linux和macOS下的虾米客户端 (虾米播放器)，使用[Electron](https://electron.atom.io)构建。

虾米网站更新了新版本的UI。2.x版本支持新版虾米，1.x版本目前还可用与老版虾米。没有重要问题1.x版本应该不会有什么新功能了。

*请注意：这个项目不是虾米音乐的官方客户端。如果有任何问题请反馈到[这个链接](https://github.com/eNkru/electron-xiami/issues)。*

## 功能 (划掉的是1.x版本的功能)
* 虾米音乐在线
* 虾米电台 （测试）
* ~~迷你播放模式~~
* 桌面歌词
* 系统托盘
* 系统提示
* 播放控制
* 用户配置
* 隐藏标题框
* 界面优化
* 黑夜模式
* ~~多语言支持~~

## 下载
预打包版本请点击[这个链接](https://github.com/eNkru/electron-xiami/releases)下载。

## 截图

### 2.x
![screenshot from 2019-01-15 17-51-44](https://user-images.githubusercontent.com/13460738/51159621-031d1a00-18ef-11e9-8e3d-312041ecb002.png)

![screenshot from 2019-01-22 15-38-16](https://user-images.githubusercontent.com/13460738/51508933-3a924600-1e5c-11e9-81de-f6b88c2a2cb6.png)

![screenshot from 2019-01-15 17-52-44](https://user-images.githubusercontent.com/13460738/51159623-03b5b080-18ef-11e9-8b5b-4b5e49eb55a6.png)

![screenshot from 2019-01-22 15-38-34](https://user-images.githubusercontent.com/13460738/51508935-3c5c0980-1e5c-11e9-8d74-7e4d97de03a2.png)

![screenshot from 2019-01-22 15-40-24](https://user-images.githubusercontent.com/13460738/51508958-58f84180-1e5c-11e9-8cf9-e9a1b10da94b.png)

![screenshot from 2019-01-22 15-38-48](https://user-images.githubusercontent.com/13460738/51508956-57c71480-1e5c-11e9-9137-25c709cd6bf7.png)

### 1.x
![screenshot_macos](https://user-images.githubusercontent.com/13460738/34644583-38a2a2b6-f39e-11e7-8831-e21475427ccb.jpg)

![linux_player_full](https://user-images.githubusercontent.com/13460738/38477881-769de2b6-3c09-11e8-8c75-75a13da42df2.png)

![linux_player_mini](https://user-images.githubusercontent.com/13460738/38477883-79400990-3c09-11e8-804f-b2e7bdd262fc.png)

![linux_player_radio](https://user-images.githubusercontent.com/13460738/38477885-7bd5355e-3c09-11e8-93a5-794250b5ceb9.png)

## 安装需求
* [GIT](https://git-scm.com/)
* [NPM](https://www.npmjs.com/)

## 编译和安装
本地编译运行
```
git clone https://github.com/eNkru/electron-xiami.git
cd electron-xiami
npm install
npm start
```
编译打包版本
```
npm run dist:linux
```

## 发布
```
npm version (new release version)
git push origin master
git push origin --tags
npm publish
```

## 授权协议
[MIT](https://github.com/eNkru/electron-xiami/blob/master/LICENSE)
