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
  update();
}

function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
  return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}

function dist(x1, y1, x2, y2) {
  return (Math.sqrt((x1 - x2)**2 + (y1 - y2)**2));
}

var distBetweenPoints = 50;
var points = [];

function tryToAddAnotherPoint() {
  // x and y for the new point
  var newX = (Width+100)*Math.random()-50;
  var newY = (Height+100)*Math.random()-50;

  // Checks for points in proximity
  var withinDistance = false;
  for (var i = 0; i < points.length; i++) {
    if (dist(newX, newY, points[i].x, points[i].y) < distBetweenPoints*(1 + 0.3*Math.random())) {
      withinDistance = true;
    }
  }

  // Adds the point if theres none within proximity
  if (!withinDistance) {
    points.push({
      x: newX,
      y: newY,
    });
  }
}

function drawPoints() {
  for (var i = 0; i < points.length; i++) {
    c.beginPath();
    c.fillStyle = "rgb(0, 100, 200)";
    c.arc(points[i].x, points[i].y, 10, 0, tau);
    c.fill();
  }
}

function drawLine(point1, point2) {
  c.beginPath();
  c.lineWidth = 5;
  c.strokeStyle = "rgb(0, 150, 250)";
  c.moveTo(point1.x, point1.y);
  c.lineTo(point2.x, point2.y);
  c.stroke();
}

for (var i = 0; i < 10000; i++) {
  tryToAddAnotherPoint();
}

function drawLines() {
  for (var i = 0; i < points.length; i++) {
    for (var j = 0; j < points.length; j++) {
      if (dist(points[i].x, points[i].y, points[j].x, points[j].y) < distBetweenPoints*1.75) {
        drawLine(points[i], points[j]);
      }
    }
  }
}

function drawBackground() {
  c.beginPath();
  c.fillStyle = "rgb(255, 255, 255)";
  c.fillRect(0, 0, Width, Height);
}

function update() {
  drawBackground();
  drawLines();
  drawPoints();
}

update();




//
