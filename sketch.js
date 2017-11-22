let rows = 16;
let cols = 16;
let grid = new Array(cols);

let amountBombs = 40;

let amountFlags = amountBombs;

let bombsPlaced = false;

let gameOver = false;
let youWon = false;

let time = "000";

function setup() {
    createCanvas(640, 640);

    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeighbours(grid);
        }
    }
}

function draw() {
    background(0);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    if (gameOver) {
        if(youWon) showMessage("You won! :)", "#1fb03b")
        else showMessage("You Lost! :(", "#ff0000")
    }

    document.getElementById("flags").innerHTML = "Flags left: " + amountFlags;
    document.getElementById("time").innerHTML = "Time spend: " + time;

    if(amountFlags == 0) youWon = checkWon();

    if(youWon) {
        game_over();
        gameOver = true;
    }
}

let timer = setInterval(function() {
    time++;
    time = ("00" + time).slice(-3);

}, 1000);

function mousePressed() {
    if (!gameOver) {
        let x = floor(mouseX / (width / cols));
        let y = floor(mouseY / (height / rows));
        if (x < cols && x >= 0 && y < rows && y >= 0) {
            if (!bombsPlaced) {
                bombsPlaced = place_bombs(x, y);
                setCellValues();
            }
            let current = grid[x][y];
            if (mouseButton == RIGHT && amountFlags > 0 && !current.marked) {
                current.marked = true;
                amountFlags--;
            }

            if (mouseButton == LEFT) {
                if (!current.marked) {
                    current.isRevealed = true;

                    if (current.hasBomb) {
                        current.color = "#ff0000";
                        game_over();
                        gameOver = true;
                        // stop the timer
                        clearInterval(timer);
                    } else if (current.value == 0) {
                        reveal_empty_cells(current);
                    }
                }
            }
        }

    }
}

function randCoords() {
    let randX = floor(random(0, cols));
    let randY = floor(random(0, rows));

    return [randX, randY];
}

function reveal_empty_cells(start) {
    let done = new Set();
    let queue = [start];

    while (queue.length > 0) {
        let current = queue.pop();
        current.isRevealed = true;

        if (!done.has(current)) {
            done.add(current);

            for (let i = 0; i < current.neighbours.length; i++) {
                let cell = current.neighbours[i];
                if (cell.value == 0 && !cell.isRevealed && !cell.marked) {
                    queue.push(cell);
                } else if (!cell.isRevealed && !cell.marked) {
                    cell.isRevealed = true;
                }
            }
        }
    }

}

function game_over() {
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (grid[x][y].hasBomb) {
                grid[x][y].isRevealed = true;
            }
        }
    }
}

function showMessage(message, color) {
    textSize(48);
    fill(color);
    noStroke();
    let textW = textWidth(message);
    text(message, width / 2 - textW /2, height / 2);
}

function place_bombs(cellX, cellY) {
    // places random bombs in the field
    // generates the field after the player clicked on a cell
    // so he never clicks on a bomb, when all cells are hidden
    for (let i = 0; i < amountBombs; i++) {
        let randC = randCoords();
        let x = randC[0];
        let y = randC[1];
        while (grid[x][y].hasBomb || x == cellX && y == cellY) {
            if (x < cols - 1) {
                x++;
            } else if (y < rows - 1) {
                y++;
            } else {
                x = 0;
            }
        }
        if (!grid[x][y].hasBomb) {
            grid[x][y].hasBomb = true;
        }
    }

    return true;
}

function setCellValues() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].setValue();
        }
    }
}

function *eachCell() {
    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            yield grid[i][j];
        }
    }
}

function checkWon() {
    let cell = eachCell();
    let currentCell = cell.next();

    let c = 0;

    while(!currentCell.done) {
        if(currentCell.value.marked && currentCell.value.hasBomb) {
            c += 1;
        }

        currentCell = cell.next();
    }

    if(c == amountBombs) return true;
    return false;
}

// function isInList(list, item) {
//     for(let i = 0; i < list.length; i++) {
//         if(list[i] == item)
//             return true;
//     }

//     return false;
// }
