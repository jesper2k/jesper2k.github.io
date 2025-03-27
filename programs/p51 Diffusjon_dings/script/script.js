
var c = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

const tau = 2*Math.PI;

function mod(n, m) {
  return ((n % m) + m) % m;
}

const gridSize = 10;

const gridWidth = parseInt(width/gridSize)-1;
const gridHeight = parseInt(height/gridSize)-1;

const speed = 100;
const lifeSpan = 500;
var particle = ""; // Moving particle
var particles = [{x: parseInt(gridWidth/2), y: parseInt(gridHeight/2)}]; // Solid particles

// Draws the background once
c.beginPath();
c.fillStyle = "rgb(0, 20, 40)";
c.fillRect(0, 0, width, height);

// Draws the first particle
c.beginPath();
c.fillStyle = "rgba(255, 255, 255, 0.5)";
c.fillRect(particles[0].x*gridSize, particles[0].y*gridSize, gridSize, gridSize);

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.px = x; // previous x and y for easy erasing
  this.py = y;
  this.age = 0;
  this.move = function() {

    this.px = this.x;
    this.py = this.y;

    rand = Math.random()*4;
    if (rand < 1) {this.x++} else
    if (rand < 2) {this.x--} else
    if (rand < 3) {this.y++} else
                  {this.y--}

    this.x = mod(this.x, gridWidth);
    this.y = mod(this.y, gridHeight);


    for (var i = 0; i < particles.length; i++) {
      if (this.x == particles[i].x && this.y == particles[i].y) {
        var position = {
          x: this.px,
          y: this.py,
        }
        particles.push(position);

        this.x = 0;
        this.y = 0;

        // Draws the square
        c.beginPath();
        c.fillStyle = "rgba(255, 255, 255, 0.5)";
        c.fillRect(this.x*gridSize, this.y*gridSize, gridSize, gridSize);

        this.px = this.x;
        this.py = this.y;
      }
    }
  }
  this.draw = function() {
    // Erases the previous square
    c.beginPath();
    c.fillStyle = "rgb(0, 20, 40)";
    c.fillRect(this.px*gridSize, this.py*gridSize, gridSize, gridSize);

    // Draws the square
    c.beginPath();
    c.fillStyle = "rgba(255, 255, 255, 0.5)";
    c.fillRect(this.x*gridSize, this.y*gridSize, gridSize, gridSize);
  }
}


var particle = new Particle(0, 0);

function update() {
  particle.move();
}

function draw() {
  particle.draw();
}


var running = setInterval(function() {
  for (var i = 0; i < speed; i++) {
    update();
    draw();
  }
}, 10);
