
var c = document.getElementById("canvas").getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const tau = 2*Math.PI;

var frame = 0;

// planet variables
var planet = {
  mass: 0.1,
  radius: "null",
}
planet.radius = 100*(planet.mass)**(1/3);


function drawSattelite(x, y) {
  var img = document.getElementById("sat");
  c.save();
  c.translate(x, y)
  c.rotate(frame*-tau/30);
  c.drawImage(img, -35, -25, 70, 50);
  c.restore();
}

function drawEarth(x, y) {
  var img = document.getElementById("erf");
  c.save();
  c.translate(x, y);
  c.rotate(frame*tau/210);
  c.drawImage(img, -100, -100, 200, 200);
  c.restore();
}

function drawUniverse() {
  var img = document.getElementById("u9vrs");
  c.drawImage(img, 0, 0, width, height);
}


// The animation
function draw() {
  drawUniverse();

  // Draws the planet
  drawEarth(width/2, height/2);

  // Draws the sattelite
  drawSattelite(width/2 + 300*Math.cos(-frame/100), height/2 + 300*Math.sin(-frame/100));

  frame++;
}

setInterval(function() {
  draw();
}, 1000/60);
