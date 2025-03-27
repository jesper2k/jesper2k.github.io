
var c = document.getElementById("canvas").getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const tau = 2*Math.PI;
var mouseX = 0;
var mouseY = 0;

function drawEye(x, y) {
  var dx = x - mouseX;
  var dy = y - mouseY;
  var radius = Math.sqrt(dx**2 + dy**2);
  var angle = Math.atan(dy/dx);

  if (radius > 25) {
    radius = 25;
  }

  if (dx >= 0) {
    radius *= -1;
  }


  c.strokeStyle = "rgb(0, 0, 0)";
  c.fillStyle = "rgb(255, 255, 255)";
  c.beginPath();
  c.arc(x, y, 50, 0, tau);
  c.stroke();
  c.fill();

  c.fillStyle = "rgba(0, 0, 0, 0.8)";
  c.beginPath();
  c.arc(
    x + radius*Math.cos(angle),
    y + radius*Math.sin(angle),
    20, 0, tau
  );
  c.fill();
};


canvas.onmousemove = draw;

function draw(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

  c.fillStyle = "rgb(255, 255, 255)";
  c.beginPath();
  c.fillRect(0, 0, width, height);

  drawEye(width/2+70, height/2);
  drawEye(width/2-70, height/2);

  drawEye(200+70, height-80);
  drawEye(200-70, height-80);

  drawEye(width-150+70, height-80);
  drawEye(width-150-70, height-80);

  drawEye(400+70, 100);
  drawEye(400-70, 100);

  drawEye(width-70, 300);
  drawEye(width, 300);
};
