function settingsClick () {
    const e = document.getElementById('settings');
    e.style.display = e.style.display == 'none' ? 'block' : 'none';

    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
    document.getElementById('bombs').value = bombAmount;
}

function setSettings () {
    width = parseInt(document.getElementById('width').value);
    height = parseInt(document.getElementById('height').value);
    bombAmount = parseInt(document.getElementById('bombs').value);

    resetGame();
}