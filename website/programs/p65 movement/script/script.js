const tau = 2*Math.PI;

var Width = window.innerWidth;
var Height = window.innerHeight;

function get(context) {
  return document.getElementById(context);
}

var c1 = document.getElementById("canvas1").getContext("2d");
get("canvas1").width = Width;
get("canvas1").height = Height;

var c2 = document.getElementById("canvas2").getContext("2d");
var canvasSize = 5000+(2000-1232); //1000
get("canvas2").width = canvasSize + Width-Height;
get("canvas2").height = canvasSize;


var player = {
  size: 8,
  movementSpeed: 20,
  rotation: {
    degrees: 0,
    degreesDisplayed: 0,
  }
}


var mouse = {
  x: Width/2,
  y: Height/2,
}

var spawn = {
  x: 2000,
  y: 2000,
}

var velocity = {
  x: 0,
  y: 0,
}

var canvasPosition = {
  x: get("canvas2").width/2,
  y: get("canvas2").height/2,
}

get("canvas1").onmousemove = findMouse;
function findMouse(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}



var holdingKey = {
  w: false,
  a: false,
  s: false,
  d: false,
}

// Key event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(event) {
  x = event.keyCode;
  if (x == 87 && holdingKey.w == false) {
    holdingKey.w = true;
  } else if (x == 65 && holdingKey.a == false) {
    holdingKey.a = true;
  } else if (x == 83 && holdingKey.s == false) {
    holdingKey.s = true;
  } else if (x == 68 && holdingKey.d == false) {
    holdingKey.d = true;
  }
}
function keyUp(event) {
  x = event.keyCode;
  if (x == 87) {
    holdingKey.w = false;
  } else if (x == 65) {
    holdingKey.a = false;
  } else if (x == 83) {
    holdingKey.s = false;
  } else if (x == 68) {
    holdingKey.d = false;
  }
}

function update() {
  var vX = 0;
  var vY = 0;
  var numHolding = 0;

  if (holdingKey.w) {vY -= player.movementSpeed; numHolding++}
  if (holdingKey.a) {vX -= player.movementSpeed; numHolding++}
  if (holdingKey.s) {vY += player.movementSpeed; numHolding++}
  if (holdingKey.d) {vX += player.movementSpeed; numHolding++}

  if (numHolding%2 == 0) {
    vX /= 2**0.5;
    vY /= 2**0.5;
  }

  var imgd = c2.getImageData(canvasPosition.x + Width/2, canvasPosition.y + Height/2, 1, 1);
  var pix = imgd.data;
  if (pix[2] == 240) {
    vX *= 0.6;
    vY *= 0.6;
  } else if (pix[2] >= 150) {
    vX *= 0.2;
    vY *= 0.2;
  }

  canvasPosition.x += vX;
  canvasPosition.y += vY;

  // Prevents the player from moving outside map
  if (canvasPosition.x < 0) {
    canvasPosition.x = Math.max(0, canvasPosition.x);
  } else if (canvasPosition.x > get("canvas2").width - Width) {
    canvasPosition.x = Math.min(get("canvas2").width - Width, canvasPosition.x);
  }
  if (canvasPosition.y < 0) {
    canvasPosition.y = Math.max(0, canvasPosition.y);
  } else if (canvasPosition.y > get("canvas2").height - Height) {
    canvasPosition.y = Math.min(get("canvas2").height - Height, canvasPosition.y);
  }

  canvasPosition.x = parseFloat(canvasPosition.x.toFixed(2));
  canvasPosition.y = parseFloat(canvasPosition.y.toFixed(2));

  get("canvas2").style.marginLeft = (-canvasPosition.x) + "px";
  get("canvas2").style.marginTop = (-canvasPosition.y) + "px";
}





function drawPlayer() {
  c1.clearRect(0, 0, Width, Height);

  c1.beginPath();
  c1.save();
  c1.translate(Width/2, Height/2);
  c1.rotate(player.rotation.degreesDisplayed * tau/360,true);
  c1.scale(player.size, player.size);
  c1.moveTo(0, -10);
  c1.lineTo(5*Math.cos(tau/12), -5*Math.sin(tau/12));
  c1.arc(0, 0, 5, tau/6-tau/4, tau*5/6-tau/4);
  c1.lineTo(0, -10);
  c1.arc(0, 0, 3, -tau/4, tau-tau/4, true);
  c1.fillStyle = "rgb(0, 0, 0, 0.75)";
  c1.fill();
  c1.restore();
}


var rotateSpeed = 15;

