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

function colorToRGBA(color, shiftR = 0, shiftG = 0, shiftB = 0, shiftA = 0) {
  return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + "," + (color.a + shiftA) + ")";
}

function drawBackground() {
  c.clearRect(0, 0, Width, Height);
}

var color = {
  r: 255,
  g: 255,
  b: 255,
  a: 0.3,
  update: function() {
    this.r = 128 + 128*Math.sin(frame/100);
    this.g = 128 + 128*Math.sin(frame/100 + tau * 1/3);
    this.b = 128 + 128*Math.sin(frame/100 + tau * 2/3);
  }
}

var wave = {
  num: 4,
  length: 3,
  amplitude: 100,
  percision: 25,
  frequency: 40,
}
waveOffsets = [];
for (var i = 0; i < wave.num; i++) {
  waveOffsets[i] = i*tau/wave.num+2*Math.random();
}

var wavePoints = [];
var waves = [];

function draw() {
  c.beginPath();
  c.clearRect(0, 0, Width, Height);
  for (var j = 0; j < wave.num; j++) {

    c.beginPath();

    grd = c.createLinearGradient(0, Height-400, 0, Height);
    grd.addColorStop(0, colorToRGBA(color));
    grd.addColorStop(1, colorToRGBA(color, 0, 0, 0, -0.2));

    c.fillStyle = grd;

    c.moveTo(0, Height);
    for (i = 0; i < waves[j].length; i++) {
      c.lineTo(waves[j][i].x, waves[j][i].y);
    }
    c.lineTo(Width, Height);
    c.lineTo(0, Height);
    c.fill();
  }
}

function update() {
  color.update();

  for (var j = 0; j < wave.num; j++) {
    waves[j] = [];
    for (var i = 0; i < wave.percision+1; i++) {
      waves[j][i] = {
        x: i*Width/wave.percision,
        y: 400 + 100 * Math.sin(wave.length*i/wave.percision+frame/wave.frequency+waveOffsets[j]),
      }
    }
  }
}

update();

var frame = 0;
function animate() {
  update();
  draw();

  frame++;
  requestAnimationFrame(animate);
}

animate();







//
