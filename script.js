let board = Array(9).fill(null);
let currentPlayer = 'X';
let isGameActive = true;
let isMultiplayer = true;

const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const modeSelection = document.getElementById('mode-selection');
const gameBoard = document.getElementById('game-board');
const modal = document.getElementById('modal');
const winnerMessage = document.getElementById('winner-message');
const closeModalButton = document.getElementById('close-modal');

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
closeModalButton.addEventListener('click', closeModal);
document.getElementById('multiplayer').addEventListener('click', () => startGame(true));
document.getElementById('vs-bot').addEventListener('click', () => startGame(false));

function startGame(multiplayer) {
    isMultiplayer = multiplayer;
    modeSelection.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    restartButton.classList.remove('hidden');
    resetBoard();
}

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');

    if (board[index] || !isGameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWin()) {
        showWinner(currentPlayer);
    } else if (board.every(cell => cell)) {
        showWinner('Draw');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (!isMultiplayer && currentPlayer === 'O') {
            setTimeout(aiMove, 1500); // AI move delay
        }
    }
}

function aiMove() {
    const bestMove = minimax(board, 'O').index;
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    if (checkWin()) {
        showWinner('O');
    } else if (board.every(cell => cell)) {
        showWinner('Draw');
    } else {
        currentPlayer = 'X';
    }
}

// Minimax Algorithm
function minimax(newBoard, player) {
    const availableSpots = newBoard.map((val, index) => val === null ? index : null).filter(val => val !== null);

    // Base cases
    if (checkWinPlayer(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWinPlayer(newBoard, 'O')) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];

        newBoard[availableSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = null; // Reset the spot
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinPlayer(board, player) {
    return winConditions.some(condition => {
        const [a, b, c] = condition;
        return board[a] === player && board[a] === board[b] && board[a] === board[c];
    });
}

function checkWin() {
    return checkWinPlayer(board, currentPlayer);
}

function showWinner(winner) {
    isGameActive = false;
    winnerMessage.textContent = winner === 'Draw' ? 'It\'s a Draw!' : `${winner} Wins!`;
    modal.classList.remove('hidden');  // Show modal
}

function closeModal() {
    modal.classList.add('hidden');  // Hide modal
    restartGame();  // Restart the game after modal is closed
}

function restartGame() {
    resetBoard();
    modeSelection.classList.remove('hidden');
    gameBoard.classList.add('hidden');
    restartButton.classList.add('hidden');
}

function resetBoard() {
    board.fill(null);
    cells.forEach(cell => (cell.textContent = ''));
    currentPlayer = 'X';
    isGameActive = true;
}
