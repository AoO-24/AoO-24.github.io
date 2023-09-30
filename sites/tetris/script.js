var Tetromino;
(function (Tetromino) {
    Tetromino[Tetromino["Empty"] = 0] = "Empty";
    Tetromino[Tetromino["I"] = 1] = "I";
    Tetromino[Tetromino["L"] = 2] = "L";
    Tetromino[Tetromino["J"] = 3] = "J";
    Tetromino[Tetromino["Z"] = 4] = "Z";
    Tetromino[Tetromino["S"] = 5] = "S";
    Tetromino[Tetromino["T"] = 6] = "T";
    Tetromino[Tetromino["O"] = 7] = "O";
})(Tetromino || (Tetromino = {}));
const dropSpeed = [
    800,
    717,
    633,
    550,
    467,
    383,
    300,
    217,
    133,
    100,
    83,
    83,
    83,
    66,
    66,
    66,
    50,
    50,
    50,
    33,
    33,
    33,
    33,
    33,
    33,
    33,
    33,
    33,
    33,
    17,
];
const shapes = [
    [],
    [[1, 4], [1, 3], [1, 5], [1, 6], [0.5, 4.5]],
    [[1, 4], [0, 5], [1, 3], [1, 5], [1, 4]],
    [[1, 4], [0, 3], [1, 3], [1, 5], [1, 4]],
    [[0, 4], [0, 3], [1, 4], [1, 5], [0, 4]],
    [[0, 4], [0, 5], [1, 3], [1, 4], [0, 4]],
    [[1, 4], [0, 4], [1, 3], [1, 5], [1, 4]],
    [[0, 4], [0, 5], [1, 4], [1, 5], [0.5, 4.5]]
];
const keyMap = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    rotateClockwise: 'ArrowUp',
    rotateAnticlockwise: undefined,
    softDrop: 'ArrowDown',
    hold: 'Shift',
    hardDrop: 'Enter'
};
class Game {
    restart() {
        this.chessboard = [];
        this.score = 0;
        this.level = 0;
        this.totalLines = 0;
        for (let i = 0; i < 20; i++) {
            let temp = [];
            for (let j = 0; j < 10; j++) {
                temp.push(Tetromino.Empty);
            }
            this.chessboard.push(temp);
        }
        this.nextPiece = 1 + Math.floor(Math.random() * 7);
        this.holdPiece = Tetromino.Empty;
        this.initializeNextPiece();
        clearInterval(this.interval);
        this.interval = setInterval(() => gamePlay(this), 800);
    }
    constructor() {
        this.highScore = parseInt(localStorage.getItem("highScore")) || 0;
        this.restart();
    }
    initializeNextPiece() {
        this.currentPiece = this.nextPiece;
        this.currentPos = shapes[this.currentPiece];
        for (let i = 0; i < 4; i++) {
            if (this.currentPos[i][0] >= 0 && this.chessboard[this.currentPos[i][0]][this.currentPos[i][1]] != Tetromino.Empty) {
                return false;
            }
        }
        this.nextPiece = 1 + Math.floor(Math.random() * 7);
        return true;
    }
    tick() {
        const nextPos = [];
        for (let i = 0; i < 5; i++) {
            nextPos.push(this.currentPos[i].slice());
            nextPos[i][0] += 1;
            if (i != 4 && (nextPos[i][0] >= 20 || (nextPos[i][0] >= 0 && this.chessboard[nextPos[i][0]][nextPos[i][1]]) != Tetromino.Empty)) {
                for (let j = 0; j < 4; j++) {
                    this.chessboard[this.currentPos[j][0]][this.currentPos[j][1]] = this.currentPiece;
                }
                let eliminatedLines = 0;
                for (let r = 19; r >= 0; r--) {
                    let flag = true;
                    for (let c = 0; c < 10; c++) {
                        if (game.chessboard[r][c] == Tetromino.Empty) {
                            flag = false;
                            break;
                        }
                    }
                    if (!flag)
                        continue;
                    eliminatedLines++;
                    for (let j = r; j > 0; j--) {
                        for (let c = 0; c < 10; c++) {
                            game.chessboard[j][c] = game.chessboard[j - 1][c];
                        }
                    }
                    r++;
                }
                if (eliminatedLines == 1) {
                    this.score += this.level * 40 + 40;
                }
                else if (eliminatedLines == 2) {
                    this.score += this.level * 100 + 100;
                }
                else if (eliminatedLines == 3) {
                    this.score += this.level * 300 + 300;
                }
                else if (eliminatedLines == 4) {
                    this.score += this.level * 1200 + 1200;
                }
                this.totalLines += eliminatedLines;
                if (this.totalLines >= 10) {
                    this.totalLines -= 10;
                    this.level++;
                }
                game.softDrop = false;
                clearInterval(this.interval);
                this.interval = setInterval(() => gamePlay(this), dropSpeed[this.level]);
                return this.initializeNextPiece();
            }
        }
        if (this.softDrop)
            this.score++;
        this.currentPos = nextPos;
        return true;
    }
    shift(amount) {
        const nextPos = [];
        for (let i = 0; i < 5; i++) {
            nextPos.push(this.currentPos[i].slice());
            nextPos[i][1] += amount;
            if (i != 4 && (nextPos[i][1] < 0 || nextPos[i][1] >= 10 || (nextPos[i][0] >= 0 && this.chessboard[nextPos[i][0]][nextPos[i][1]] != Tetromino.Empty))) {
                return;
            }
        }
        this.currentPos = nextPos;
    }
    rotate(anticlockwise) {
        const nextPos = [];
        let center = this.currentPos[4].slice();
        for (let i = 0; i < 4; i++) {
            const rel_x = this.currentPos[i][0] - center[0];
            const rel_y = this.currentPos[i][1] - center[1];
            let newBlock;
            if (anticlockwise) {
                newBlock = [center[0] - rel_y, center[1] + rel_x];
            }
            else {
                newBlock = [center[0] + rel_y, center[1] - rel_x];
            }
            if (newBlock[0] >= 20 || newBlock[1] < 0 || newBlock[1] >= 10 || (newBlock[0] >= 0 && this.chessboard[newBlock[0]][newBlock[1]] != Tetromino.Empty)) {
                return;
            }
            nextPos.push(newBlock);
        }
        nextPos.push(this.currentPos[4]);
        this.currentPos = nextPos;
    }
    hold() {
        let temp = this.holdPiece;
        if (temp == Tetromino.Empty) {
            temp = this.nextPiece;
            this.nextPiece = 1 + Math.floor(Math.random() * 7);
        }
        const nextPos = [this.currentPos[0]];
        for (let i = 1; i < 5; i++) {
            const rel_x = shapes[temp][i][0] - shapes[temp][0][0];
            const rel_y = shapes[temp][i][1] - shapes[temp][0][1];
            nextPos.push([this.currentPos[0][0] + rel_x, this.currentPos[0][1] + rel_y]);
            if (i != 4 && (nextPos[i][0] >= 20 || nextPos[i][1] < 0 || nextPos[i][1] >= 10 || (nextPos[i][0] >= 0 && this.chessboard[nextPos[i][0]][nextPos[i][1]] != Tetromino.Empty))) {
                return;
            }
        }
        this.holdPiece = this.currentPiece;
        this.currentPiece = temp;
        this.currentPos = nextPos;
    }
    hardDrop() {
        while (true) {
            const nextPos = [];
            for (let i = 0; i < 5; i++) {
                nextPos.push(this.currentPos[i].slice());
                nextPos[i][0] += 1;
                if (i != 4 && (nextPos[i][0] >= 20 || (nextPos[i][0] >= 0 && this.chessboard[nextPos[i][0]][nextPos[i][1]] != Tetromino.Empty))) {
                    return this.tick();
                }
            }
            this.currentPos = nextPos;
            this.score += 2;
        }
    }
    gameOver() {
        alert(`Game Over! Score: ${this.score}. ${this.score > this.highScore ? "\nNew High Score!" : ""}`);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("highScore", this.highScore.toString());
        }
        this.restart();
    }
}
function gamePlay(game) {
    if (game.tick()) {
        update(game);
    }
    else {
        game.gameOver();
    }
}
function render(game) {
    let parent = document.getElementById("game");
    game.chessboard.forEach((row, i) => {
        const rowElement = document.createElement("div");
        rowElement.className = "block-row";
        rowElement.id = `r${i}`;
        row.forEach((block, j) => {
            const blockElement = document.createElement("div");
            blockElement.classList.add("block");
            blockElement.id = `r${i}c${j}`;
            rowElement.appendChild(blockElement);
        });
        parent.appendChild(rowElement);
    });
    update(game);
}
function update(game) {
    game.chessboard.forEach((row, i) => {
        row.forEach((block, j) => {
            const blockElement = document.getElementById(`r${i}c${j}`);
            blockElement.classList.remove("unset", "projection", "t-1", "t-2", "t-3", "t-4", "t-5", "t-6", "t-7");
            if (block != Tetromino.Empty) {
                blockElement.classList.add(`t-${block}`);
            }
            for (let k = 0; k < 4; k++) {
                if (i == game.currentPos[k][0] && j == game.currentPos[k][1]) {
                    blockElement.classList.add("unset", `t-${game.currentPiece}`);
                }
            }
        });
    });
    let finalPos = game.currentPos;
    while (true) {
        const nextPos = [];
        let flag = false;
        for (let i = 0; i < 4; i++) {
            nextPos.push(finalPos[i].slice());
            nextPos[i][0] += 1;
            if (nextPos[i][0] >= 20 || (nextPos[i][0] > 0 && game.chessboard[nextPos[i][0]][nextPos[i][1]] != Tetromino.Empty)) {
                flag = true;
                break;
            }
        }
        if (flag)
            break;
        finalPos = nextPos;
    }
    for (let f of finalPos) {
        document.getElementById(`r${f[0]}c${f[1]}`).classList.add("projection");
    }
    for (let i = 1; i < 8; i++) {
        if (i != game.nextPiece)
            document.getElementById(`n-${i}`).classList.add("hidden");
        else
            document.getElementById(`n-${i}`).classList.remove("hidden");
        if (i != game.holdPiece)
            document.getElementById(`h-${i}`).classList.add("hidden");
        else
            document.getElementById(`h-${i}`).classList.remove("hidden");
    }
    document.getElementById("score-display").innerHTML = game.score.toString();
    document.getElementById("level-display").innerHTML = game.level.toString();
    document.getElementById("high-score-display").innerHTML = game.highScore.toString();
}
let game = new Game();
let pressedKeys = [];
window.onload = () => {
    const board = document.getElementById("game");
    if (!board) {
        return;
    }
    render(game);
    document.addEventListener('keydown', (event) => {
        if (event.key == keyMap.left) {
            game.shift(-1);
            update(game);
            return;
        }
        if (event.key == keyMap.right) {
            game.shift(1);
            update(game);
            return;
        }
        if (pressedKeys.includes(event.key))
            return;
        pressedKeys.push(event.key);
        if (event.key == keyMap.softDrop) {
            game.softDrop = true;
            clearInterval(game.interval);
            game.interval = setInterval(() => gamePlay(game), 33);
        }
        if (event.key == keyMap.rotateClockwise) {
            game.rotate(false);
        }
        if (event.key == keyMap.rotateAnticlockwise) {
            game.rotate(true);
        }
        if (event.key == keyMap.hold) {
            game.hold();
        }
        if (event.key == keyMap.hardDrop) {
            if (!game.hardDrop()) {
                game.gameOver();
            }
        }
        update(game);
    });
    document.addEventListener('keyup', (event) => {
        pressedKeys = pressedKeys.filter((key) => key != event.key);
        if (event.key == keyMap.softDrop) {
            game.softDrop = false;
            clearInterval(game.interval);
            game.interval = setInterval(() => gamePlay(game), dropSpeed[game.level]);
        }
    });
};
//# sourceMappingURL=script.js.map