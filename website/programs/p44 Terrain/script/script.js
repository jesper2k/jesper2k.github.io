
var c = document.getElementById("canvas").getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;

function get(context) {
  return document.getElementById(content);
}

function generatingScreen() {

}

generatingScreen();

const tau = 2*Math.PI;
var terrainLoaded = false;


var sealevel = 8;
var heights = [
  {r: 10, g: 50, b: 150},
  {r: 15, g: 55, b: 170},
  {r: 15, g: 60, b: 170},
  {r: 15, g: 65, b: 180},
  {r: 20, g: 70, b: 190},
  {r: 20, g: 85, b: 200}, // 5
  {r: 20, g: 100, b: 210},
  {r: 20, g: 120, b: 220},
  {r: 20, g: 150, b: 240}, // Sea
  {r: 40, g: 200, b: 70}, // Land
  {r: 35, g: 190, b: 65}, // 10
  {r: 30, g: 180, b: 60},
  {r: 25, g: 170, b: 55},
  {r: 20, g: 160, b: 50},
  {r: 15, g: 150, b: 45},
  {r: 30, g: 140, b: 50}, // 15
  {r: 50, g: 130, b: 60},
  {r: 70, g: 120, b: 70},
  {r: 90, g: 110, b: 80},
  {r: 100, g: 100, b: 100},
  {r: 120, g: 120, b: 120}, // 20
  {r: 140, g: 140, b: 140},
  {r: 160, g: 160, b: 160},
  {r: 180, g: 180, b: 180},
  {r: 200, g: 200, b: 200},
  {r: 220, g: 220, b: 220}, // 25
  {r: 230, g: 230, b: 230},
  {r: 240, g: 240, b: 240},
];

var beachHeighs = [
  "rgb(240, 230, 140)",
  "rgb(220, 200, 100)",
]


var heightReduce = -0.030; // Overall height value reduction
var heightAmplify = 200; // Amplifies the average-flattened array
var averageSize = 27; // Size of the averaged section

var gridSize = 5;
var randomAWidth = (width/gridSize+averageSize); // Width of the randomized array
var randomAHeight = (height/gridSize+averageSize);

var randomA = [];
var terrain = []; // Terrain

// generates random values for the terrain
for (var i = 0; i < randomAHeight; i++) {
  var randomARow = [];
  for (var j = 0; j < randomAWidth; j++) {
    randomARow[j] = (Math.random()*2)-1;
  }
  randomA[i] = randomARow;
}


// squishes the random values
for (var i = 0; i < randomA.length-(averageSize-1); i++) {
  terrainRow = [];
  for (var j = 0; j < randomARow.length-(averageSize-1); j++) {
    var currentSum = 0;
    // The 3x3 values that get averaged
    for (var k = 0; k < averageSize; k++) {
      for (var l = 0; l < averageSize; l++) {
        currentSum += randomA[i+k][j+l]/(1+Math.sqrt(((averageSize-1)/2-k)**2+((averageSize-1)/2-l)**2));
      }
    }
    terrainRow[j] = (currentSum/averageSize**1.5 - heightReduce)*heightAmplify;
  }
  terrain[i] = terrainRow;
}

// Generates areas in which beaches can spawn
var amtBeaches = 10; var beachRadius = 10;
var beaches = [];
for (var i = 0; i < amtBeaches; i++) {
  beaches[i] = {
    x: Math.random()*(width/gridSize),
    y: Math.random()*(height/gridSize),
  }
}


function draw() {
  for (var i = 0; i < terrain.length; i++) {
    for (var j = 0; j < terrain[0].length; j++) {
      drawSquare(i, j, terrain[i][j]);
    }
  }
}

function drawSquare(i, j, height) {
  c.beginPath();
  c.fillStyle = "rgb(" +
  (heights[Math.min(Math.max(0, parseInt(height)), heights.length-1)].r) + "," +
  (heights[Math.min(Math.max(0, parseInt(height)), heights.length-1)].g) + "," +
  (heights[Math.min(Math.max(0, parseInt(height)), heights.length-1)].b) + ")";

  // if it is close to a beach, use the beach texture instead
  for (var k = 0; k < amtBeaches; k++) {
    if (Math.sqrt((j-beaches[k].x)**2 + (i-beaches[k].y)**2) <= beachRadius && Math.random() < 1) {
      c.fillStyle = beachHeighs[sealevel+beachHeighs.length - Math.min(Math.max(0, parseInt(height)), heights.length-1)];
    }
  }

  c.fillRect(j*gridSize, i*gridSize, gridSize, gridSize);
}

draw();




var canv = document.getElementById("canvas");
canv.onmousemove = findMouse;
canv.onmousedown = mouseDown;
canv.onmouseup = mouseUp;

var mouse = {
  x: 0,
  y: 0,
}
var brush;
var drawSize = 10;
var drawStrength = 0.3;

function findMouse(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

function mouseDown() {
  brush = setInterval(function() {
    raiseTerrain();
  }, 10);
}

function mouseUp() {
  mouseIsDown = false;
  clearInterval(brush);
}

function raiseTerrain() {
  var mouseXInGrid = parseInt(mouse.x/gridSize);
  var mouseYInGrid = parseInt(mouse.y/gridSize);

  var mouseXInGridShifted = mouseXInGrid - parseInt(drawSize/2);
  var mouseYInGridShifted = mouseYInGrid - parseInt(drawSize/2);

  for (var i = -0; i < drawSize; i++) {
    for (var j = -0; j < drawSize; j++) {

      terrain[mouseYInGridShifted+i][mouseXInGridShifted+j] += drawStrength/(Math.sqrt(1+((drawSize-1)/2-i)**2+((drawSize-1)/2-j)**2));
      drawSquare(mouseYInGridShifted+i, mouseXInGridShifted+j, terrain[mouseYInGridShifted+i][mouseXInGridShifted+j]);
    }
  }
}
