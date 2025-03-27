
var c = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

const tau = 2*Math.PI;

// Variables
var gridSize = 50;
var cycles = 10;
var accuracy = 250;
var frequency = 0;
var frame = 0;

var xPositions = [];
var yPositions = [];

for (var i = 0; i < cycles*accuracy; i++) {
  xPositions.push(i/accuracy);
  yPositions.push(Math.cos(xPositions[i]*tau)-Math.cos(2*xPositions[i]*tau)+2);
}


// Background
c.lineJoin = "bevel";
c.fillStyle = "rgb(20, 20, 30)";
c.beginPath();
c.fillRect(0, 0, width, height);

// Grid
c.lineWidth = 1;
c.strokeStyle = "rgb(100, 100, 100)";
c.beginPath();
// Vertical gridlines
for (var i = 0; i < Math.ceil(width/gridSize); i++) {
  c.moveTo(i*(gridSize), 0);
  c.lineTo(i*(gridSize), height);
}
// Horizontal gridlines
for (var i = 0; i < Math.ceil(height/gridSize); i++) {
  c.moveTo(0, i*(gridSize));
  c.lineTo(width, i*(gridSize));
}
c.stroke();

// Lines to seperate the things & grid at the circle
c.lineWidth = 5;
c.strokeStyle = "rgb(150, 150, 150)";
c.beginPath();
c.moveTo(0, 250); c.lineTo(width, 250);
c.moveTo(500, 250); c.lineTo(500, height);
c.stroke();

// The cosine graph
c.lineWidth = 3;
c.strokeStyle = "rgb(200, 200, 200)";
c.beginPath();
c.moveTo(0, (yPositions[0])*gridSize);
for (var i = 0; i < xPositions.length; i++) {
  c.lineTo(tau*gridSize*xPositions[i], gridSize*(-yPositions[i]/1.5) + 4*gridSize);
}
c.stroke();
// Points on the cosine graph
c.fillStyle = "rgb(250, 250, 250)";
for (var i = 0; i < xPositions.length; i++) {
  c.beginPath();
  c.arc(tau*gridSize*xPositions[i], gridSize*(-yPositions[i]/1.5) + 4*gridSize, 2, 0, tau);
  c.fill();
}

function draw() {
  // --- Draws the animated stuff ---
  // Background
  c.fillStyle = "rgb(20, 20, 30)";
  c.beginPath();
  c.fillRect(5, 255, 490, 490);

  var t1 = 225; // Variable thing 1
  c.strokeStyle = "rgb(100, 100, 100)";
  c.beginPath();
  c.moveTo(250-t1, 500); c.lineTo(250+t1, 500);
  c.moveTo(250, 500-t1); c.lineTo(250, 500+t1);
  c.stroke();


  // Draws the wound-up graph
  c.lineWidth = 3;
  c.strokeStyle = "rgb(200, 200, 200)";
  c.beginPath();
  c.moveTo(250, 500);
  var t2 = 50;
  for (var i = 0; i < xPositions.length; i++) {
    c.lineTo(
      250 + yPositions[i]*t2*Math.cos(xPositions[i]*frequency*tau),
      500 + yPositions[i]*t2*Math.sin(xPositions[i]*frequency*tau),
    );
  }
  c.stroke();

  /*
  // Points on the wound-up graph
  c.fillStyle = "rgb(255, 255, 255)";
  c.beginPath();
  c.moveTo(250, 500);
  for (var i = 0; i < xPositions.length; i++) {
    c.beginPath();
    c.arc(
      250 + yPositions[i]*t2*Math.cos(frequency*xPositions[i]*tau),
      500 + yPositions[i]*t2*Math.sin(frequency*xPositions[i]*tau),
      2, 0, tau
    );
    c.fill();
  }
  */

  // Converts the wound-up points from polar to rectangular coordinates
  var xRect = [];
  var yRect = [];
  var xRectSum = 0;
  var yRectSum = 0;

  for (var i = 0; i < xPositions.length; i++) {
    xRect[i] = 250 + yPositions[i]*t2*Math.cos(frequency*xPositions[i]*tau);
    yRect[i] = 500 + yPositions[i]*t2*Math.sin(frequency*xPositions[i]*tau);
    xRectSum += xRect[i];
    yRectSum += yRect[i];
  }

  // Finds the center of mass
  var centerOfMass = {
    x: xRectSum/xPositions.length,
    y: yRectSum/xPositions.length,
  }

  // Draws the center of mass
  c.lineWidth = 4;
  c.strokeStyle = "rgb(250, 50, 50)";
  c.fillStyle = "rgb(200, 0, 0)";
  c.beginPath();
  c.arc(centerOfMass.x, centerOfMass.y, 8, 0, tau);
  c.stroke();
  c.fill();

  c.lineWidth = 4;
  c.beginPath()
  c.arc(550+frequency*gridSize, 1000-2*centerOfMass.x, 1, 0, tau); // graphs the centerOfMass's x-position by the frequency
  c.stroke();
  c.fill();

  frequency = 0.001*frame;
  frame += 1;
}

var drawing = setInterval(function() {
  draw();
}, 1000/60);

document.addEventListener("keypress", keyPress);

function keyPress(event) {
  if (event.keyCode == 13) {
    clearInterval(drawing);
  }
}
