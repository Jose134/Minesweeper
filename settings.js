//Reveals the settings panel and fills the inputs with the current values
function settingsClick () {
    const e = document.getElementById('settings');
    e.style.display = e.style.display == 'none' ? 'block' : 'none';

    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
    document.getElementById('mines').value = mineAmount;
}

//Sets the game variables with the ones on the inputs and resets the game
function setSettings () {
    width = parseInt(document.getElementById('width').value);
    height = parseInt(document.getElementById('height').value);
    mineAmount = parseInt(document.getElementById('mines').value);

    resetGame();
}