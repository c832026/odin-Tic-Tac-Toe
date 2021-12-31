// Game module
const game = (function() {
    
    // Factory function for create players
    const Player = function(name, symbol) {
        let plays = [];
        return {name, symbol, plays};
    }
    
    // Use player factory function to create two player
    const player1 = Player('player1', '&#10005');
    const player2 = Player('player2', 'O');
    
    // Set default current player to player1
    let currentPlayer = player1;

    // Gameboard module
    const gameBoard = (function() {
        const CONTAINER = document.querySelector('.game-container');
        const RESULT = document.querySelector('#result');
    
        // Gameboard private property for create an array of 9, initialized with null
        const boardArray = (function() {
            let board = new Array(9);
            for (let i = 0, length = board.length; i < length; i++) {
                board[i] = null;
            }
            return board;
        })();

        // Gameboard private method, each square's event listener method for set player's play
        const setPlay = function() {
            // Stopped if square is already have player's play
            const index = parseInt(this.id);
            if (boardArray[index] !== null) return;

            // Save current player's symbol to corresponding boardArray, player's own plays object, and node's text
            boardArray[index] = currentPlayer.symbol;
            currentPlayer.plays.push(index);
            this.innerHTML = currentPlayer.symbol;
            // Check if game has result
            checkWin();

            // Change the current player to another player
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
        }

        // Gameboard private method for checking if a player has won or there's a tie
        const checkWin = function() {
            const winRows = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];
            let isWin = false;
            // Check for win
            for (const winRow of winRows) {
                isWin = winRow.every(index => currentPlayer.plays.includes(index));
                if (isWin) {
                    RESULT.textContent = `${currentPlayer.name} wins, with ${winRow}`;
                    const squares = document.querySelectorAll('.square');
                    for (square of squares) {
                        square.removeEventListener('click', setPlay);
                    }
                    break;
                } 
            }
            // Check for tie
            if (!isWin) {
                const isFull = boardArray.every(square => (square !== null));
                if (isFull) {
                    RESULT.textContent = `It's a tie.`;
                }
            }
        };
    
        // Gameboard public method for initialize and render the board
        const init = function() {
            // Clean everything in the container
            CONTAINER.innerHTML = '';

            // Create every square node and append to container
            for (let i = 0, length = boardArray.length; i < length; i++){
                let squareNode = document.createElement('div');
                squareNode.innerHTML = boardArray[i];
                squareNode.classList.add('square');
                squareNode.id = i;
                // Set the play and check winning status when click on square
                squareNode.addEventListener('click', setPlay);
                CONTAINER.appendChild(squareNode);
            }
        }
    
        return {init};
    })();

    return {gameBoard};
})();

game.gameBoard.init();