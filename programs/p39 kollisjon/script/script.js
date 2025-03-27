
var c = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

const tau = 2*Math.PI;

// Variables
//var img = document.getElementById("atom");
var radius = 50;
var circles = Math.floor(0.2*width*height/((tau/2)*radius**2));
var speed = 5;
var volume = 0;
var mouseInfluence = 400;
var colors = [
  purple = {
    r: 200,
    g: 50,
    b: 200,
  },
  cyan = {
    r: 20,
    g: 250,
    b: 200,
  },
  yellow = {
    r: 250,
    g: 200,
    b: 50,
  },
  blue = {
    r: 0,
    g: 0,
    b: 250,
  },
  green = {
    r: 25,
    g: 200,
    b: 25,
  },
  red = {
    r: 250,
    g: 15,
    b: 15,
  },
]

var mouse = {
  x: -200,
  y: 0,
}

var particles = [];

canvas.onmousemove = findMouse;

function findMouse(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

window.onresize = resize;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;
}

function randomColor() {
  var randInt = Math.floor(Math.random()*colors.length);
  return colors[randInt];
}

// copypasta stuff
function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

// more copypasta stuff
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    // Grab angle between the two colliding particles
    const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
    const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}


for (var i = 0; i < circles; i++) {
  var x = Math.random()*(width-2*radius)+radius;
  var y = Math.random()*(height-2*radius)+radius;
  var velocity = {
    x: (Math.random()*2-1)*speed,
    y: (Math.random()*2-1)*speed,
  }
  const mass = 1;
  const color = randomColor();

  if (i !== 0) {
    for (var j = 0; j < particles.length; j++) {
      var distance = Math.sqrt((x - particles[j].x)**2 + (y - particles[j].y)**2);

      if (distance < 2*radius) {
        x = Math.random()*(width-2*radius)+radius;
        y = Math.random()*(height-2*radius)+radius;

        j = -1; // resets the for-loop (-1 since j++ after this line)
      }
    }
  }
  var mouseDist = 1000;
  var particle = {
    x: x,
    y: y,
    velocity : velocity,
    mass: mass,
    color: color,
    mouseDist: mouseDist,
  }
  particles.push(particle);
}


function updateParticles() {
  for (var i = 0; i < particles.length; i++) {
    for (var j = 0; j < particles.length; j++) {
      if (j == i) {
        continue;
      }

      var distance = Math.sqrt((particles[i].x - particles[j].x)**2 + (particles[i].y - particles[j].y)**2);
      if (distance < 2*radius) {
        resolveCollision(particles[i], particles[j]);
      }
    }

    particles[i].mouseDist = Math.sqrt((particles[i].x - mouse.x)**2 + (particles[i].y - mouse.y)**2);

    if (particles[i].x < radius || particles[i].x > width-radius) {
      particles[i].velocity.x *= -1;
    }

    if (particles[i].y < radius || particles[i].y > height-radius) {
      particles[i].velocity.y *= -1;
    }

    particles[i].x += particles[i].velocity.x;
    particles[i].y += particles[i].velocity.y;
  }
}


function draw() {
  // white background
  c.fillStyle = "rgb(255, 255, 255)";
  c.fillRect(0, 0, width, height);

  // Draws the circles
  c.lineWidth = 2;

  for (var i = 0; i < particles.length; i++) {
    c.strokeStyle = "rgb(" + (particles[i].color.r-40) + "," + (particles[i].color.g-40) + "," + (particles[i].color.b-40) + ")";
    c.fillStyle = "rgba(" + (particles[i].color.r) + "," + (particles[i].color.g) + "," + (particles[i].color.b) + "," + Math.max(0.1, (0.8-(particles[i].mouseDist)/mouseInfluence)) + ")";
    c.beginPath();
    c.arc(particles[i].x, particles[i].y, radius, 0, tau);
    c.fill();
    c.stroke();
    c.closePath();/*
    var rotation = Math.random()*tau;
    c.beginPath();
    c.save();
    c.translate(particles[i].x, particles[i].y);
    c.rotate(rotation);
    c.drawImage(img, -radius, -radius, radius*2, radius*2)
    c.restore();
    */
  }
  c.font = "48px Calibri";
  c.fillStyle = "rgba(0, 0, 0, 0.75)";
  c.textAlign = "right";
  c.fillText("volume: " + Math.round(volume), width-30, 50);

}

function updateVolume() {
  // Sums up the alpha values of red and green circles
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].color == green) {
      volume += Math.max(0, (0.8-(particles[i].mouseDist)/mouseInfluence)/2);
    } else if (particles[i].color == red) {
      volume -= Math.max(0, (0.8-(particles[i].mouseDist)/mouseInfluence)/2);
    }
  }

  // Keeps the volume within a range of values
  if (volume < 0) {
    volume = 0;
  } else if (volume > 100) {
    volume = 100;
  }
}

setInterval(function() {
  updateParticles();
  updateVolume();
  draw();
}, 1000/60)
