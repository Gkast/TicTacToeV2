const gameBoard = document.getElementById("game-board");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const marksInARowToWin = document.getElementById("marks-in-a-row");
const statusText = document.getElementById("status-text");

let allWinnableRows = [];
let currentBoard = [];
let currentPlayer = "X";
let isGameRunning = false;
let matrixSize = 0;

startButton.addEventListener("click", initializeGame);
stopButton.addEventListener("click", terminateGame);

document.addEventListener("click", function (event) {
    if (!event instanceof Element) {
        return;
    }
    const closestCell = event.target.closest(".cell");
    if (!closestCell) {
        return;
    }
    const cellIndex = parseInt(closestCell.getAttribute("data-cell-index"));
    if (currentBoard[cellIndex] !== "" || !isGameRunning) {
        return;
    }
    updateCell(closestCell, cellIndex);
    checkWinnerRow();
});

function initializeGame() {
    if (isGameRunning) {
        marksInARowToWin.value = "";
        return;
    }
    matrixSize = parseInt(marksInARowToWin.value);
    marksInARowToWin.value = "";
    if (isNaN(matrixSize) || matrixSize < 3 || matrixSize > 10) {
        return;
    }
    initializeBoard(matrixSize);
    isGameRunning = true;
}

function terminateGame() {
    gameBoard.innerHTML = "";
    currentPlayer = "X";
    statusText.textContent = "";
    isGameRunning = false;
}

function initializeBoard(matrixSize) {
    allWinnableRows = setWinnableRows(matrixSize);
    currentBoard = initializeCurrentBoard(matrixSize);
    let boardHtml = "";
    let cellIndexCounter = 0;
    gameBoard.innerHTML = boardHtml;
    statusText.textContent = `--- Player ${currentPlayer}'s Turn ---`;
    for (let y = 0; y < matrixSize; y++) {
        boardHtml += `<div class="cell-row">`;
        for (let x = 0; x < matrixSize; x++) {
            boardHtml += `<div class="cell" data-cell-index="${cellIndexCounter}""></div>`;
            cellIndexCounter++;
        }
        boardHtml += '</div>';
    }
    gameBoard.insertAdjacentHTML('beforeend', boardHtml);
}

function setWinnableRows(matrixSize) {
    let horizontalWinnableRows = [];
    let verticalWinnableRows = [];
    let diagonalWinnableRows = [];
    for (let i = 0; i < matrixSize; i++) {
        let horizontalStartPoint = matrixSize * i;
        let horizontalEndPoint = (matrixSize * (i + 1)) - 1;
        let horizontalStep = 1;
        let verticalStart = i;
        let verticalEndPoint = (matrixSize * (matrixSize - 1)) + i;
        let verticalStep = matrixSize;

        horizontalWinnableRows.push(intRange(horizontalStartPoint, horizontalEndPoint, horizontalStep));
        verticalWinnableRows.push(intRange(verticalStart, verticalEndPoint, verticalStep));
    }
    for (let i = 0; i < 2; i++) {
        let diagonalStartPoint = (matrixSize - 1) * i;
        let diagonalEndPoint = ((matrixSize * matrixSize) - 1) - diagonalStartPoint;
        let diagonalStep = i === 0 ? matrixSize + 1 : diagonalEndPoint / matrixSize;
        diagonalWinnableRows.push(intRange(diagonalStartPoint, diagonalEndPoint, diagonalStep));
    }
    return horizontalWinnableRows.concat(verticalWinnableRows).concat(diagonalWinnableRows);
}

function initializeCurrentBoard(matrixSize) {
    let tempCurrentBoard = [];
    const tempCurrentBoardSize = Math.pow(matrixSize, 2);
    for (let i = 0; i < tempCurrentBoardSize; i++) {
        tempCurrentBoard.push("");
    }
    return tempCurrentBoard;
}

function intRange(start, end, step) {
    let range = [];
    for (let i = start; i <= end; i += step) {
        range.push(i);
    }
    return range;
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `--- Player ${currentPlayer}'s Turn ---`;
}


function updateCell(cell, index) {
    currentBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function checkWinnerRow() {
    let didSomeoneWon = false;
    let winnerRow = [];
    for (let i = 0; i < allWinnableRows.length; i++) {
        const winnableRow = allWinnableRows[i];
        let tempTable = [];
        let possibleWinnerRow = [];
        for (let j = 0; j < matrixSize; j++) {
            tempTable.push(currentBoard[winnableRow[j]]);
            possibleWinnerRow.push(winnableRow[j]);
        }
        const allEqualCells = table => table.every(val => val === table[0] && val !== "");
        if (allEqualCells(tempTable)) {
            winnerRow = possibleWinnerRow;
            didSomeoneWon = true;
            break;
        }
    }
    if (didSomeoneWon) {
        statusText.textContent = `--- Player ${currentPlayer} Won!!! ---`;
        highlightWinnerRow(winnerRow);
        isGameRunning = false;
    } else if (!currentBoard.includes("")) {
        statusText.textContent = "--- It's a Draw!!! ---";
        isGameRunning = false;
    } else
        changePlayer();

}

function highlightWinnerRow(winnerRow) {
    for (let i = 0; i < winnerRow.length; i++) {
        const winnerCell = document.querySelector('[data-cell-index="' + winnerRow[i] + '"]');
        winnerCell.style.color = "red";
    }
}

/*
//Code from jimkast

function winnableRow(model, matrixSize) {
    return allWinnableRows(matrixSize).find(
        row => model[row[0]] != null && model[row[0]] !== '' && row.every(index => model[index] === model[row[0]]));
}

function allWinnableRows(matrixSize) {
    return allWinnableHorizontalRows(matrixSize).concat(allWinnableVerticalRows(matrixSize)).concat(allWinnableDiagonalRows(matrixSize));
}

function allWinnableHorizontalRows(matrixSize) {
    return intRangeV2(0, matrixSize, matrixSize).map(start => intRangeV2(start, matrixSize, 1));
}

function allWinnableVerticalRows(matrixSize) {
    return intRangeV2(0, matrixSize, 1).map(start => intRangeV2(start, matrixSize, matrixSize));
}

function allWinnableDiagonalRows(matrixSize) {
    return [
        intRangeV2(0, matrixSize, matrixSize + 1),
        intRangeV2(matrixSize - 1, matrixSize, matrixSize - 1),
    ];
}

console.log('aaaaaa');
console.log(allWinnableHorizontalRows(4));
console.log(allWinnableVerticalRows(4));
console.log(allWinnableDiagonalRows(4));
console.log(allWinnableRows(4));
console.log('bbbb');

function intRangeV2(start, arraySize, increment) {
    let range = [];
    let temp = start;
    for (let i = 0; i < arraySize; i++) {
        range.push(temp);
        temp += increment;
    }
    return range;
}*/
