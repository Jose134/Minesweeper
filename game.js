const tileSize = 40;   //Width of a tile (in pixels)
const width = 20;      //Board width (in tiles)
const height = 20;     //Board height (in tiles)
const bombAmount = 35; //Amount of bombs

let board = []; //can be 'bomb' or 'empty'
let lost = false; //This is for the broken ai to know when it lost

//colors for the text of the number of surrounding bombs
let colors = [
    'white', //this one doesn't really matter since tiles with no surrounding bombs won't have text
    'blue',
    'green',
    'red',
    'darkblue',
    'darkred',
    'turquoise',
    'darkgrey',
    'grey'
]

window.onload = function () {
    const grid = document.getElementById('gridDiv');

    grid.style.width = tileSize * width + 'px';
    grid.style.height = tileSize * height + 'px';

    //Generates a random board
    const bombs = Array(bombAmount).fill('bomb');
    const empties = Array(width*height - bombAmount).fill('empty');
    board = bombs.concat(empties).sort(() => Math.random() > 0.5 ? 1 : -1);

    //Calculates surrounding amount of bombs for every non-bomb tile
    for (let id = 0; id < board.length; id++) {
        if (board[id] == 'bomb') continue;

        let bombs = 0;

        //Obviously not copy-pasted from the reveal function
        let startI = id % width == 0 ? 0 : -1;
        let horizontalRun = id % width == width-1 ? 1 : 2;

        let startJ = id < width ? 0 : -1;
        let verticalRun = id > (width * (height-1))-1 ? 1 : 2;

        for (let i = startI; i < horizontalRun; i++) {
            for (let j = startJ; j < verticalRun; j++) {
                let tileID = id + i;
                tileID += j*width;
    
                if(board[tileID] == 'bomb') {
                    bombs++;
                }
            }
        }

        board[id] = bombs;
    }

    //Creates the tile divs
    for (let i = 0; i < width*height; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.addEventListener('mousedown', mousedown);

        square.style.width = tileSize + 'px';
        square.style.height = tileSize + 'px';
        square.style.lineHeight = tileSize + 'px';

        grid.appendChild(square);
    }

}

function mousedown (event) {
    //Gets the DOM element and id corresponding to the clicked tile
    let element = event.srcElement;
    let id = parseInt(element.id);

    if (event.which == 1) {
        reveal(id);
    }
    else if (event.which == 3) {
        flag(id);
    }
    
}

function reveal (id) {
    const element = document.getElementById(id);
    if (element == null) console.error(id + ' is null');

    //Checks if the tile has already been revealed
    if (element.classList.contains('clicked-bomb') ||
        element.classList.contains('clicked-empty')
    ) {
        return;
    }

    //Removes flag if it was set
    if (element.classList.contains('flagged')) element.classList.remove('flagged');

    if (board[id] == 'bomb') {
        element.classList.add('clicked-bomb');
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
        let startI = id % width == 0 ? 0 : -1;
        let horizontalRun = id % width == width-1 ? 1 : 2;

        let startJ = id < width ? 0 : -1;
        let verticalRun = id > (width * (height-1))-1 ? 1 : 2;

        for (let i = startI; i < horizontalRun; i++) {
            for (let j = startJ; j < verticalRun; j++) {
                let tileID = id + i;
                tileID += j*width;

                if(board[tileID] != 'bomb') {
                    reveal(tileID);
                }
            }
        }
    }
}

function flag (id) {
    const element = document.getElementById(id);

    //Checks if the tile has already been revealed
    if (element.classList.contains('clicked-bomb') ||
        element.classList.contains('clicked-empty')
    ) {
        return;
    }

    if (element.classList.contains('flagged')) {
        element.classList.remove('flagged');
    }
    else {
        element.classList.add('flagged');
    }
    checkWin();
}

function checkWin () {
    for (let id = 0; id < board.length; id++) {
        const element = document.getElementById(id);
        
        if (board[id] == 'bomb' && !element.classList.contains('flagged')) return false;
        if (board[id] != 'bomb' && element.classList.contains('flagged'))  return false;
    }

    //User won!
    revealAll();

    const victory = document.createElement('h1');
    victory.innerText = "You Won";
    document.body.appendChild(victory);

    return true;
}

function lose () {
    //F
    lost = true;
    
    revealAll();

    const lose = document.createElement('h1');
    lose.innerText = "You Lost";
    document.body.appendChild(lose);
}

function revealAll () {
    for (let id = 0; id < board.length; id++) {
        const element = document.getElementById(id);

        if (board[id] == 'bomb' && !element.classList.contains('clicked-bomb')) {
            element.classList.add('clicked-bomb');
        } 
        else if (board[id] != 'bomb' && !element.classList.contains('clicked-empty')) {
            let number = parseInt(board[id]);
            element.innerHTML = number == 0 ? ' ' : '' + number;
            element.style.color = colors[number];
            element.classList.add('clicked-empty');
        }
    }
}

function getNeighbours (id) {
    let neighbours = [];

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