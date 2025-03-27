const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}

function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
  return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}

function mult(a, b, c = 1, d = 1) {
  return a*b*c*d;
}
console.log(mult(2, 6, 3, 3));


var c = document.getElementById("canvas").getContext("2d");
var Width = window.innerWidth;
var Height = window.innerHeight;
canvas.width = Width;
canvas.height = Height;

var heightoverwidth = 0.5;

var gridSize = 40;
var gridWidth = parseInt(Width/gridSize);
var gridHeight = parseInt(Height/gridSize);

function drawDotInGrid(x, y) {
  c.beginPath();
  c.fillStyle = "rgb(0, 200, 0)";
  c.fillRect(inGridx(x, y), inGridy(x, y), 5, 5);
}

function drawBackground() {
  c.clearRect(0, 0, Width, Height);
}

function inGridx(x, y) {
  return x*gridSize - y*gridSize;
}
function inGridy(x, y) {
  return Height-gridSize*heightoverwidth*(x+y);
}

var colors = {
  red: {
    r: 200,
    g: 50,
    b: 50,
  },
  green: {
    r: 50,
    g: 200,
    b: 50,
  },
  greener: {
    r: 50,
    g: 150,
    b: 50,
  },
  blue: {
    r: 50,
    g: 100,
    b: 200,
  },
  yellow: {
    r: 250,
    g: 200,
    b: 50,
  },
  orange: {
    r: 250,
    g: 100,
    b: 50,
  },
  purple: {
    r: 150,
    g: 50,
    b: 200,
  },
  cyan: {
    r: 50,
    g: 200,
    b: 200,
  },
  white: {
    r: 200,
    g: 200,
    b: 200,
  },
}

/*
// Draws the dots
for (var y = -20; y < 20; y++) {
  for (var x = 40; x > 0; x--) {
    drawDotInGrid(x, y);
  }
}
*/

function drawSquareInGrid(x, y) {
  c.beginPath();
  c.fillStyle = "rgb(0, 0, 200)";
  c.moveTo(inGridx(x, y), inGridy(x, y));
  c.lineTo(inGridx(x+1, y), inGridy(x+1, y));
  c.lineTo(inGridx(x+1, y+1), inGridy(x+1, y+1));
  c.lineTo(inGridx(x, y+1), inGridy(x, y+1));
  c.lineTo(inGridx(x, y), inGridy(x, y));
  c.fill();
}

function drawCubeInGrid(x, y, h, color, Yoffset = 0) {
  // Front side
  c.translate(0, -Yoffset);
  c.save();
  c.lineJoin = "round";
  c.lineWidth = "2";
  c.fillStyle = colorToRGB(color);
  c.strokeStyle = colorToRGB(color);
  c.beginPath();
  c.lineTo(inGridx(x, y), inGridy(x, y));
  c.translate(0, -h);
  c.lineTo(inGridx(x, y), inGridy(x, y));
  c.lineTo(inGridx(x, y+1), inGridy(x, y+1));
  c.translate(0, h);
  c.lineTo(inGridx(x, y+1), inGridy(x, y+1));
  c.lineTo(inGridx(x, y), inGridy(x, y));
  c.stroke();
  c.fill();

  // Back side
  c.fillStyle = colorToRGB(color, 0.9, 0.9, 0.9, true);
  c.beginPath();
  c.translate(0, -h);
  c.moveTo(inGridx(x, y), inGridy(x, y));
  c.lineTo(inGridx(x+1, y), inGridy(x+1, y));
  c.translate(0, h);
  c.lineTo(inGridx(x+1, y), inGridy(x+1, y));
  c.lineTo(inGridx(x, y), inGridy(x, y));
  c.stroke();
  c.fill();

  // Top
  c.fillStyle = colorToRGB(color, 20, 20, 20);
  c.beginPath();
  c.translate(0, -h);
  c.moveTo(inGridx(x, y), inGridy(x, y));
  c.lineTo(inGridx(x, y+1), inGridy(x, y+1));
  c.lineTo(inGridx(x+1, y+1), inGridy(x+1, y+1));
  c.lineTo(inGridx(x+1, y), inGridy(x+1, y));
  c.lineTo(inGridx(x, y), inGridy(x, y));
  c.stroke();
  c.fill();
  c.restore();
  c.translate(0, Yoffset);
}

drawSquareInGrid(10, 0);


var randomInt1 = Math.random()*10, randomInt2 = Math.random()*10;


var frame = 0;
var speeds = [];
for (var i = 0; i < 100; i++) {
  speeds[i] = Math.random()*10+5;
}

function animate() {
  drawBackground();

  c.save();
  c.translate(-200, 100);
  drawCubeInGrid(13, -3, 150 + Math.sin(frame/speeds[0])*80, colors.green);
  drawCubeInGrid(13, -3, 70 + Math.sin(frame/speeds[8])*30, colors.white, 150 + Math.sin(frame/speeds[0])*80);
  drawCubeInGrid(13, -4, 130 + Math.sin(frame/speeds[1])*50, colors.red);
  drawCubeInGrid(12, 0, 140 + Math.sin(frame/speeds[2])*100, colors.yellow);
  drawCubeInGrid(12, -1, 130 + Math.sin(frame/speeds[3])*70, colors.orange);
  drawCubeInGrid(11, 0, 50 + Math.sin(frame/speeds[4])*30, colors.blue);
  drawCubeInGrid(15, -4, 160 + Math.sin(frame/speeds[5])*130, colors.purple);
  drawCubeInGrid(10, 2, 50 + Math.sin(frame/speeds[6])*40, colors.cyan);
  drawCubeInGrid(11, 0, 50 + Math.sin(frame/speeds[7])*40, colors.greener, 50 + Math.sin(frame/speeds[4])*30);
  c.restore();

  frame++;
  requestAnimationFrame(animate);
}
animate();


//
