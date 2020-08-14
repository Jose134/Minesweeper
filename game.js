let tileSize = 40;   //Width of a tile (in pixels)
let width = 20;      //Board width (in tiles)
let height = 20;     //Board height (in tiles)
let mineAmount = 35; //Amount of mines

let board = []; //can be 'mine' or 'empty'
let gameFinished = false;

//colors for the text of the number of surrounding mines
let colors = [
    'white', //this one doesn't really matter since tiles with no surrounding mines won't have text
    'blue',
    'green',
    'red',
    'turquoise',
    'darkred',
    'magenta',
    'darkgrey',
    'grey'
]

window.onload = startGame();

function startGame () {
    //Sets the size of the board according to our variables
    const grid = document.getElementById('gridDiv');

    grid.style.width = tileSize * width + 'px';
    grid.style.height = tileSize * height + 'px';

    //We also need to set the width of these elements because styling
    document.getElementById('controls').style.width = grid.style.width;
    document.getElementById('settings').style.width = grid.style.width;

    //Generates a random board
    const mines = Array(mineAmount).fill('mine');
    const empties = Array(width*height - mineAmount).fill('empty');
    board = mines.concat(empties).sort(() => Math.random() - 0.5);

    //Calculates surrounding amount of mines for every non-mine tile
    for (let id = 0; id < board.length; id++) {
        if (board[id] == 'mine') continue;

        let mines = 0;

        //Obviously not copy-pasted from the reveal function
        //(this is so that tiles on the border get properly calculated values)
        let startI = id % width == 0 ? 0 : -1;
        let horizontalRun = id % width == width-1 ? 1 : 2;

        let startJ = id < width ? 0 : -1;
        let verticalRun = id > (width * (height-1))-1 ? 1 : 2;

        for (let i = startI; i < horizontalRun; i++) {
            for (let j = startJ; j < verticalRun; j++) {
                let tileID = id + i;
                tileID += j*width;
    
                if(board[tileID] == 'mine') {
                    mines++;
                }
            }
        }

        board[id] = mines;
    }

    //Creates the tile divs
    for (let i = 0; i < width*height; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.addEventListener('mousedown', mousedown);
        
        square.classList.add('disable-select');
        square.style.width = tileSize + 'px';
        square.style.height = tileSize + 'px';
        square.style.lineHeight = tileSize + 'px';

        grid.appendChild(square);
    }

}

//Handles the mousedown event
function mousedown (event) {
    if (gameFinished) return;

    //Gets the DOM element and id corresponding to the clicked tile
    let element = event.srcElement;
    let id = parseInt(element.id);

    if (event.which == 1) {
        //Left click
        reveal(id);
    }
    else if (event.which == 3) {
        //Right click
        flag(id);
    }
    
}

function reveal (id) {
    let haveToCheckWin = false;

    const element = document.getElementById(id);
    if (element == null) console.error(id + ' is null');

    //Checks if the tile has already been revealed
    if (element.classList.contains('clicked-mine') ||
        element.classList.contains('clicked-empty')
    ) {
        return;
    }

    //Removes flag if it was set
    if (element.classList.contains('flagged')) {
        element.classList.remove('flagged');
        haveToCheckWin = true;
    }

    if (board[id] == 'mine') {
        element.classList.add('clicked-mine');
        element.innerHTML = '💥';
        lose();
    }
    else {
        element.classList.add('clicked-empty');
        
        let number = parseInt(board[id]);

        element.innerHTML = number == 0 ? ' ' : '' + number;
        element.style.color = colors[number];
    }

    //Reveals surrounding tiles
    if (board[id] == 0) {
        //To make the tiles on the borders of the board work we calculate the start and run values of the loops for both directions.
        let startI = id % width == 0 ? 0 : -1;
        let horizontalRun = id % width == width-1 ? 1 : 2;

        let startJ = id < width ? 0 : -1;
        let verticalRun = id > (width * (height-1))-1 ? 1 : 2;

        for (let i = startI; i < horizontalRun; i++) {
            for (let j = startJ; j < verticalRun; j++) {
                let tileID = id + i;
                tileID += j*width;

                if(board[tileID] != 'mine') {
                    reveal(tileID);
                }
            }
        }
    }

    //If we clicked on a tile that was flagged we might have won because we updated the number of flags on the board
    if (haveToCheckWin) {
        checkWin();
    }
}

//Marks the given tile with a flag, if the tile already had a flag it gets removed instead
function flag (id) {
    const element = document.getElementById(id);

    //Checks if the tile has already been revealed
    if (element.classList.contains('clicked-mine') ||
        element.classList.contains('clicked-empty')
    ) {
        return;
    }

    if (element.classList.contains('flagged')) {
        element.classList.remove('flagged');
        element.innerHTML = '';
    }
    else {
        element.classList.add('flagged');
        element.innerHTML = '🚩';
    }

    checkWin();
}

function checkWin () {
    for (let id = 0; id < board.length; id++) {
        const element = document.getElementById(id);
        
        if (board[id] == 'mine' && !element.classList.contains('flagged')) return false;
        if (board[id] != 'mine' && element.classList.contains('flagged'))  return false;
    }

    //User won!
    gameFinished = true;
    revealAll(false);

    //Creates a victory text
    const victory = document.createElement('h1');
    victory.id = 'victoryText';
    victory.innerText = "You Won";
    document.body.appendChild(victory);
}

function lose () {
    //F
    gameFinished = true;

    //Creates a lose text
    const lose = document.createElement('h1');
    lose.id = 'loseText';
    lose.innerText = "You Lost";
    document.body.appendChild(lose);
}

function revealAll (removeFlags) {
    for (let id = 0; id < board.length; id++) {
        const element = document.getElementById(id);

        if (element.classList.contains('flagged') && removeFlags) {
            element.classList.remove('flagged');
        }

        if (board[id] == 'mine' && !element.classList.contains('clicked-mine')) {
            element.classList.add('clicked-mine');
        } 
        else if (board[id] != 'mine' && !element.classList.contains('clicked-empty')) {
            let number = parseInt(board[id]);
            element.innerHTML = number == 0 ? ' ' : '' + number;
            element.style.color = colors[number];
            element.classList.add('clicked-empty');
        }
    }
}

function getNeighbours (id) {
    let neighbours = [];

    //This piece of code again xD
    let startI = id % width == 0 ? 0 : -1;
    let horizontalRun = id % width == width-1 ? 1 : 2;

    let startJ = id < width ? 0 : -1;
    let verticalRun = id > (width * (height-1))-1 ? 1 : 2;

    for (let i = startI; i < horizontalRun; i++) {
        for (let j = startJ; j < verticalRun; j++) {
            let tileID = id + i;
            tileID += j*width;

            neighbours.push(tileID);
        }
    }

    return neighbours;
}

function resetGame() {
    gameFinished = false;
    document.getElementById('gridDiv').innerHTML = '';

    const victoryText = document.getElementById('victoryText');
    const loseText = document.getElementById('loseText');

    if (victoryText != null) victoryText.remove();
    if (loseText != null) loseText.remove(); 

    startGame();
}