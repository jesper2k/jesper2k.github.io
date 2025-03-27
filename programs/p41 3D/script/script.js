
/*

to do:

function to turn xyz coordinates to screen coordinates
display faces from longest away to closest
"camera" rotation

*/


var c = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

function resizeCanvas() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}

const tau = 2*Math.PI;

var frame = 0;
var zoom = 0;
var vertexDotSize = 5;

var xShift = 0;
var yShift = 0;
var rightDown = false;
var leftDown = false;
var upDown = false;
var downDown = false;
var inDown = false;
var outDown = false;


var vertices = []
var triangles = []


addEventListener("keydown", keyDown);
addEventListener("keyup", keyUp);

function keyDown(event) {
  if (event.keyCode == 68) {rightDown = true;}
  if (event.keyCode == 65) {leftDown  = true;}
  if (event.keyCode == 87) {upDown    = true;}
  if (event.keyCode == 83) {downDown  = true;}
  if (event.keyCode == 76) {inDown    = true;}
  if (event.keyCode == 75) {outDown   = true;}
}

function keyUp() {
  if (event.keyCode == 68) {rightDown = false;}
  if (event.keyCode == 65) {leftDown  = false;}
  if (event.keyCode == 87) {upDown    = false;}
  if (event.keyCode == 83) {downDown  = false;}
  if (event.keyCode == 76) {inDown    = false;}
  if (event.keyCode == 75) {outDown   = false;}
}

// Defines the vertex as a point
function defineVertex(i, x, y, z) {
  if (z-zoom > 0) {
    vertices[i] = [x-xShift, y-yShift, z-zoom];
  } else {
    //console.log("invalid z-value");
  }
}

function defineTriangle(i, a, b, c) {
  triangles[i] = [a, b, c];
}

// Draws the vertex as a dot
function drawVertex(i) {
  c.beginPath();
  c.save();
  c.strokeStyle = "rgba(0, 0, 0, 1)";
  c.fillStyle = "rgba(255, 50, 50, 0.7)";
  c.arc(
    width/2 +  vertices[i][0]/vertices[i][2],
    height/2 + vertices[i][1]/vertices[i][2],
    vertexDotSize*1/vertices[i][2], 0, tau);
  c.fill();
  c.restore();
}

function drawTriangle(i) {
  c.beginPath();
  c.save();
  c.lineJoin = "round";
  c.fillStyle = "rgb(200, 255, 100, 0.4)";
  c.strokeStyle = "rgb(0, 0, 0)";
  var avgZ = vertices[triangles[i][2]][2];
  if (avgZ > 10) {
    avgZ = 10;
  } else if (avgZ < 1/10) {
    avgZ = 1/10;
  }
  c.lineWidth = 1/(avgZ)*5;
  c.moveTo(width/2 + vertices[triangles[i][0]][0]/vertices[triangles[i][0]][2], height/2 + vertices[triangles[i][0]][1]/vertices[triangles[i][0]][2]);
  c.lineTo(width/2 + vertices[triangles[i][1]][0]/vertices[triangles[i][1]][2], height/2 + vertices[triangles[i][1]][1]/vertices[triangles[i][1]][2]);
  c.lineTo(width/2 + vertices[triangles[i][2]][0]/vertices[triangles[i][2]][2], height/2 + vertices[triangles[i][2]][1]/vertices[triangles[i][2]][2]);
  c.lineTo(width/2 + vertices[triangles[i][0]][0]/vertices[triangles[i][0]][2], height/2 + vertices[triangles[i][0]][1]/vertices[triangles[i][0]][2]);
  c.fill();
  c.stroke();
}

function draw() {
  c.fillStyle = "rgb(40, 50, 60)";
  c.fillRect(0, 0, width, height);

  for (var i = 0; i < triangles.length; i++) {
    drawTriangle(i);
  }

  for (var i = 0; i < vertices.length; i++) {
    drawVertex(i);
  }
}


defineTriangle(4, 4, 5, 6);
defineTriangle(5, 4, 6, 7);

defineTriangle(0, 1, 2, 3);
defineTriangle(1, 0, 2, 3);
defineTriangle(2, 0, 1, 2);
defineTriangle(3, 0, 1, 3);

setInterval(function() {

  if (rightDown || leftDown || downDown || upDown || inDown || outDown || frame == 0) {
    resizeCanvas();
    if (rightDown) {xShift += 10;}
    if (leftDown)  {xShift -= 10;}
    if (upDown)    {yShift -= 10;}
    if (downDown)  {yShift += 10;}
    if (inDown)  {zoom -= 0.05;}
    if (outDown) {zoom += 0.05;}

    // square
    defineVertex(4, -40, -40, 3.3);
    defineVertex(5, -40, -120, 3.0);
    defineVertex(6, -120, -120, 3.1);
    defineVertex(7, -120, -40, 3.2);

    // tetrahedron
    defineVertex(0, 100, 100, 1);
    defineVertex(1, 20, 30, 1.4);
    defineVertex(2, 180, 30, 1.4);
    defineVertex(3, 100, 200, 1.4);

    draw();

    frame++;
  }
}, 1000/58);
