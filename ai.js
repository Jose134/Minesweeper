//NOT WORKING, DON'T USE

let aiBoard = [];
let probabilities = [];

async function run_ai () {
    let id = (Math.floor(Math.random() * board.length));
    reveal(id);
    
    let finished = checkWin() || lost;
    while (!finished) {
        
        update_ai_board();
        calculateProbabilities();
        
        
        let lowest = 0;
        while (!isUnrevealed(lowest)) {
            lowest++;
        }

        for (let i = 0; i < board.length; i++) {
            console.log(probabilities[i]);
            if (probabilities[i] < probabilities[lowest]) {
                lowest = i;
            }
            if (probabilities[i] >= 1 && probabilities[i] != Infinity) {
                flag(i);
            }
        }
        
        reveal(lowest);
        
        finished = checkWin() || lost;
        
        await new Promise(r => setTimeout(r, 500));
    }
}

function isUnrevealed (id) {
    const classes = document.getElementById(id).classList;
    return !classes.contains('clicked-bomb')  &&
           !classes.contains('clicked-empty') &&
           !classes.contains('flagged');
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
        if (document.getElementById(nId).classList.contains('flagged')) {
            count++;
        }
    });
    return count;
}

function calculateProbabilities () {
    probabilities = new Array(board.length).fill(Infinity);

    getRevealedTiles().forEach(tile => {
        getNeighbours(tile).filter(id => {
            return isUnrevealed(id);
        }).forEach((id, index, arr) => {
            if (probabilities[id] == Infinity) {
                probabilities[id] = 0;
            }
            probabilities[id] += (aiBoard[tile] - getNeighbourFlagAmount(id)) / arr.length;
        });
    });

}