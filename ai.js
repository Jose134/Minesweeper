let aiBoard = [];       //This array contains the information of the board that the AI has
let probabilities = []; //In this array Infinity is used as unknown

//Runs the AI algorithm
async function run_ai () {
    let id = (Math.floor(Math.random() * board.length));
    reveal(id);
    
    while (!gameFinished) {
        updateAIBoard();
        
        let flagCount = 0;
        
        do {
            
            calculateProbabilities();
            
            //Flags all the tiles that contain a mine for sure
            flagCount = 0;
            for (let i = 0; i < board.length; i++) {
                if (!isFlag(i) && probabilities[i] >= 1 && probabilities[i] != Infinity) {
                    flag(i);
                    flagCount++;
                }
            }
            
        } while(flagCount != 0); //When we flag a tile the probabilities change so we need to repeat this in a loop
        
        //If we've already won there's no need to click a tile so we exit here
        if (gameFinished) { break; }
        
        //Clicks tiles, if there are no safe tiles then it chooses a random one
        if(clickSafeTiles() == 0) {
            let lowest = [...Array(board.length).keys()].filter(id => { return isUnrevealed(id) && !isFlag(id)}).sort(() => Math.random() - 0.5)[0];
            reveal(lowest);
        }
        
        //Waits (just so that the board doesn't get instantly solved on the screen)
        await new Promise(r => setTimeout(r, 700));
    }
}

//Returns true if the tile hasn't been revealed yet, false otherwise (flagged tiles are considered unrevealed)
function isUnrevealed (id) {
    const classes = document.getElementById(id).classList;

    return !classes.contains('clicked-mine')  &&
           !classes.contains('clicked-empty');
}

//Returns true if the given tile is flagged, false otherwise
function isFlag (id) {
    return document.getElementById(id).classList.contains('flagged');
}

//Updates the information that the AI has about the board
function updateAIBoard () {
    aiBoard = new Array(board.length).fill(undefined);
    getRevealedTiles().forEach(tile => {
        aiBoard[tile] = board[tile];
    });
}

//Returns an array with the id's of the revealed tiles (flags not included)
function getRevealedTiles () {
    let result = [];
    for (let i = 0; i < board.length; i++) {
        if (!isUnrevealed(i)) {
            result.push(i);
        }
    }
    return result;
}

//Returns the amount of flags on neighbour tiles
function getNeighbourFlagAmount (id) {
    let count = 0;
    getNeighbours(id).forEach(nId => {
        if (isFlag(nId)) {
            count++;
        }
    });
    return count;
}

//Fills the probabilities array with Infinity and sets to 1 the tiles that contains a mine for sure
function calculateProbabilities () {
    probabilities = new Array(board.length).fill(Infinity);

    //For every revealed tile we check if the amount of unrevealed neighbours is the same as the number of surrounding mines
    getRevealedTiles().forEach(tile => {
        getNeighbours(tile).filter(id => {
            return isUnrevealed(id);
        }).forEach((id, index, arr) => {
            //If they're equal then all the neighbours are mines
            if (arr.length == aiBoard[tile]) {
                probabilities[id] = 1;
            }
        });
    });
}

//Reveal tiles that are safe for sure
function clickSafeTiles () {
    let clicked = 0;

    //For every revealed tile we check if the amount of flagged neighbours is the same as the amount of surrounding bombs.
    getRevealedTiles().forEach(tile => {
        //If they're equal then the rest of unrevealed neighbours are safe to be clicked
        if (getNeighbourFlagAmount(tile) == board[tile]) {
            getNeighbours(tile).filter(id => {
                return isUnrevealed(id) && !isFlag(id);
            }).forEach(id => {
                reveal(id);
                clicked++;
            });
        }
    });

    return clicked;
}