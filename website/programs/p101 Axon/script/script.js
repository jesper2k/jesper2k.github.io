
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
}

function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
  return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}

function drawBackground() {
  c.clearRect(0, 0, Width, Height);
}

get("canvas").addEventListener("click", move);

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}

function move(event) {
  var x = event.clientX;
  var y = event.clientY;

  var axonId = null;
  var length = 50;
  for (var i = 0; i < axons.length; i++) {
    var currentDist = dist(axons[i].x, axons[i].y, x, y)
    if (currentDist < length) {
      length = currentDist;
      axonId = i;
    }
  }

  if (axonId != null) {
    if (dist(axons[player.atAxon].x, axons[player.atAxon].y, axons[axonId].x, axons[axonId].y) < player.radius && axonId != player.atAxon) {
      player.atAxon = axonId;
      player.radius = player.maxRadius;
    }
  }
}

var player = {
  atAxon: 0,
  maxRadius: 200,
  radius: 200,
  shrinkSpeed: 1,
  update: function() {
    if (this.radius > 15) {
      this.radius -= 100*this.shrinkSpeed/this.radius;
    } else {
      this.radius = 15;
    }
  },
  drawSelf: function() { // Draws player "cell"
    c.beginPath();
    c.lineWidth = 2;
    c.strokeStyle = "rgb(0, 0, 0)";
    c.fillStyle = "rgb(50, 200, 50, 0.8)";
    c.arc(axons[this.atAxon].x, axons[this.atAxon].y, 15, 0, tau);
    c.fill();
    c.stroke();
  },
  drawRadius: function() {
    c.beginPath();
    c.lineWidth = 4;
    var grd = c.createRadialGradient(axons[this.atAxon].x, axons[this.atAxon].y, 0, axons[this.atAxon].x, axons[this.atAxon].y, this.radius);
    grd.addColorStop(1, "rgb(0, 0, 0, 0.3)");
    grd.addColorStop(0.8, "rgb(0, 0, 0, 0.18)");
    grd.addColorStop(0.7, "rgb(0, 0, 0, 0.15)");
    grd.addColorStop(0.0, "rgb(0, 0, 0, 0.0)");
    c.strokeStyle = "rgb(100, 100, 100, 0.7)";
    c.arc(axons[this.atAxon].x, axons[this.atAxon].y, this.radius, 0, tau);
    c.stroke();
    c.fillStyle = grd;
    c.fill();
  }
}

function Axon(id) {
  this.x = Width*Math.random();
  this.y = Height*Math.random();

  if (id == 0) {
    this.x = Width/2;
    this.y = Height/2;
  }

  this.radius = 5;
  this.draw = function() {
    c.beginPath();
    c.fillStyle = "rgb(50, 50, 50)";
    c.arc(this.x, this.y, this.radius, 0, tau);
    c.fill();
  }
}

var axons = [];
var numAxons = 50;
var distBetweenPoints = 50;

for (var i = 0; i < numAxons; i++) {
  axons.push(new Axon(i));
}

function update() {
  drawBackground();

  for (var i = 0; i < axons.length; i++) {
    axons[i].draw();
  }
  player.update();
  player.drawRadius();
  player.drawSelf();
}



var frame = 0;
function animate() {
  update();

  // Do stuff

  frame++;
  requestAnimationFrame(animate);
}

animate();







//
