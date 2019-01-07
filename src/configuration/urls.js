class URLS {}

URLS.home = 'https://www.xiami.com/';
URLS.billboard = 'https://www.xiami.com/billboard';
URLS.collection = 'https://www.xiami.com/list/collect';
URLS.artist = 'https://www.xiami.com/list/artist';
URLS.album = 'https://www.xiami.com/list/album';

URLS.getUrl = (mode) => {
    switch (mode) {
        case 'suggestion':
            return URLS.home;
        case 'billboard':
            return URLS.billboard;
        case 'collection':
            return URLS.collection;
        case 'artist':
            return URLS.artist;
        case 'album':
            return URLS.album;
        default:
            return URLS.home;
    }
};

module.exports = URLS;