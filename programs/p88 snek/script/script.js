const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}

var c = get("canvas").getContext("2d");
var c2 = get("canvas2").getContext("2d");
var c3 = get("canvas3").getContext("2d");
var Width = window.innerWidth;
var Height = window.innerHeight;
get("canvas").width = Width;
get("canvas").height = Height;
get("canvas2").width = Width;
get("canvas2").height = Height;
get("canvas3").width = Width;
get("canvas3").height = Height;
get("canvas").focus();

window.onresize = resize;
function resize() {
  Width = window.innerWidth;
  Height = window.innerHeight;
  get("canvas").width = Width;
  get("canvas").height = Height;
  get("canvas2").width = Width;
  get("canvas2").height = Height;
  get("canvas3").width = Width;
  get("canvas3").height = Height;
  gridWidth = parseInt(Width/gridSize);
  gridHeight = parseInt(Height/gridSize);
  drawBackground();

  for (var i = 0; i < foods.length; i++) {
    foods[i].draw();
  }

  for (var i = 0; i < snek.body.length-1; i++) {
    c.beginPath();
    c.fillStyle = "rgb(200, 200, 200)";
    c.fillRect(snek.body[i].x*gridSize, snek.body[i].y*gridSize, gridSize, gridSize);
  }

  if (snek.ded) {
    c.beginPath();
    c.fillStyle = "rgb(250, 100, 100)";
    c.fillRect(snek.body[0].x*gridSize, snek.body[0].y*gridSize, gridSize, gridSize);
  }

  drawText(snek.points.toString(), 50, 120, 70, "left");
}

function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
  return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}



var pendingMoves = []; // Pervents the player from moving twice in a frame, makes quick turns more predictable

var holdingKey = {
  left: false,
  right: false,
}

// Key event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(event) {
  x = event.keyCode;
  if (x == 37 && holdingKey.left == false) {
    holdingKey.left = true;
    pendingMoves.unshift("left");
  } else if (x == 39 && holdingKey.right == false) {
    holdingKey.right = true;
    pendingMoves.unshift("right");
  } else if (x == 65) {
    if (snek.automatic) {snek.automatic = false} else {snek.automatic = true} // Toggle
  }
}
function keyUp(event) {
  x = event.keyCode;
  if (x == 37) {
    holdingKey.left = false;
  } else if (x == 39) {
    holdingKey.right = false;
  }
}


function drawBackground() {
  c2.fillStyle = "rgb(10, 10, 10)";
  c2.beginPath();
  c2.fillRect(0, 0, Width, Height);
}
function clearGrid() {
  c.beginPath();
  c.clearRect(0, 0, Width, Height);
}

function drawText(text, x, y, size = 70, align = "left") {
  c3.beginPath();
  c3.clearRect(0, 0, Width, Height);
  c3.font = size + "px 'Press Start 2P'";
  c3.fillStyle = "rgb(250, 250, 250)";
  c3.textAlign = "left";
  c3.beginPath();
  c3.fillText(text, x, y);
}

function updateFoods() {
  while (foods.length < numFoods) {
    var newFood = new Food();

    var imgd = c.getImageData(newFood.x*gridSize+1, newFood.y*gridSize+1, 1, 1);
    var pix = imgd.data;
    if (pix[0] == 0 && pix[1] != 240) {
      foods.unshift(newFood);
      foods[0].draw();
    }
  }
}


drawText("test", -100, -100);
drawBackground();


var gridSize = 10;
var gridWidth, gridHeight;
gridWidth = parseInt(Width/gridSize);
gridHeight = parseInt(Height/gridSize);


var map = [];

// Generates empty map
for (var x = 0; x < gridWidth; x++) {
  map[x] = [];
  for (var y = 0; y < gridHeight; y++) {
    map[x][y] = 0;
  }
}


var buffer = 5;

var numFoods = 100;
var foods = [];

