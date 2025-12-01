const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}

var gui = get("canvasGUI").getContext("2d");
var c = get("canvas").getContext("2d");
var Width = window.innerWidth;
var Height = window.innerHeight;
get("canvasGUI").width = Width;
get("canvasGUI").height = Height;
get("canvas").width = Width;
get("canvas").height = Height;

window.onresize = resize;
function resize() {
  Width = window.innerWidth;
  Height = window.innerHeight;
  get("canvasGUI").width = Width;
  get("canvasGUI").height = Height;
  get("canvas").width = Width;
  get("canvas").height = Height;

  c.scale(1, -1);
  c.translate(Width/2, -Height/2);
}

c.scale(1, -1);
c.translate(Width/2, -Height/2);


function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
  return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}


var objects = [
  {
    name: "Purple circle",
    scaleExp: 1,
    draw: function() {
      c.beginPath();
      c.fillStyle = "rgb(200, 100, 250)";
      c.arc(-10, -10, 15, 0, tau);
      c.fill();
    }
  },{
    name: "Blue square",
    scaleExp: 0,
    draw: function() {
      c.beginPath();
      c.fillStyle = "rgb(100, 200, 250)";
      c.fillRect(20, 20, 50, 50);
    }
  },{
    name: "Green triangle",
    scaleExp: -3,
    draw: function() {
      c.beginPath();
      c.fillStyle = "rgb(100, 250, 150)";
      c.moveTo(10, -10);
      c.lineTo(30, -10);
      c.lineTo(20, 10);
      c.lineTo(10, -10);
      c.fill();
    }
  },{
    name: "Yellow circle",
    scaleExp: 4.5,
    draw: function() {
      c.beginPath();
      c.fillStyle = "rgb(250, 250, 100)";
      c.arc(-20, 20, 25, 0, tau);
      c.fill();
    }
  },{
    name: "Smol bric",
    scaleExp: -7,
    draw: function() {
      c.beginPath();
      c.fillStyle = "rgb(250, 200, 100)";
      c.fillRect(5, 5, 50, 30);
    }
  }
];


var scaleCircles = {
  range: [-10, 10],
  interval: 1,
}

for (var i = scaleCircles.range[0]; i < scaleCircles.range[1]; i += scaleCircles.interval) {
  objects.push({
    name: "scaleCircle" + i,
    scaleExp: i,
    draw: function() {
      // Transparent ring
      c.beginPath();
      c.fillStyle = "rgb(150, 150, 150, 0.2)";
      c.arc(0, 0, 100, 0, tau);
      c.arc(0, 0, 90, tau, 0, true);
      c.fill();

      // Text
      c.save();
      c.scale(1, -1);
      c.beginPath();
      c.textAlign = "center";
      c.font = "40px Calibri";
      c.fillText((10**this.scaleExp.toString()).toFixed(Math.max(0, -parseInt(this.scaleExp))), 0, -110);
      c.restore();
    }
  });
}



addEventListener("wheel", scroll);

function scroll(event) {
  if(event.deltaY < 0) {
    scaleExp += zoomSpeed*2;
  } else {
    scaleExp -= zoomSpeed*2;
  }
}




var keysDown = {
  in: false,
  out: false,
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(event) {
  x = event.keyCode;
  if (x == 38) {
    if (keysDown.out) {
      keysDown.out = "blocked";
    }
    keysDown.in = true;
  } else if (x == 40) {
    if (keysDown.in) {
      keysDown.in = "blocked";
    }
    keysDown.out = true;
  }
}
function keyUp(event) {
  x = event.keyCode;
  if (x == 38) {
    if (keysDown.out == "blocked") {
      keysDown.out = true;
    }
    keysDown.in = false;
  } else if (x == 40) {
    if (keysDown.in == "blocked") {
      keysDown.in = true;
    }
    keysDown.out = false;
  }
}


var zoomSpeed = 0.05;

var scaleExp = 0;
var dScaleExp = 0; // Diaplyed scaleExp (adds smoothing effect)
var scale = 1;
var dScale = 1

function update() {

  if (keysDown.in == true) {
    scaleExp += zoomSpeed;
  } else if (keysDown.out == true) {
    scaleExp -= zoomSpeed;
  }

  scale = 10**scaleExp;

  dScaleExp += 0.1 * (scaleExp - dScaleExp);
  dScale = 10**dScaleExp;

  draw();
  drawGUI();
}

function drawGUI() {
  gui.clearRect(0, 0, Width, Height);

  // "Scale:" text
  gui.beginPath();
  gui.fillStyle = "rgb(250, 250, 250)";
  gui.font = "30px Calibri";
  gui.textAlign = "left";
  gui.fillText("Scale:  1 : 10", 40, 60);
  gui.font = "20px Calibri";
  gui.fillText(-dScaleExp.toFixed(1), 192, 48);

  // ScaleExp bar frame
  gui.beginPath();
  gui.fillStyle = "rgb(255, 255, 255, 0.5)";
  gui.arc(50, Height-50, 30, tau/4, 3*tau/4);
  gui.lineTo(Width-50, Height-80);
  gui.arc(Width-50, Height-50, 30, 3*tau/4, 5*tau/4);
  gui.lineTo(50, Height-20);

  gui.moveTo(50, Height-40);
  gui.lineTo(Width-50, Height-40);
  gui.arc(Width-50, Height-50, 30, 5*tau/4, 3*tau/4, true);

  gui.fill();
}

function draw() {
  c.beginPath();
  c.fillStyle = "rgb(20, 20, 20)";
  c.fillRect(-Width/2, -Height/2, Width, Height);

  // Draw objects
  for (var i = 0; i < objects.length; i++) {
    if (Math.abs(dScaleExp + objects[i].scaleExp) < 2) {
      c.save();
      c.scale(10**(objects[i].scaleExp)*dScale, 10**(objects[i].scaleExp)*dScale);
      objects[i].draw();
      c.restore();
    }
  }
}





var frame = 0;

function animate() {
  update();


  frame++;
  requestAnimationFrame(animate);
}

animate();







//
