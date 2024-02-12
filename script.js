function Gameboard() {

    // gameboard with rows and columns
    const rows = 3;
    const columns = 3;
    const gameBoard = [];

    // create every cell of the gameboard which will be a 2d array
    for( let i = 0 ; i < rows ; i++){
        gameBoard[i] = [];
        for(let j = 0 ; j < columns ; j++){
            gameBoard[i].push(Cell());
        }
    }

    // get the whole board to render it later
    const getBoard = () => gameBoard;

    // which player marking the cell (row, column)
    const markCell  = (row, column, player) => {

        if(gameBoard[row][column].getValue()===''){
            gameBoard[row][column].charMark(player);
          
        } 
    }

    // print every row and its cell
    const printBoard = () => {
        console.log(gameBoard.map(row => row.map(cell => cell.getValue())));   
    }

    return {getBoard, markCell, printBoard};
}


function Cell () {

    // let value = 0;
    let value='';

    const charMark = (player) => {
        value = player.marker;
    };  

    const getValue = () => value;

    return {
        charMark,
        getValue
    };
}


function GameController (
    playerOneName = "Pranjal",
    playerTwoName = "Shiva"
) {
    const gameBoard = Gameboard();

    const players = [
        {
            name: playerOneName,
            marker: 'X'
        },
        {
            name: playerTwoName,
            marker: 'O'
        }
    ];

    let activePlayer = players[0];

    // change turn
    const switchPlayerTurn = () => {
        activePlayer = activePlayer===players[0] ? players[1] : players[0];
    }

    // whose turn is it?
    const getActivePlayer = () => activePlayer;

    // give the activeplayer the board to mark on
    const printNewRound = () => {
        gameBoard.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
    }

    const playTurn = (row, column) => {

        if (gameBoard.getBoard()[row][column].getValue() === '') {
            gameBoard.markCell(row, column, getActivePlayer());
            console.log(`Marking (${row}, ${column}) cell with ${getActivePlayer().name}'s marker '${getActivePlayer().marker}'`);

        } else {
            console.log(`Already occupied! Retry available slots`);
        }
        
        
        // after each turn check the status
        const result = checkGameStatus(gameBoard.getBoard());
        if (result) {
            console.log(result);
            return;
        }
        switchPlayerTurn();
        printNewRound();
    }
    printNewRound();

    const checkGameStatus = (arr) => {
        // game over / tie, win (3 in a row) / (3 in a column)
    
        const board = gameBoard.getBoard();

        // wins if 3 in a row
        for (let i = 0 ; i < board.length; i++){
            if (
                board[i][0].getValue() === board[i][1].getValue() && 
                board[i][1].getValue() === board[i][2].getValue() && 
                board[i][0].getValue()!==''
                ){
                return `Player ${getActivePlayer().name} wins!`
            }
        }

        // wins if 3 in a column
        for (let i = 0 ; i < board.length; i++){
            if (
                board[0][i].getValue() === board[1][i].getValue() && 
                board[1][i].getValue() === board[2][i].getValue() && 
                board[0][i].getValue()!==''
                ){
                return `Player ${getActivePlayer().name} wins!`;
            }
        }

        // for 3 in a diagonal
        const diag = [
            board[0][0].getValue(), 
            board[1][1].getValue(),
            board[2][2].getValue(), 
            board[0][2].getValue(),
            board[2][0].getValue()
        ]
        if (
            (board[0][0].getValue() === board[1][1].getValue() && 
            board[1][1].getValue() === board[2][2].getValue()) || 
            (board[0][2].getValue() === board[1][1].getValue() &&  
            board[1][1].getValue() === board[2][0].getValue()) && 
            !diag.includes('')
            ){
                return `Player ${getActivePlayer().name} wins!`   
            }

        return null;
    }

    return {
        playTurn,
        getActivePlayer,
        checkGameStatus,
        gameBoard,
        printNewRound   
    };
    
}


const game = GameController();
// DOMMING
function ScreenController() {

    
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';
        const board = game.gameBoard.getBoard();
        
        const activePlayer = game.getActivePlayer();
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;


        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.column = columnIndex;
                cellButton.dataset.row = rowIndex;

                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });
    }
    

    function clickHandlerBoard(e) {

        if (e.target.classList.contains("cell")){

            const selectedColumn = parseInt(e.target.dataset.column);
            const selectedRow = parseInt(e.target.dataset.row);
    
            game.playTurn(selectedRow, selectedColumn);
            updateScreen();
    
        }
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();

}

ScreenController();

