
/*
problems:
- checking for a flag when opening, updating and both clicks.
could use an update function to avoid this

- minefield, blockfield and flagfield are all very similar but use different functions.
could make a general function that takes a field and modifies it depending on which type.


*/




const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}

var c = get("canvas").getContext("2d");
var Width = window.innerWidth;
var Height = window.innerHeight;
get("canvas").width = Width;
get("canvas").height = Height;

window.onresize = resize;
function resize() {
  Width = window.innerWidth;
  Height = window.innerHeight;
  get("canvas").width = Width;
  get("canvas").height = Height;
  refreshValues();
  draw();
}

function refreshValues() {
  minefield.pos.x = Width/2-minefield.pos.width/2;
  minefield.pos.y = Height/2-minefield.pos.height/2;
}

function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
  return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}

function drawBackground() {
  c.fillStyle = "rgb(20, 20, 20)";
  c.fillRect(0, 0, Width, Height);
}



var fontSize = 40;
var numberColors = [
  /*1*/ "rgb(100, 100, 100)",
  /*1*/ "rgb(50, 50, 200)",
  /*2*/ "rgb(50, 200, 50)",
  /*3*/ "rgb(200, 50, 50)",
  /*4*/ "rgb(0, 0, 150)",
  /*5*/ "rgb(0, 150, 0)",
  /*6*/ "rgb(150, 0, 0)",
  /*7*/ "rgb(200, 50, 250)",
  /*8*/ "rgb(20, 20, 20)",
]

var minefield = {};
var field = [];
var blockfield = [];
var flagfield = [];


function init() {

  minefield = {
    width: 10,
    height: 10,
    gridSize: 50,
    mines: 10,
  }

  minefield.pos = {
    width: minefield.width*minefield.gridSize,
    height: minefield.height*minefield.gridSize,
  }


  c.font = fontSize + "px Helvetica";
  c.textAlign = "center";
  c.textBaseline = "middle";

  refreshValues();

  field = generateMinefield();
  fillBlockfield();
  fillFlagfield();

  console.log(field);

  draw();
}

init();




document.getElementById("canvas").addEventListener("click", leftClick);
document.getElementById("canvas").addEventListener("contextmenu", rightClick, false);

function leftClick(event) {
  var gridX = Math.floor((event.clientX - minefield.pos.x)/minefield.gridSize);
  var gridY = Math.floor((event.clientY - minefield.pos.y)/minefield.gridSize);
  if (gridX >= 0 && gridX <= 9 && gridY >= 0 && gridY <= 9) {
    clearBlock(gridX, gridY);
    flagfield[gridX][gridY] = 0;
    draw();
  }
}

function rightClick(event) {
  event.preventDefault(); // Hides rightclick menu

  var gridX = Math.floor((event.clientX - minefield.pos.x)/minefield.gridSize);
  var gridY = Math.floor((event.clientY - minefield.pos.y)/minefield.gridSize);

  if (blockfield[gridX][gridY] == 1) {
    flagfield[gridX][gridY] = 1-flagfield[gridX][gridY];
  }
  draw();
}


function draw() {
  drawBackground();
  drawMinefield();
  drawBlockfield();
  drawFlagfield();
}


function clearBlock(x, y) {
  blockfield[x][y] = 0;

  if (getAdjMines(x, y) == 0) {
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if (x+i >= 0 && x+i <= 9 && y+j >= 0 && y+j <= 9) {
          if (blockfield[x+i][y+j] == 1) {
            flagfield[x+i][y+j] = 0;
            clearBlock(x+i, y+j);
          }
        }
      }
    }
  }
}



function getAdjMines(x, y) {
  var adjMines = 0; // adjacent mines

  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      if (x+i >= 0 && x+i <= 9 && y+j >= 0 && y+j <= 9) { // If inside field
        if (field[x+i][y+j] == 1) { // If mine
          adjMines++;
        }
      }
    }
  }
  return adjMines;
}
function getAdjFlags(x, y) {
  var adjFlags = 0;

  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      if (x+i >= 0 && x+i <= 9 && y+j >= 0 && y+j <= 9) {
        if (flagfield[x+i][y+j] == 1) {
          adjFlags++;
        }
      }
    }
  }
  return adjFlags;
}

function fillBlockfield() {
  for (var x = 0; x < minefield.width; x++) {
    blockfield[x] = [];
    for (var y = 0; y < minefield.height; y++) {
      blockfield[x][y] = 1;
    }
  }
}
function fillFlagfield() {
  for (var x = 0; x < minefield.width; x++) {
    flagfield[x] = [];
    for (var y = 0; y < minefield.height; y++) {
      flagfield[x][y] = 0;
    }
  }
}