function Food() {
  this.x = parseInt(Math.random()*gridWidth),
  this.y = parseInt(Math.random()*gridHeight),
  this.draw = function() {
    c.beginPath();
    c.fillStyle = "rgb(100, 240, 100)";
    c.fillRect(this.x*gridSize, this.y*gridSize, gridSize, gridSize);
  }
}

for (var i = 0; i < numFoods; i++) {
  var newFood = new Food();
}



var snek = {
  body: [],
  automatic: false,
  direction: 0,
  speed: 10,
  length: 10,
  points: 0,
  ded: false,
  draw: function() {

    if (!this.ded) {
      // Draws the head
      c.beginPath();
      c.fillStyle = "rgb(200, 200, 200)";
      c.fillRect(this.body[0].x*gridSize, this.body[0].y*gridSize, gridSize, gridSize);

      // Erases the last part of the snek body
      if (frame >= snek.length) {
        c.clearRect(this.body[this.body.length-1].x*gridSize, this.body[this.body.length-1].y*gridSize, gridSize, gridSize);
      }
    }

  },
  update() {

    // Removes the last part of the snek body
    if (this.body.length > this.length) {
      this.body.splice(this.body.length-1, 1);
    }

    if (pendingMoves[0] == "left") {
      snek.direction++
      pendingMoves.shift();
    } else if (pendingMoves[0] == "right") {
      snek.direction--
      pendingMoves.shift();
    }

    // Keeps direction within range {0, 1, 2, 3}
    if (this.direction > 3) {
      this.direction = this.direction%4;
    } else if (this.direction < 0) {
      this.direction += 4;
    }


    // Adds a new "head" depending on direction
    if (this.direction == 0) {
      snek.body.unshift(
        {
          x: this.body[0].x+1,
          y: this.body[0].y,
        }
      );
    } else if (this.direction == 1) {
      snek.body.unshift(
        {
          x: this.body[0].x,
          y: this.body[0].y-1,
        }
      );
    } else if (this.direction == 2) {
      snek.body.unshift(
        {
          x: this.body[0].x-1,
          y: this.body[0].y,
        }
      );
    } else {
      snek.body.unshift(
        {
          x: this.body[0].x,
          y: this.body[0].y+1,
        }
      );
    }

    // Eet food
    for (var i = 0; i < foods.length; i++) {
      if (this.body[0].x == foods[i].x && this.body[0].y == foods[i].y) {
        snek.length++;
        snek.points += 10;
        foods.splice(i, 1);
        updateFoods();
      }
    }

    if (frame > snek.length) {
      for (var i = 1; i < this.body.length; i++) {
        if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
          ded();
        }
      }
    }

    // Infinite plane
    if (this.body[0].x < 0) {this.body[0].x = gridWidth}
    if (this.body[0].y < 0) {this.body[0].y = gridHeight}
    if (this.body[0].x > gridWidth) {this.body[0].x = 0}
    if (this.body[0].y > gridHeight) {this.body[0].y = 0}
  },
  think: function() {
    var foodDistances = [];
    for (var i = 0; i < foods.length; i++) {
      foodDistances[i] = (foods[i].x - this.body[0].x) + (foods[i].y - this.body[0].y);
    }
  },
}

// Spawn snek
snek.body.unshift(
  {
    x: parseInt(gridWidth/2-snek.length+i),
    y: parseInt(gridHeight/2),
  }
);

// Step on snek
function ded() {
  c.beginPath();
  c.fillStyle = "rgb(250, 100, 100)";
  c.fillRect(snek.body[0].x*gridSize, snek.body[0].y*gridSize, gridSize, gridSize);

  snek.ded = true;
  clearInterval(animate);
}
updateFoods();


var frame = 0;
var animate = setInterval(function() {
  // Do stuff

  drawText(snek.points.toString(), 50, 120, 70, "left");
  snek.update();
  snek.draw();
  //snek.think();

  frame++;
}, 1000/snek.speed);








//
