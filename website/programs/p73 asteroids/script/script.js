const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}

var c = document.getElementById("canvas").getContext("2d");
var Width = window.innerWidth;
var Height = window.innerHeight;
canvas.width = Width;
canvas.height = Height;

function Asteroid(x, y, sx, sy, mass) {
  this.x = x; this.y = y;
  this.sx = sx; this.sy = sy;
  this.rotation = Math.random();
  this.form = [];
  for (var i = 0; i < 12; i++) {
    this.form[i] = 20+Math.random()*30;
  }
  this.mass = mass;
  this.hit = false;
  this.despawn = false;
  this.update = function() {
    this.x += this.sx;
    this.y += this.sy;

    if (this.x < -50 || this.x > Width + 50 || this.y < -50 || this.y > Height+50) {
      this.despawn = true;
    }
  }
  this.draw = function() {
    c.beginPath();
    c.save();
    c.translate(this.x, this.y);
    c.moveTo(0, -this.form[0]);
    for (var i = 0; i < this.form.length; i++) {
      c.lineTo(Math.cos((i/this.form.length+1)*tau - 1/4*tau)*this.form[i],
               Math.sin((i/this.form.length+1)*tau - 1/4*tau)*this.form[i]);
    }
    c.lineTo(0, -this.form[0]);
    c.strokeStyle = "rgb(255, 255, 255)";
    c.stroke();
    c.restore();
  }
}

var numAsteroids = 100;
var asteroids = [];
/*
for (var i = 0; i < numAsteroids; i++) {
  asteroids[i] = new Asteroid(Math.random()*Width, Math.random()*Height, -1+2*Math.random(), -1+2*Math.random(), parseInt(Math.random()*4+4));
}
*/

var spawningAsteroids = setInterval(function() {
  if (Math.random()*(Width*2+Height*2) > Width*2) {
    asteroids.unshift(new Asteroid(parseInt(Math.random()*2)*(Width+100)-50, Math.random()*Height, -3+6*Math.random(), -3+6*Math.random(), parseInt(Math.random()*4+4)));
  } else {
    asteroids.unshift(new Asteroid(Math.random()*Width, parseInt(Math.random()*2)*(Height+100)-50, -3+6*Math.random(), -3+6*Math.random(), parseInt(Math.random()*4+4)));
  }
}, 50)

function drawBackground() {
  c.beginPath();
  c.fillStyle = "rgb(0, 0, 0)";
  c.fillRect(0, 0, Width, Height);
}


var keysDown = [false, false, false, false]; // Acc, left, right, shoot

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(event) {
  x = event.keyCode;
  //console.log(x);
  if (x == 38 && !keysDown[0]) {
    keysDown[0] = true;
  } else if (x == 37 && !keysDown[1]) {
    keysDown[1] = true;
  } else if (x == 39 && !keysDown[2]) {
    keysDown[2] = true;
  } else if (x == 83) {
    keysDown[3] = true;
  }
}
function keyUp(event) {
  x = event.keyCode;
  if (x == 38 && keysDown[0]) {
    keysDown[0] = false;
  } else if (x == 37 && keysDown[1]) {
    keysDown[1] = false;
  } else if (x == 39 && keysDown[2]) {
    keysDown[2] = false;
  } else if (x == 83 && keysDown[3]) {
    keysDown[3] = false;
  }
}

/*
function click() {
  console.log("ouch!");
}
*/

bulletShootingSpeed = 10;

function Bullet(x, y, sx, sy) {
  this.x = x;
  this.y = y;
  this.sx = sx;
  this.sy = sy;
  this.life = 100;
  this.hit = false;
  this.update = function() {
    this.life--;
    this.x += this.sx;
    this.y += this.sy;

    /*
    if (this.life < 0) {
      this.delete();
    }
    */

    for (var i = 0; i < asteroids.length; i++) {
      if ((asteroids[i].x-this.x)**2 + (asteroids[i].y-this.y)**2 < 45**2) {
        if (this.x > 0 && this.y > 0 && this.x < Width && this.y < Height) {
          this.hit = true;
          player.score++;
          console.log(player.score);
          asteroids.splice(i, 1);

          // Spawns powerups
          if (Math.random() < 0.05 || player.score == 4) {
            spawnPowerup(this.x, this.y, parseInt(Math.random()*2));
          }
        }
      }
    }
  }
  this.draw = function() {
    c.beginPath();
    c.save();
    c.moveTo(this.x, this.y);
    c.lineTo(this.x + this.sx, this.y + this.sy);
    c.strokeStyle = "rgb(255, 255, 255)";
    c.stroke();
  }
}
function updateBullets() {
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].life < 0) {
      bullets.splice(i, 1);
    }
  }
}
function updateAsteroids() {
  for (var i = 0; i < asteroids.length; i++) {
    if (asteroids[i].hit) {
      asteroids.splice(i, 1);
    }
  }
  if (player.godmode) {
    for (var i = 0; i < asteroids.length; i++) {
      if ((asteroids[i].x-player.x)**2 + (asteroids[i].y-player.y)**2 < 200**2) {
        asteroids[i].sx -= (player.x-asteroids[i].x)/100
        asteroids[i].sy -= (player.y-asteroids[i].y)/100
      }
    }
  }
}

