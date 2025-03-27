

/* Controls */

// Visual
const gridSize = 18;
var backgroundColor = "rgb(40, 40, 70)";
var knightColor = "rgb(50, 100, 250)";
var illegalLocationColor = "rgb(20, 20, 20)";



// Functional
var costEnabled = true;
const mapRadius = 500;
var allowMultipleVisits = false;
var possibleMoves = [
    [1, 2],
    [2, 1],
    [-1, 2],
    [-2, 1],
    [1, -2],
    [2, -1],
    [-1, -2],
    [-2, -1],
];

/* -------- */

const tau = 2 * Math.PI;

var c = document.getElementById("canvas").getContext("2d");
var c2 = document.getElementById("canvas2").getContext("2d");

var Width = window.innerWidth;
var Height = window.innerHeight;

document.getElementById("canvas").width = Width;
document.getElementById("canvas").height = Height;
document.getElementById("canvas2").width = Width;
document.getElementById("canvas2").height = Height;
c.translate(0, 0);
c2.translate(0, 0);

function clearCanvas() {
    c.beginPath();
    c.fillStyle = backgroundColor;
    c.fillRect(-10, -10, Width+20, Height+20);
    c2.beginPath();
    c2.clearRect(0, 0, Width, Height);
}

function colorToRGBA(color) {
  return "rgb(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
}

function getRainbowColor(t) {
    return {
        r: 100+255*Math.sin(Math.sqrt(t/5000)*tau),
        g: 100+255*Math.sin(Math.sqrt(t/5000)*tau + 1/3*tau),
        b: 100+255*Math.sin(Math.sqrt(t/5000)*tau + 2/3*tau),
        a: 1,
    }
}

var costTable = [];

function generateCostTable() { // square spiral cost table

    for (var x = 0; x < mapRadius*2; x++) {
        costTable[x] = [];
        for (var y = 0; y < mapRadius*2; y++) {
            costTable[x][y] = 0; // Initializing values
        }
    }

    var posX = mapRadius;
    var posY = mapRadius;

    var cost = 1;
    var direction = "right";
    var lineBlockLength = 1;
    var blocksLeftInLine = lineBlockLength;

    for (var i = 0; i < mapRadius*mapRadius*4*0.90; i++) { // Would get conflict at outer edge if not -8*mapRadius
        switch (direction) {
            case "down":
                posY++;
                break;
            case "right":
                posX++;
                break;
            case "up":
                posY--;
                break;
            case "left":
                posX--;
                break;
        }
        blocksLeftInLine--;

        // Switch direction, maybe increase lineBlockLength and set blocksLeftInLine to the new value
        if (blocksLeftInLine == 0) {
            switch (direction) {
                case "down":
                    direction = "right";
                    lineBlockLength++;
                    break;
                case "right":
                    direction = "up";
                    break;
                case "up":
                    direction = "left";
                    lineBlockLength++;
                    break;
                case "left":
                    direction = "down";
                    break;
            }

            blocksLeftInLine = lineBlockLength;
        }

        costTable[posX][posY] = cost;
        cost++;
    }
}





var illegalLocations = [];

function generateIllegalLocations() {
    for (var x = 0; x < mapRadius*2; x++) {
        illegalLocations[x] = [];
        for (var y = 0; y < mapRadius*2; y++) {
            illegalLocations[x][y] = 0;
            /*
            if (Math.abs(mapRadius - x) >= 5 || Math.abs(mapRadius - y) >= 3) {
                illegalLocations[x][y] = 1;
            }*/
        }
    }
}
function drawIllegalLocations() {
    for (var x = 0; x < illegalLocations.length; x++) {
        for (var y = 0; y < illegalLocations[0].length; y++) {
            if (illegalLocations[x][y] == 1) {
                fillCell(x, y, illegalLocationColor);
            }
        }
    }
}


function fillCell(x, y, color) {
    var posX = Width/2 + (x - mapRadius - 1/2) * gridSize;
    var posY = Height/2 + (y - mapRadius - 1/2) * gridSize;

    c.beginPath();
    c.fillStyle = color;
    c.rect(posX, posY, gridSize, gridSize);
    c.fill();
}

