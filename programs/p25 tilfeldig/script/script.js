
var c = document.getElementById("canvas").getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;

//var difficulty = 10;
var size = 5;
var colorChange = 5;
var speed = 10000;

var x = width/(2);
var y = height/(2);
var iterations = 0;
var a = 0.2; //1/difficulty

var color;
var r, g, b;
var key;

function newColor() {
  r = parseInt(Math.random()*200);
  g = parseInt(Math.random()*200);
  b = parseInt(Math.random()*200);
  color = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  console.log(color);
}

function draw() {
  // Draws a square
  c.beginPath();
  c.rect(x, y, size, size);
  c.fillStyle = color
  c.fill();
}

function walk() {
  var random = Math.random()*100;

  if (random < 25) {
    x += size;
  } else if (random < 50) {
    y += size;
  } else if (random < 75) {
    x -= size;
  } else {
    y -= size;
  }

  if (random < 1/3*100) {
    r += colorChange;
    g -= colorChange;
  } else if (random < 2/3*100) {
    g += colorChange
    b -= colorChange;
  } else {
    b += colorChange;
    r -= colorChange;
  }

  if (r > 255) {
    r = 255;
  } else if (g > 255) {
    g = 255;
  } else if (b > 255) {
    b = 255;
  }

  if (r < 50) {
    r = 50;
  } else if (g < 50) {
    g = 50;
  } else if (b < 50) {
    b = 50;
  }

  color = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";

  if (x > width || x < 0 || y > height || y < 0) {
    x = width/(2);
    y = height/(2);
    //newColor();
  }

  iterations++;
}

function darkBackround() {
  c.beginPath();
  c.rect(0, 0, width, height);
  c.fillStyle = "rgb(25, 25, 50)";
  c.fill();
}

document.addEventListener("keypress", keyPressed);

function keyPressed(event) {
  key = event.keyCode;
  if (key == 97) {
    holdingKey[0] = 3;
    console.log("yeet");
  }
}

setInterval(function() {
  if (iterations < 10**6) {
    for (var i = 0; i < speed; i++) {
      draw();
      walk();
    }
  } else {
    draw();
    walk();
  }
}, 10);

newColor();
darkBackround();