function Powerup(x, y) {
  this.x = x;
  this.y = y;
  this.draw = function() {
    // Draw powerup
    var grd = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, 50);
    grd.addColorStop(0, "rgb(250, 230, 160, 1");
    grd.addColorStop(1, "rgb(250, 230, 160, 0");
    c.fillStyle = grd;
    c.fillRect(this.x-50, this.y-50, 100, 100);

  }
}

var powerups = [];
function updatePowerups() {
  for (var i = 0; i < powerups.length; i++) {
    powerups[i].life--;
  }
}

function spawnPowerup(x, y, type) {
  console.log(x, y, type);
  powerups.push(new Powerup(x, y));
}

var bullets = [];

var player = {
  godmode: true,
  score: 0,
  rotateSpeed: 1,
  acceleration: 0.1,
  x: Width/2,
  y: Height/2,
  sx: 0,
  sy: 0,
  rotation: 0,
  update: function() {
    this.x += this.sx;
    this.y += this.sy;

    if (keysDown[0]) {
      this.sx += -Math.cos(this.rotation*tau+1/4*tau)*this.acceleration;
      this.sy += -Math.sin(this.rotation*tau+1/4*tau)*this.acceleration;
    }
    if (keysDown[1]) {
      this.rotation -= this.rotateSpeed/60;
    }
    if (keysDown[2]) {
      this.rotation += this.rotateSpeed/60;
    }

    if (keysDown[3]) {
      if (player.godmode) {
        for (var i = 0; i < 100; i++) {
          player.shoot(-0.5+0.01*i + Math.random()*0.05, 30+5*Math.random());

          this.sx += Math.cos(this.rotation*tau+1/4*tau)*this.acceleration*0.1;
          this.sy += Math.sin(this.rotation*tau+1/4*tau)*this.acceleration*0.1;
        }
      } else {
        player.shoot(-0.05 + Math.random()*0.1, 15+5*Math.random());
        this.sx += Math.cos(this.rotation*tau+1/4*tau)*this.acceleration;
        this.sy += Math.sin(this.rotation*tau+1/4*tau)*this.acceleration;
      }
    }

    if (this.x > Width + 50) {
      this.x = this.x%Width;
      this.x = -40;
    } else if (this.x < -50) {
      this.x = this.x%Width;
      this.x = Width+40;
    }

    if (this.y > Height + 50) {
      this.y = this.y%Height;
      this.y = -40;
    } else if (this.y < -50) {
      this.y = this.y%Height;
      this.y = Height+40;
    }
  },
  draw: function() {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rotation*tau);

    if (keysDown[0]) {
      // Draw fire
      var expand = 1 + 0.1*Math.sin(frame/2.5);

      c.beginPath();
      c.moveTo(12*expand, 10);
      c.lineTo(0, 30*expand + 10);
      c.lineTo(-12*expand, 10);
      c.fillStyle = "rgb(250, 100, 50)";
      c.fill();

      c.beginPath();
      c.moveTo(8*expand, 10);
      c.lineTo(0, 20*expand + 10);
      c.lineTo(-8*expand, 10);
      c.fillStyle = "rgb(250, 200, 50)";
      c.fill();
    }

    // Draw player
    c.beginPath();
    c.moveTo(0, -40);
    c.lineTo(20, 20);
    c.lineTo(0, 10);
    c.lineTo(-20, 20);
    c.lineTo(0, -40);
    c.fillStyle = "rgb(200, 200, 200)";
    c.fill();
    c.strokeStyle = "rgb(255, 255, 255)";
    c.stroke();
    c.restore();
  },
  shoot: function(angle, speed) {
    bullets.unshift(
      new Bullet(
        this.x + Math.cos(player.rotation*tau - 1/4*tau)*40,
        this.y + Math.sin(player.rotation*tau - 1/4*tau)*40,
        this.sx + Math.cos(this.rotation*tau - 1/4*tau + angle)*speed,
        this.sy + Math.sin(this.rotation*tau - 1/4*tau + angle)*speed
      )
    );
  },
}

var frame = 0;
function animate() {
  drawBackground();
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].update();
    asteroids[i].draw();
  }
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].update();
    bullets[i].draw();
  }
  updateBullets();
  updateAsteroids();
  player.update();
  player.draw();

  frame++;
  requestAnimationFrame(animate);
}

animate();
//