function drawBlockfield() {
  c.save();
  c.translate(minefield.pos.x, minefield.pos.y);
  for (var x = 0; x < minefield.width; x++) {
    for (var y = 0; y < minefield.height; y++) {
      if (blockfield[x][y] == 1) {
        drawBlock(x, y);
      }
    }
  }
  c.restore();
}
function drawFlagfield() {
  c.save();
  c.translate(minefield.pos.x, minefield.pos.y);
  for (var x = 0; x < minefield.width; x++) {
    for (var y = 0; y < minefield.height; y++) {
      if (flagfield[x][y] == 1) {
        drawFlag(x, y);
      }
    }
  }
  c.restore();
}


function drawBlock(x, y) { // Because it blocks the number or mine
  c.save();
  c.scale(minefield.gridSize, minefield.gridSize);
  c.translate(x, y);

  c.lineWidth = 0.5/minefield.gridSize;
  c.strokeStyle = "rgb(150, 150, 150)";

  // Upper left triangle
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(1, 0);
  c.lineTo(0, 1);
  c.lineTo(0, 0);
  c.fillStyle = "rgb(200, 200, 200)";
  c.fill();
  c.stroke();

  // Lower right triangle
  c.beginPath();
  c.moveTo(1, 1);
  c.lineTo(1, 0);
  c.lineTo(0, 1);
  c.lineTo(1, 1);
  c.fillStyle = "rgb(100, 100, 100)";
  c.fill();
  c.stroke();

  var blockBevel = 0.1;
  c.beginPath();
  c.fillStyle = "rgb(150, 150, 150)";
  c.fillRect(blockBevel, blockBevel, 1-2*blockBevel, 1-2*blockBevel);

  c.restore();
}

function drawCell(x, y, size) {
  c.save();
  c.scale(minefield.gridSize, minefield.gridSize);
  c.translate(x, y);



  c.beginPath();
  c.lineWidth = 0.02;
  c.strokeStyle = "rgb(200, 200, 200)";
  c.fillStyle = "rgb(200, 200, 200)";
  c.rect(0, 0, 1, 1);
  c.fill();
  c.stroke();

  var lineWidth = 0.05;
  c.beginPath();
  c.fillStyle = "rgb(250, 250, 250)";
  c.fillRect(lineWidth, lineWidth, 1-2*lineWidth, 1-2*lineWidth);

  c.restore();
}

function drawMine(x, y) {
  c.save();
  c.scale(minefield.gridSize, minefield.gridSize);
  c.translate(x, y);
  c.beginPath();
  c.fillStyle = "rgb(200, 0, 0)";
  c.arc(1/2, 1/2, 1/3, 0, tau);
  c.fill();
  c.restore();
}

function drawFlag(x, y) {
  c.save();
  c.scale(minefield.gridSize, minefield.gridSize);
  c.translate(x, y);
  c.beginPath();
  c.fillStyle = "rgb(0, 0, 200)";
  c.moveTo(1/2+1/3, 1/2+1/4);
  c.lineTo(1/2-1/3, 1/2+1/4);
  c.lineTo(1/2, 1/2-1/3);
  c.lineTo(1/2+1/3, 1/2+1/4);
  c.fill();
  c.restore();
}

function drawNumber(x, y, number) {
  c.beginPath();
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = fontSize + "px Helvetica";
  c.fillStyle = numberColors[number];
  c.fillText(number, (x+0.5)*minefield.gridSize, (y+0.5)*minefield.gridSize+3);
}




function generateMinefield() {
  console.log("generating minefield");
  field = []; // 0 empty, 1 mine
  var cells = minefield.width*minefield.height;
  var mines = minefield.mines;

  for (var x = 0; x < minefield.width; x++) {
    field[x] = [];
    for (var y = 0; y < minefield.height; y++) {
      if (Math.random() < mines/cells) {
        field[x][y] = 1;
        mines--;
      } else {
        field[x][y] = 0;
      }
      cells--;
    }
  }

  return field;
}


function drawMinefield() {
  c.save();
  c.translate(minefield.pos.x, minefield.pos.y);

  for (var x = 0; x < field.length; x++) {
    for (var y = 0; y < field[x].length; y++) {

      drawCell(x, y);

      if (field[x][y] == 1) {
        drawMine(x, y);
      } else {
        drawNumber(x, y, getAdjMines(x, y));
      }
    }
  }

  c.restore();
}


function drawTest() {
  c.beginPath();
  c.arc(Width/2, Height/2, 50, 0, tau);
  c.fillStyle = "rgb(255, 255, 255)";
  c.fill();
}
