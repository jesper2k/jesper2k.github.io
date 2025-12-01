
const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}

var c = get("canvas").getContext("2d");
var Width = window.innerWidth;
var Height = window.innerHeight;
get("canvas").width = Width;
get("canvas").height = Height;
c.globalCompositeOperation = 'lighter';

window.onresize = resize;
onclick = function() {
  location.reload();
}
c.translate(Width/2, Height/2);

function resize() {
  Width = window.innerWidth;
  Height = window.innerHeight;
  get("canvas").width = Width;
  get("canvas").height = Height;
  c.globalCompositeOperation = 'lighter';
  c.translate(Width/2, Height/2);
}

function colorToRGBA(color, shiftR = 0, shiftG = 0, shiftB = 0, shiftA = 0) {
  return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + "," + (color.a + shiftA) + ")";
}





var keysDown = [false, false, false, false];

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(event) {
  x = event.keyCode;
  console.log(x);
  if (x == 87 && !keysDown[0]) {
    keysDown[0] = true;
  } else if (x == 83 && !keysDown[1]) {
    keysDown[1] = true;
  } else if (x == 65 && !keysDown[2]) {
    keysDown[2] = true;
  } else if (x == 68) {
    keysDown[3] = true;
  }
}
function keyUp(event) {
  x = event.keyCode;
  if (x == 87 && keysDown[0]) {
    keysDown[0] = false;
  } else if (x == 83 && keysDown[1]) {
    keysDown[1] = false;
  } else if (x == 65 && keysDown[2]) {
    keysDown[2] = false;
  } else if (x == 68 && keysDown[3]) {
    keysDown[3] = false;
  }
}


var colors = [{
    r: 150,
    g: 250,
    b: 100,
    a: 0.7,
  },{
    r: 150,
    g: 200,
    b: 250,
    a: 0.8,
  },{
    r: 255,
    g: 110,
    b: 150,
    a: 0.7,
  },
];

var radius = Math.sqrt(Width**2 + Height**2);
var particles = [];

function Particle() {
  // Particle spawn position
  var spawnRadius = radius + 100 + 100*Math.random();
  var spawnAngle = tau*Math.random();

  this.x = spawnRadius * Math.cos(spawnAngle);
  this.y = spawnRadius * Math.sin(spawnAngle);

  var spawnVelocity = 0.4 + 1.6*Math.random();
  var spawnVelocityAngle = tau*Math.random();

  this.vx = spawnVelocity * Math.cos(spawnVelocityAngle);
  this.vy = spawnVelocity * Math.sin(spawnVelocityAngle);

  this.color = colors[parseInt(Math.random()*colors.length)];
  this.rotation = tau*Math.random();
  this.rotationSpeed = 0.1*(Math.random()*2-1);
  if (this.
    color == colors[2]) {
    this.rotationSpeed = (Math.random()*0.1+0.05) * (parseInt(Math.random()*2)*2-1);
  }

  this.update = function() {
    this.x += this.vx + player.vx;
    this.y += this.vy + player.vy;

    this.rotation += this.rotationSpeed;
  }

  this.draw = function(type) {
    if (this.color == colors[0]) {
      c.fillStyle = colorToRGBA(this.color);
      c.beginPath();
      c.arc(this.x, this.y, 15, 0, tau);
      c.fill();
    } else if (this.color == colors[1]) {
      c.fillStyle = colorToRGBA(this.color);
      for (var i = 0; i < 3; i++) {
        c.beginPath();
        c.arc(this.x+20*Math.cos(this.rotation+i/3*tau), this.y+20*Math.sin(this.rotation+i/3*tau), 20, 0, tau);
        c.fill();
      }
    } else if (this.color == colors[2]) {
      c.fillStyle = colorToRGBA(this.color);
      c.strokeStyle = colorToRGBA(this.color);
      c.lineWidth = 3;
      c.beginPath();
      c.arc(this.x, this.y, 30, 0, tau);
      c.fill();

      c.beginPath();
      c.arc(this.x, this.y, 60, 0, tau);
      c.stroke();

      for (var i = 0; i < 2; i++) {
        c.beginPath();
        c.arc(this.x+60*Math.cos(this.rotation+i/2*tau), this.y+60*Math.sin(this.rotation+i/2*tau), 15, 0, tau);
        c.fill();
      }
    }
  }
}

var player = {
  vx: 0,
  vy: 0,
  update: function() {
    this.vx *= 0.93;
    this.vy *= 0.93;

    if (Math.abs(this.vx) < 0.001) {this.vx = 0;}
    if (Math.abs(this.vy) < 0.001) {this.vy = 0;}

    if (keysDown[0]) {this.vy++;}
    if (keysDown[1]) {this.vy--;}
    if (keysDown[2]) {this.vx++;}
    if (keysDown[3]) {this.vx--;}

  }
}



var numParticles = 100;


var spawnBuffer = 100;
var despawnBuffer = 200;


/*for (var i = 0; i < numParticles; i++) {
  particles.push(new Particle());
}*/

function update() {
  c.clearRect(-5*Width, -5*Height, 10*Width, 10*Height);
  c.fillStyle = "rgb(0, 0, 0, 0.05)";
  c.fillRect(-Width/2, -Height/2, Width, Height);

  player.update();

  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }

  for (var i = 0; i < particles.length; i++) {
    if (Math.sqrt(particles[i].x**2 + particles[i].y**2) > radius + 400) {
      particles.splice(i, 1);
    }
  }

  if (particles.length < numParticles) {
    particles.push(new Particle());
  }
}



var frame = 0;
function animate() {
  update();
  frame++;
  requestAnimationFrame(animate);
}

animate();


/*
todo:

v 0.1:
- simple Particle animation (group, orbit, pulse) based on type
- small "foodlets" to eat
- health bar and nutrition bar:
    Health is replenished slowly over time, only if you eat food (depletes nutrition-bar)
    Nutrition is gained from eating foods, and when filled, you get bigger

v 0.2:
- Spawners for the colors (saved on the map with coords and amount)
- Different types have more speed/multiply faster/have more health

v 0.3:
- You can zoom into yourself and adjust stuff to increase your own abilities,
  also you can see nutritional components move around

v 0.4:
- A dope background


*/
