class Cell {
    constructor(x, y) {
        this.width = floor(width / cols);
        this.height = floor(width / rows);

        this.x = x;
        this.y = y;

        this.hasBomb = false;
        this.value = 0;

        this.neighbours = [];

        this.flagImg = loadImage("images/flag.png");
        this.bombImg = loadImage("images/bomb.png");
        this.bombDefusedImg = loadImage("images/bomb_defused.png")



        this.isRevealed = false;
        this.marked = false;

        this.pos = createVector(this.x * this.width, this.y * this.height);

        this.color = "#b2babb"
    }

    show() {
        fill(this.color);
        stroke(0);
        rect(this.pos.x, this.pos.y, this.width, this.height);
        if(this.isRevealed) {

            this.color = "#f4f6f6"
            if(this.hasBomb) {
                // fill(0);
                // ellipse(this.pos.x + floor(this.width / 2), this.pos.y + floor(this.height / 2), this.width /2);
                if(this.marked) {
                    this.bombDefusedImg.resize(this.width, this.height);
                    image(this.bombDefusedImg, this.pos.x, this.pos.y);
                } else {
                    this.bombImg.resize(this.width, this.height);
                    image(this.bombImg, this.pos.x, this.pos.y);
                }
            }
            else if(this.value > 0) {
                push();
                translate(this.pos.x + this.width / 2, this.pos.y + this.height - (this.height / 3));
                textSize(24);
                textAlign(CENTER);
                noStroke();
                textStyle(BOLD);
                if(this.value == 1) fill("#0000ff");
                else if(this.value == 2) fill("#1f7e10");
                else if(this.value == 3) fill("#db0000");
                else fill("#7E1010");
                text(this.value, 0, 0);
                pop();
            }


        }
        if(this.marked && !this.isRevealed) {
            this.flagImg.resize(this.width, this.height);
            image(this.flagImg, this.pos.x, this.pos.y);
        }
    }

    addNeighbours(grid) {
        var x = this.x;
        var y = this.y;

        // top
        if(y - 1 >= 0) {
            this.neighbours.push(grid[x][y-1]);

            // top right
            if(x + 1 < cols) {
                this.neighbours.push(grid[x + 1][y -1]);
            }
        }
        // right
        if(x + 1 < cols) {
            this.neighbours.push(grid[x + 1][y]);

            // right bottom
            if(y + 1 < rows) {
                this.neighbours.push(grid[x + 1][y + 1]);
            }
        }
        // bottom
        if(y + 1 < rows) {
            this.neighbours.push(grid[x][y + 1]);

            // bottom left
            if(x - 1 >= 0) {
                this.neighbours.push(grid[x -1][y + 1]);
            }
        }

        // left
        if(x - 1 >= 0) {
            this.neighbours.push(grid[x -1][y]);

            // left top
            if(y - 1 >= 0) {
                this.neighbours.push(grid[x -1][y -1]);
            }
        }
    }

    setValue() {
        for(let i = 0; i < this.neighbours.length; i++) {
            if(this.neighbours[i].hasBomb) {
                this.value++;
            }
        }
    }
}
