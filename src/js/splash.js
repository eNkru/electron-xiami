const {ipcRenderer} = require('electron');

ipcRenderer.on('connect-timeout', () => {
    const splashIcon = document.getElementById('splashIcon');
    splashIcon.classList.remove('loading', 'microsoft');
    splashIcon.classList.add('wifi', 'disabled');

    const splashBtn = document.getElementById('splashBtn');
    splashBtn.innerText = `网络不可用，点击重试`;
});

document.querySelector('#splashBtn').addEventListener('click', () => {
    const splashIcon = document.getElementById('splashIcon');
    splashIcon.classList.remove('wifi', 'disabled');
    splashIcon.classList.add('loading', 'microsoft');

    const splashBtn = document.getElementById('splashBtn');
    splashBtn.innerText = '小虾米正在连接...';

    ipcRenderer.send('reconnect');
});