function updatePlayerDirection() {
  if (player.rotation.degrees < 0) {player.rotation.degrees+=360;}
  if (player.rotation.degreesDisplayed < 0) {player.rotation.degreesDisplayed+=360;}
  if (player.rotation.degrees >= 360) {player.rotation.degrees-=360;}
  if (player.rotation.degreesDisplayed >= 360) {player.rotation.degreesDisplayed-=360;}

  var numHolding = 0;
  if (holdingKey.w) {player.rotation.degrees = 0; numHolding++;}
  if (holdingKey.a) {player.rotation.degrees = 270; numHolding++;}
  if (holdingKey.s) {player.rotation.degrees = 180; numHolding++;}
  if (holdingKey.d) {player.rotation.degrees = 90; numHolding++;}

  if (numHolding == 2) {
    if (holdingKey.w && holdingKey.d) {player.rotation.degrees = 45;}
    if (holdingKey.a && holdingKey.w) {player.rotation.degrees = 315;}
    if (holdingKey.s && holdingKey.a) {player.rotation.degrees = 225;}
    if (holdingKey.d && holdingKey.s) {player.rotation.degrees = 135;}
    if (holdingKey.d && holdingKey.a) {player.rotation.degrees = 0;}
    if (holdingKey.w && holdingKey.s) {player.rotation.degrees = 90;}
  } else if (numHolding == 3) {
    if (!holdingKey.w) {player.rotation.degrees = 180;}
    if (!holdingKey.a) {player.rotation.degrees = 90;}
    if (!holdingKey.s) {player.rotation.degrees = 0;}
    if (!holdingKey.d) {player.rotation.degrees = 270;}
  }


  var degreesDiff = player.rotation.degrees-player.rotation.degreesDisplayed;
  if (degreesDiff < 0) {degreesDiff += 360;}
  if (degreesDiff < 0) {degreesDiff += 360;}
  if (degreesDiff >= 360) {degreesDiff -= 360;}

  if (degreesDiff != 0) {
    if (degreesDiff <= 180 && degreesDiff > 0) {
      player.rotation.degreesDisplayed += Math.min(rotateSpeed, Math.abs(degreesDiff));
    } else if (degreesDiff > 180 && degreesDiff < 360) {
      player.rotation.degreesDisplayed -= Math.min(rotateSpeed, Math.abs(degreesDiff));
    }
  }
}

var running = setInterval(function() {
  update(velocity.x, velocity.y);
  updatePlayerDirection();
  drawPlayer();
}, 1000/58);




var gridSize = 40;
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
  {r: 240, g: 240, b: 241},
];

var beachHeighs = [
  "rgb(240, 230, 140)",
  "rgb(220, 200, 100)",
]


var heightReduce = -0.060; // Overall height value reduction
var heightAmplify = 100; // Amplifies the average-flattened array
var averageSize = 16; // Size of the averaged section

var randomAWidth = (get("canvas2").width/gridSize+averageSize); // Width of the randomized array
var randomAHeight = (get("canvas2").width/gridSize+averageSize);

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
var amtBeaches = 23; var beachRadius = 8;
var beaches = [];
for (var i = 0; i < amtBeaches; i++) {
  beaches[i] = {
    x: Math.random()*(get("canvas2").width/gridSize),
    y: Math.random()*(get("canvas2").height/gridSize),
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
  c2.beginPath();
  c2.fillStyle = "rgb(" +
  (heights[Math.min(Math.max(0, parseInt(height)), heights.length-1)].r) + "," +
  (heights[Math.min(Math.max(0, parseInt(height)), heights.length-1)].g) + "," +
  (heights[Math.min(Math.max(0, parseInt(height)), heights.length-1)].b) + ")";

  // if it is close to a beach, use the beach texture instead
  for (var k = 0; k < amtBeaches; k++) {
    if (Math.sqrt((j-beaches[k].x)**2 + (i-beaches[k].y)**2) <= beachRadius && Math.random() < 1) {
      c2.fillStyle = beachHeighs[sealevel+beachHeighs.length - Math.min(Math.max(0, parseInt(height)), heights.length-1)];
    }
  }

  c2.fillRect(j*gridSize, i*gridSize, gridSize, gridSize);
}

draw();


get("canvas1").onmousedown = mouseDown;
get("canvas1").onmouseup = mouseUp;

var brush;
var drawSize = 5;
var drawStrength = 0.1;

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
  var mouseXInGrid = parseInt((mouse.x+canvasPosition.x)/gridSize);
  var mouseYInGrid = parseInt((mouse.y+canvasPosition.y)/gridSize);

  var mouseXInGridShifted = mouseXInGrid - parseInt(drawSize/2);
  var mouseYInGridShifted = mouseYInGrid - parseInt(drawSize/2);

  for (var i = 0; i < drawSize; i++) {
    for (var j = 0; j < drawSize; j++) {

      terrain[mouseYInGridShifted+i][mouseXInGridShifted+j] += drawStrength/(Math.sqrt(1+((drawSize-1)/2-i)**2+((drawSize-1)/2-j)**2));
      drawSquare(mouseYInGridShifted+i, mouseXInGridShifted+j, terrain[mouseYInGridShifted+i][mouseXInGridShifted+j]);
    }
  }
}

//
