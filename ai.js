//NOT WORKING, DON'T USE

let aiBoard = [];
let probabilities = [];

async function run_ai () {
    let id = (Math.floor(Math.random() * board.length));
    reveal(id);
    
    let finished = checkWin() || lost;
    while (!finished) {
        update_ai_board();
        
        let lowest = 0;
        let flagCount = 0;

        do {
            
            calculateProbabilities();
            
            flagCount = 0;
            for (let i = 0; i < board.length; i++) {
                if (probabilities[lowest] != Infinity && probabilities[i] == Infinity) {
                    lowest = i;
                }
                if (!isFlag(i) && probabilities[i] >= 1 && probabilities[i] != Infinity) {
                    flag(i);
                    flagCount++;
                }
            }

        } while(flagCount != 0);

        if (checkWin()) {
            finished = true;
            break;
        }
        
        while (!isUnrevealed(lowest) && !isFlag(lowest)) {
            lowest++;
        }
        
        if(checkEmpties() == 0) {
            lowest = [...Array(board.length).keys()].filter(id => { return !isUnrevealed() && !isFlag()})[0];
            reveal(lowest);
        }

        finished = checkWin() || lost;
        
        await new Promise(r => setTimeout(r, 700));
    }
}

function isUnrevealed (id) {
    const classes = document.getElementById(id).classList;
    return !classes.contains('clicked-bomb')  &&
           !classes.contains('clicked-empty');
}

function isFlag (id) {
    return document.getElementById(id).classList.contains('flagged');
}

function update_ai_board () {
    aiBoard = new Array(board.length).fill(undefined);
    getRevealedTiles().forEach(tile => {
        aiBoard[tile] = board[tile];
    });
}

function getRevealedTiles () {
    let result = [];
    for (let i = 0; i < board.length; i++) {
        if (!isUnrevealed(i)) {
            result.push(i);
        }
    }
    return result;
}

function getNeighbourFlagAmount (id) {
    let count = 0;
    getNeighbours(id).forEach(nId => {
        if (isFlag(nId)) {
            count++;
        }
    });
    return count;
}

/*
function calculateProbabilities () {
    probabilities = new Array(board.length).fill(Infinity);

    getRevealedTiles().forEach(tile => {
        getNeighbours(tile).filter(id => {
            return isUnrevealed(id);
        }).forEach((id, index, arr) => {
            if (probabilities[id] == Infinity) {
                probabilities[id] = 0;
            }
            probabilities += (aiBoard[tile] - getNeighbourFlagAmount(id)) / arr.length;
        });
    });
}
*/

function calculateProbabilities () {
    probabilities = new Array(board.length);
    for (let i = 0; i < board.length; i++) {
        probabilities[i] = [];
    }

    getRevealedTiles().forEach(tile => {
        getNeighbours(tile).filter(id => {
            return isUnrevealed(id);
        }).forEach((id, index, arr) => {
            if (arr.length == aiBoard[tile]) {
                probabilities[id] = [1];
            }
            /*else {
                probabilities[id].push((aiBoard[tile] - getNeighbourFlagAmount(id)) / arr.length);
            }*/
        });
    });

    for (let i = 0; i < probabilities.length; i++) {
        if (probabilities[i].length == 0) {
            probabilities[i] = Infinity;
            continue;
        }

        let best = 0;
        for (let j = 1; j < probabilities[i].length; j++) {
            if (probabilities[i][j] > probabilities[i][best]) {
                best = j;
            }
        }
        probabilities[i] = probabilities[i][best];
    }
}

function checkEmpties () {
    let clicked = 0;

    getRevealedTiles().forEach(tile => {
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