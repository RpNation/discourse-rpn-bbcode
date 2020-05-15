var loadedFonts = [];

function importFont(fontID) {
    fontID = fontID.replace(/\s/g, '+');
    if (!loadedFonts.includes(fontID)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = fontID;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://fonts.googleapis.com/css2?family=' + fontID;
        link.media = 'all';
        head.appendChild(link);
        loadedFonts.push(fontID);
    }
}