var knight = {

    color: knightColor,

    position: {
        x: mapRadius,
        y: mapRadius,
    },

    move: function() {
        fillCell(this.position.x, this.position.y, illegalLocationColor); // Previous position is illegal

        var move = getLegalMove();

        if (move == -1) {
            terminate();
            return;
        }


        this.position.x += move[0];
        this.position.y += move[1];

        illegalLocations[this.position.x][this.position.y] = 1;

    },

    draw: function() {
        fillCell(this.position.x, this.position.y, knightColor);
    },
}

function coordinateIsWithinMaps(x, y) {
    if (x >= 2 && y >= 2 && x < mapRadius*2 - 2 && y < mapRadius*2 - 2) {
        if (costTable[x][y] != 0) {
            return true;
        }
        return false;
    }
    return false;

}

function isIllegalMove(move) {
    if (coordinateIsWithinMaps(knight.position.x + move[0], knight.position.y + move[1])) {
        if (illegalLocations[knight.position.x + move[0]][knight.position.y + move[1]] == 0) {
            return false;
        }
        return true;
    }
    return true;
}

function getLegalMove() {
    if (!costEnabled) {
        var currentPossibleMoves = possibleMoves.map((x) => x);

        var move = currentPossibleMoves[Math.floor(currentPossibleMoves.length*Math.random())];

        while (isIllegalMove(move)) {
            var removedMove = currentPossibleMoves.splice(currentPossibleMoves.indexOf(move), 1);

            if (currentPossibleMoves.length == 0) {
                break;
            }

            move = currentPossibleMoves[Math.floor(currentPossibleMoves.length*Math.random())];
        }

        if (currentPossibleMoves.length == 0) {
            return -1;
        }

        return move;
    } else {
        var currentPossibleMoves = possibleMoves.map((x) => x);

        // Gets rid of illegal moves
        for (var i = 0; i < currentPossibleMoves.length; i++) {
            if (isIllegalMove(currentPossibleMoves[i])) {
                currentPossibleMoves.splice(i, 1);
                i--;
            }
        }

        if (currentPossibleMoves.length == 0) {
            return -1;
        }

        var lowestCostMove = {
            move: currentPossibleMoves[0],
            cost: costTable[knight.position.x + currentPossibleMoves[0][0]][knight.position.y + currentPossibleMoves[0][1]],
        }

        for (var i = 0; i < currentPossibleMoves.length; i++) {
            if (costTable[knight.position.x + currentPossibleMoves[i][0]][knight.position.y + currentPossibleMoves[i][1]] < lowestCostMove.cost) {
                lowestCostMove.move = currentPossibleMoves[i];
                lowestCostMove.cost = costTable[knight.position.x + currentPossibleMoves[i][0]][knight.position.y + currentPossibleMoves[i][1]];
            }
        }

        return lowestCostMove.move;
    }
}


var time = 0;
function initialize() {
    clearCanvas();
    time = 0

    generateIllegalLocations();
    illegalLocations[knight.position.x][knight.position.y] = 1;
    drawIllegalLocations();

    generateCostTable();

    knight.draw(); // Draws initial position

    c2.lineWidth = 2;
    c2.lineCap = "round";
    console.log(c2);
}

function update() {
    // Line
    c2.beginPath();
    var posX = Width/2 + (knight.position.x - mapRadius) * gridSize;
    var posY = Height/2 + (knight.position.y - mapRadius) * gridSize;
    c2.moveTo(posX, posY);

    time++;
    knight.move();
    knight.draw();

    // Line
    var posX = Width/2 + (knight.position.x - mapRadius) * gridSize;
    var posY = Height/2 + (knight.position.y - mapRadius) * gridSize;
    c2.strokeStyle = colorToRGBA(getRainbowColor(time));
    c2.lineTo(posX, posY);
    c2.stroke();
}

function terminate() {

    console.log("no more valid moves!");
    console.log(costTable[knight.position.x][knight.position.y]);
    clearInterval(animation);
}



initialize();
var animation = setInterval(function() {
    for (var i = 0; i < 100; i++) {
        update();
    }
}, 10);
