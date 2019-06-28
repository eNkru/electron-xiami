const {ipcRenderer} = require('electron');

ipcRenderer.on('lyricsChange', (event, value) => {
  $('.lyrics-line').text(value).hide().fadeIn();
});

ipcRenderer.on('albumUpdate', (event, value) => {
  $('.album-cover img').attr('src', value);
});

ipcRenderer.on('trackUpdate', (event, value) => {
  console.log(value);
  $('.track-title').text(value).hide().fadeIn();
});

ipcRenderer.on('singerUpdate', (event, value) => {
  console.log(value);
  $('.track-singer').text(value).hide().fadeIn();
});

$('.button-close').click(() => {
  // console.log('click close lyrics button');
  ipcRenderer.send('lyricsClose');
});

$('.button-prev').click(() => {
  ipcRenderer.send('lyricsPrevious');
});

$('.button-next').click(() => {
  ipcRenderer.send('lyricsNext');
});

$('.button-lyrics').click(() => {
  ipcRenderer.send('showHideLyrics');
});

$('.button-pause-play').click(() => {
  // $('.button-pause-play i').toggleClass('pause').toggleClass('play');
  // console.log('click play | pause lyrics button');
  ipcRenderer.send('lyricsPausePlay');
});

$('.album-cover').click(() => {
  ipcRenderer.send('lyricsOpenPlayer');
});