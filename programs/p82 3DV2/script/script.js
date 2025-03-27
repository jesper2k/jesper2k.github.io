const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}

var c = document.getElementById("canvas").getContext("2d");
var Width = window.innerWidth;
var Height = window.innerHeight;
canvas.width = Width;
canvas.height = Height;

window.onresize = resize;
function resize() {
  Width = window.innerWidth;
  Height = window.innerHeight;
  canvas.width = Width;
  canvas.height = Height;
  c.fillStyle = "rgb(0, 0, 0)";
  c.fillRect(0, 0, Width, Height);
}


/*
drawRect(3) = ~2000
  c.fillRect(x, y, 3, 3);

circle, stroke = ~700
  c.strokeStyle = "rgb(200, 200, 250)";
  c.beginPath();
  c.arc(x, y, 5, 0, tau);
  c.stroke();

glow + perspective = ~700
  var stuff = 15/(z+shift);
  var grd = c.createRadialGradient(x, y, 0, x, y, stuff);
  grd.addColorStop(0, "rgb(130, 255, 160," + 0.5/(z+shift) + ")");
  grd.addColorStop(0.1, "rgb(130, 255, 160," + 0.1/(z+shift) + ")");
  grd.addColorStop(1, "rgb(130, 255, 160, 0)");
  c.fillStyle = grd;

  c.beginPath();
  c.fillRect(x-stuff, y-stuff, 2*stuff, 2*stuff);
  c.fill();


*/


var zoom = 300;
var brightness = 10;
var shift = 1;

var points = [];

// Point-generation
//Cube:
/*
var numPointsLength = 7;
  for (var x = 0; x <= (numPointsLength-1); x++) {
    for (var y = 0; y <= (numPointsLength-1); y++) {
      for (var z = 0; z <= (numPointsLength-1); z++) {
        points.push({
          x: -1 + 2/(numPointsLength-1)*x,
          y: -1 + 2/(numPointsLength-1)*y,
          z: -1 + 2/(numPointsLength-1)*z
        });
      }
    }
  }
*/

//sine-terrain:

var step = 0.1;

for (var x = -2; x <= 2; x += step) {
  for (var y = -2; y <= 2; y += step) {
    points.push({
      x: x,
      y: y,
      z: 0.4*Math.sin(x*y*2),
    });
  }
}

/*
// Random:
for (var x = -1; x <= 1; x += step) {
  for (var y = -1; y <= 1; y += step) {
    points.push({
      x: (Math.random()-0.5)*2,
      y: (Math.random()-0.5)*2,
      z: (Math.random()-0.5)*2,
    });
  }
}
*/


//Circle:
/*
var step = 0.1;
  for (var x = -2; x <= 2; x += step) {
    for (var y = -2; y <= 2; y += step) {
      if (1-x**2-y**2 >= 0) {
        points.push({
          x: x,
          y: y,
          z: Math.sqrt(1-x**2-y**2),
        });
        points.push({
          x: x,
          y: y,
          z: -Math.sqrt(1-x**2-y**2),
        });
      }
    }
  }
*/
var holdingKey = {
  w: false,
  a: false,
  s: false,
  d: false,
}

// Key event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(event) {
  x = event.keyCode;
  if (x == 87 && holdingKey.w == false) {
    holdingKey.w = true;
  } else if (x == 65 && holdingKey.a == false) {
    holdingKey.a = true;
  } else if (x == 83 && holdingKey.s == false) {
    holdingKey.s = true;
  } else if (x == 68 && holdingKey.d == false) {
    holdingKey.d = true;
  }
}
function keyUp(event) {
  x = event.keyCode;
  if (x == 87) {
    holdingKey.w = false;
  } else if (x == 65) {
    holdingKey.a = false;
  } else if (x == 83) {
    holdingKey.s = false;
  } else if (x == 68) {
    holdingKey.d = false;
  }
}

function rotateX(point, angle) {
  return {
    x: point.x,
    y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
    z: point.y * Math.sin(angle) + point.z * Math.cos(angle),
  }
}
function rotateY(point, angle) {
  return {
    x: point.x * Math.cos(angle) - point.z * Math.sin(angle),
    y: point.y,
    z: point.x * Math.sin(angle) + point.z * Math.cos(angle),
  }
}
function rotateZ(point, angle) {
  return {
    x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
    z: point.z,
  }
}

