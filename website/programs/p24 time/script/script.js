
var c = document.getElementById("canvas").getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const tau = 2*Math.PI;


/*
TO DO:

- display the date underneath the time
- make everyting work with alpha
- shadow effect
- more and better variables, for the text, color, shadow and other stuff
- make the code shorter and more user friendly
- Make the whole thing scale properly in response to the window dimensions
  (and on window size changes, without requiring a refresh of the page)

*/

// variables
var fps = 60;

// Seconds
var S = {
  length: 0.20,
  radius: 140,
  weight: 40,

  x: 4/5*width,
  y: height/2,

  color: {
    r: 245,
    g: 41,
    b: 37,
  }
}

// Minutes
var M = {
  radius: 140,
  weight: 40,

  x: width/2,
  y: height/2,

  color: {
    r: 73,
    g: 254,
    b: 55,
  }
}

// Hours
var H = {
  radius: 140,
  weight: 40,

  x: 1/5*width,
  y: height/2,

  color: {
    r: 23,
    g: 134,
    b: 212,
  }
}

var text = {
  font: "128px Helvetica",
  r: 25,
  g: 125,
  b: 175,
}

var shadow = {
  r: 0,
  g: 10,
  b: 20,
}

var shadowDepth = 10;
var shadowBool = true;

var textShiftDown = 40;

// time
var frame = 0;
var d;
var milliseconds;
var seconds;
var minutes;


// Updates time (duh)
function updateTime() {
  d = new Date();
  milliseconds = d.getMilliseconds();
  seconds = d.getSeconds();
  minutes = d.getMinutes();
  hours = d.getHours();

  S.start = milliseconds/1000 - 0.20; // -0.2 to make it look better
  M.length = (seconds/60 + milliseconds/60000);
  H.length = (minutes/60 + seconds/3600);
}


// function for drawing curves with smooth edges
function drawCurve(x, y, radius, start, length, thickness, r, g, b) {
  // Draws the main line
  var color = "rgb(" + r + "," + g + "," + b + ")";
  start -= 0.25;
  c.lineWidth = thickness;
  c.beginPath();
  c.arc(x, y, radius, tau*(start), tau*(start+length));
  c.strokeStyle = color;
  c.stroke();
  // Draws the two circles on the ends of the line
  c.beginPath();
  c.arc(x + radius*Math.cos(tau*(start)),        y + radius*Math.sin(tau*(start)),        thickness/2, 0, tau);
  c.arc(x + radius*Math.cos(tau*(start+length)), y + radius*Math.sin(tau*(start+length)), thickness/2, 0, tau);
  c.fillStyle = color;
  c.fill();
}


// Function for drawing the text (adds an extra 0 if the string is 1 character long)
function drawText(text, x, y, size, font, r, g, b) {
  c.font = font;
  c.fillStyle = "rgb(" + r + "," + g + "," + b + ")";;
  c.textAlign = "center";

  if (text < 10) {text = "0" + text}
  c.fillText(text, x, y + textShiftDown);
}


// Does all the drawing stuff
function draw() {
  c.beginPath();
  c.rect(0, 0, width, height);
  c.fillStyle = "#101030";
  c.fill();

  if (shadowBool == true) {
    drawCurve(S.x+shadowDepth, S.y+shadowDepth, S.radius, S.start, S.length, S.weight, shadow.r, shadow.g, shadow.b);
    drawText(seconds, S.x, S.y, text.font, shadow.r, shadow.g, shadow.b);

    // Minutes
    console.log(shadow.r, shadow.g, shadow.b);
    drawCurve(M.x+shadowDepth, M.y+shadowDepth, M.radius, 0, M.length, M.weight, shadow.r, shadow.g, shadow.b);
    drawText(minutes, M.x, M.y, text.font, shadow.r, shadow.g, shadow.b);

    // Hours// Minutes
    drawCurve(H.x+shadowDepth, H.y+shadowDepth, H.radius, 0, H.length, H.weight, shadow.r, shadow.g, shadow.b);
    drawText(hours, H.x, H.y, text.size, text.font, shadow.r, shadow.g, shadow.b);
  }

  // Seconds
  drawCurve(S.x, S.y, S.radius, S.start, S.length, S.weight, S.color.r, S.color.g, S.color.b);
  drawText(seconds, S.x, S.y, text.font, text.color);

  // Minutes
  drawCurve(M.x, M.y, M.radius, 0, M.length, M.weight, M.color.r, M.color.g, M.color.b);
  drawText(minutes, M.x, M.y, text.font, text.color);

  // Hours// Minutes
  drawCurve(H.x, H.y, H.radius, 0, H.length, H.weight, H.color.r, H.color.g, H.color.b);
  drawText(hours, H.x, H.y, text.size, text.font, text.color);

  frame++;
}

setInterval(function() {
  updateTime();
  draw();
}, 1000/fps);