var thetaX = 0, thetaY = 0, thetaZ = 0;
function project(point) {
  var x = rotateZ(rotateY(rotateX(point, thetaX), thetaY), thetaZ).x;
  var y = rotateZ(rotateY(rotateX(point, thetaX), thetaY), thetaZ).y;
  var z = rotateZ(rotateY(rotateX(point, thetaX), thetaY), thetaZ).z;

  if (z+shift > 0) {
    drawPoint(zoom*x/(z+shift), zoom*y/(z+shift), z);
  }
}


function drawPoint(x, y, z) {
  var stuff = 15/(z+shift);
  var grd = c.createRadialGradient(x, y, 0, x, y, stuff);
  grd.addColorStop(0, "rgb(130, 255, 160," + 0.5/(z+shift) + ")");
  grd.addColorStop(0.1, "rgb(130, 255, 160," + 0.1/(z+shift) + ")");
  grd.addColorStop(1, "rgb(130, 255, 160, 0)");
  c.fillStyle = grd;

  c.beginPath();
  c.fillRect(x-stuff, y-stuff, 2*stuff, 2*stuff);
  c.fill();
}


c.fillStyle = "rgb(0, 0, 0)";
c.fillRect(0, 0, Width, Height);

function render() {
  c.save();
  c.translate(parseInt(Width/2), parseInt(Height/2));

  c.fillStyle = "rgb(130, 255, 160)";
  for (var i = 0; i < points.length; i++) {
    project(points[i]);
  }

  c.restore();
}

var counterRadius = 150;
function drawFpsCounter(fps) {
  c.save();
  c.translate(Width-150, 150);
  c.rotate(-tau/4);
  c.beginPath();
  c.fillStyle = "rgb(100, 100, 100)";
  c.arc(0, 0, counterRadius-50, fps*tau/60, (fps+1)*tau/60);
  c.arc(0, 0, counterRadius-80, (fps+1)*tau/60, fps*tau/60, true);
  c.fill();
  c.restore();
}
function drawTimeWheel() {
  var d = new Date();
  var ms = d.getMilliseconds();
  c.save();
  c.translate(Width-150, 150);
  c.rotate(-tau/4);
  c.beginPath();
  c.fillStyle = "rgb(100, 100, 130)";
  c.arc(0, 0, counterRadius-90, tau*(ms/1000), tau*((ms+16.6)/1000));
  c.arc(0, 0, counterRadius-120, tau*((ms+16.6)/1000), tau*(ms/1000), true);
  c.fill();
  c.restore();
}

var delay = 0;
var lagSum = 0;
function drawDelay() {
  var prevDelay = delay;

  var frameTime = (frame/60)%1;
  var d = new Date();
  var actualTime = d.getMilliseconds()/1000;
  delay = frameTime - actualTime;
  if (delay < 0) {
    delay++;
  }
  var delayDiff = parseFloat(Math.abs(prevDelay - delay).toFixed(3));
  lagSum = Math.min(Math.max(0, lagSum + delayDiff - 0.01), 0.2);

  c.beginPath();
  if (delayDiff < 0.004) {
    c.fillStyle = "rgb(50, 255, 50, 0.6)";
  } else if (delayDiff < 0.1) {
    c.fillStyle = "rgb(170, 170, 50, 0.6)";
  } else {
    c.fillStyle = "rgb(255, 50, 50, 0.6)";
  }
  c.arc(Width-150, 150, 20, 0, tau);
  c.fill();
}

var d = new Date();
var ms = d.getMilliseconds();
var frame = ms/1000*60;

var rotationSpeed = 0.02;

function animate() {
  c.fillStyle = "rgb(0, 0, 0)";
  c.fillRect(0, 0, Width, Height);

  if (holdingKey.w) {
    thetaX += rotationSpeed;
  }

  if (holdingKey.a) {
    thetaY += rotationSpeed;
  }

  if (holdingKey.s) {
    thetaX -= rotationSpeed;
  }

  if (holdingKey.d) {
    thetaY -= rotationSpeed;
  }

  render();
  /*
  thetaX += 0.0125;
  thetaY += 0.01;
  thetaZ += 0.01;
  */

  /*drawFpsCounter(frame%60);
  drawTimeWheel();
  drawDelay();*/
  frame++;

  requestAnimationFrame(animate);
}
animate();

/*var running = setInterval(function() {
  render();
  thetaX += 0.01;
  thetaY += 0.01;
  thetaZ += 0.01;

  drawFpsCounter(frame%60);
  frame++;
}, 17);*/







//
