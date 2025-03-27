
var c = document.getElementById("canvas").getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;
const tau = 2*Math.PI;

var colors = [
  red = {
    r: 250,
    g: 50,
    b: 50,
    a: 1,
  },
  yellow = {
    r: 250,
    g: 250,
    b: 50,
    a: 1,
  },
  blue = {
    r: 50,
    g: 50,
    b: 250,
    a: 1,
  },
  purple = {
    r: 250,
    g: 50,
    b: 250,
    a: 1,
  },
  green = {
    r: 50,
    g: 250,
    b: 50,
    a: 1,
  },
  cyan = {
    r: 50,
    g: 250,
    b: 250,
    a: 1,
  }
];

// variables
var ecc = 0.00; // eccentricity, diagonal view (-0.25 - 0.25)
var flatView = 1.00; // How flattened the background looks (0 is side wiew, infinity is horizon view)

var play,
    generateObstacles,
    movement,
    a = 0,
    frame = 0,
    rowsSpliced = 0;
    currentColorInt = 0,
    fastRotationInt = 0;

var s, cs;
var obstacleRadius;
var playerRow;
var playerTrack;
var addMovement = 1;
var killFrame;
var killBoxShift = -1000;
var timeSurvived;

var color0;
var color1;

// background variables
var game = {
  rotationSpeed: 3,
  obstacleSpeed: 8,
  rotation: 0,
  hexRadius: 100,
  color: 0,
}

var player = {
  radius: game.hexRadius + 20,
  rotation: 300,
  position: 270,
  rotationSpeed: 9,
  currentRotationSpeed: 0,
  moving: "none",
  alive: true,
  leftKeyDown: false,
  rightKeyDown: false,
}

var obstacles = [
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
];

var patterns = [
  [8, // Waiting time before the pattern
  0,1,1,1,1,1],
  [8,
  1,0,1,1,1,1],
  [8,
  1,1,0,1,1,1],
  [8,
  1,1,1,0,1,1],
  [8,
  1,1,1,1,0,1],
  [8,
  1,1,1,1,1,0],

  [8,
  1,0,1,1,1,1,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  1,1,1,1,0,1,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  1,0,1,1,1,1],

  [6,
  0,1,0,1,0,1,
  0,0,0,0,0,0,
  0,1,0,1,0,1,],

  [4,
  0,0,1,0,0,1,
  0,0,0,0,0,0,
  0,0,1,0,0,1,],

  [4,
  0,1,0,1,0,1,],

  [6,
  0,1,1,0,1,1,
  0,1,1,0,1,1,
  0,1,0,0,1,0,
  0,1,0,0,1,0,
  1,0,0,1,0,0,
  1,0,0,1,0,0,
  0,0,1,0,0,1,
  0,0,1,0,0,1,
  0,1,0,0,1,0,
  0,1,0,0,1,0,
  1,0,0,1,0,0,
  1,0,0,1,0,0,
  0,0,1,0,0,1,
  0,0,1,0,0,1,
  0,1,0,0,1,0,
  0,1,0,0,1,0,
  1,0,0,1,0,0,
  1,0,0,1,0,0,
  1,0,1,1,0,1,
  1,0,1,1,0,1,],

  [8,
  1,1,0,1,1,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,1,1,0,1,1,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  1,0,1,1,0,1,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,1,1,0,1,1,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  1,1,0,1,1,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  1,0,1,1,0,1,],

  [6,
  0,1,0,1,0,1,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  1,0,1,0,1,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,1,0,1,0,1,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  1,0,1,0,1,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,1,0,1,0,1,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  1,0,1,0,1,0,],

  [4,
  0,0,1,0,0,1,
  0,0,1,0,0,1,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  0,0,0,0,0,0,
  1,0,1,0,1,0,
  1,0,1,0,1,0,],
];

// Lets the player control its position
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
window.onresize = resize;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;
}

function newColor() {
  var randint = parseInt(Math.random()*(colors.length-1)+1);
  currentColorInt += randint;
  currentColorInt = currentColorInt%colors.length;
  return colors[currentColorInt];
};

function keyDown(event) {
  if (event.keyCode == 39) {
    player.rightKeyDown = true;
  } else if (event.keyCode == 37) {
    player.leftKeyDown = true;
  } else if (event.keyCode == 13 && player.alive == false) {
    location.reload();
  } else if (event.keyCode == 27 && player.alive == false) {
    window.location = "../menu/index.html";
  }
};

function keyUp(event) {
  if (event.keyCode == 39) {
    player.rightKeyDown = false;
  } else if (event.keyCode == 37) {
    player.leftKeyDown = false;
  }
};

function obstacle(radius, track) {
  if (radius > 0 && radius < width) {
    c.lineWidth = 1;
    c.beginPath();
    c.fillStyle = "rgb(" + game.color.r + ", " + game.color.g + ", " + game.color.b + ")";
    c.strokeStyle = "rgb(" + game.color.r + ", " + game.color.g + ", " + game.color.b + ")";
    c.moveTo(width/2 + flatView*radius*Math.cos(((game.rotation%360+60*track)/360+ecc)*tau), height/2 + radius*Math.sin(((game.rotation%360+60*track)/360*tau)), 20, 0, tau);
    c.lineTo(width/2 + flatView*(radius+50)*Math.cos(((game.rotation%360+60*track)/360+ecc)*tau), height/2 + (radius+50)*Math.sin(((game.rotation%360+60*track)/360*tau)), 20, 0, tau);
    c.lineTo(width/2 + flatView*(radius+50)*Math.cos(((game.rotation%360+60+60*track)/360+ecc)*tau), height/2 + (radius+50)*Math.sin(((game.rotation%360+60+60*track)/360*tau)), 20, 0, tau);
    c.lineTo(width/2 + flatView*radius*Math.cos(((game.rotation%360+60+60*track)/360+ecc)*tau), height/2 + radius*Math.sin(((game.rotation%360+60+60*track)/360*tau)), 20, 0, tau);
    c.lineTo(width/2 + flatView*radius*Math.cos(((game.rotation%360+60*track)/360+ecc)*tau), height/2 + radius*Math.sin(((game.rotation%360+60*track)/360*tau)), 20, 0, tau);
    c.fill();
    c.stroke();
  }
};

// Game over event
function kill() {
  player.alive = false;
  game.rotationSpeed = 1;
  game.obstacleSpeed = 0;
  player.rotationSpeed = 0;

  killFrame = frame;
  timeSurvived = (killFrame/60);
}

function displayTimer() {
  var text;

  c.lineJoin = "miter";
  c.lineWidth = 16;
  c.fillStyle = "rgba(0, 0, 0, 0.75)";
  c.strokeStyle = "rgb(0, 0, 0)";

  c.beginPath();
  c.moveTo(width-280, 0);
  c.lineTo(width-220, 100);
  c.lineTo(width, 100);
  c.lineTo(width, 0);
  c.lineTo(width-280, 0);
  c.lineTo(width-220, 100);
  c.fill();
  c.stroke();

  c.textAlign = "right";
  c.font = "900 60px Orbitron";
  c.fillStyle = "rgba(255, 255, 255)";

  if (player.alive == true) {
    s = parseInt(frame/60);
    cs = parseInt(((frame%60/60)*100).toFixed(2));
  } else {
    s = parseInt(killFrame/60);
    cs = parseInt(((killFrame%60/60)*100).toFixed(2));
  }
  if (cs <= 9) {
    cs = "0" + cs;
  }

  c.fillText(s + ".", width-90, 80);

  c.textAlign = "left";
  c.font = "900 40px Orbitron";
  c.fillText(cs, width-90, 80);
}

// Generates a color at the start of the game
game.color = newColor();

// Randomly starts the rotation-direction counter-clockwise
if (parseInt(Math.random()*2) == 1) {
  game.rotationSpeed *= -1;
}


// game scene
function run() {
  play = setInterval(function () {

    // Player collision
    playerRow = parseInt((player.radius-10+(game.obstacleSpeed*frame)%50)/50);
    playerTrack = parseInt(player.rotation/60);

    // Checks for every track of the hexagon
    if (obstacles[playerRow*6 + playerTrack] == 1 && player.alive == true) {
      kill();
    }

    // Adds more obstacles
    if (obstacles.length < 180) {
      var randint = Math.ceil(Math.random()*patterns.length);

      // Adds spaces before each obstacle
      for (var i = 0; i < patterns[randint][0]; i++) {
        obstacles.push(0,0,0,0,0,0);
      }

      // Adds the actual obstacle
      for (var i = 0; i < patterns[randint].length-1; i++) {
        obstacles.push(patterns[randint][i+1]);
      }
    }

    // Removes passed obstacles
    if (rowsSpliced*50-game.obstacleSpeed*frame < 0) {
      obstacles.splice(0, 6);
      rowsSpliced++;
    }

    // moves the player by their speed
    if (player.rightKeyDown == true) {
      player.rotation += player.rotationSpeed;

      if (obstacles[(playerRow-1)*6 + Math.floor(player.rotation/60)%6] == 1) {
        player.rotation -= player.rotationSpeed;
      } else if (obstacles[(playerRow)*6 + Math.floor(player.rotation/60)%6] == 1) {
        player.rotation -= player.rotationSpeed;
      };
    }

    if (player.leftKeyDown == true) {
      player.rotation -= player.rotationSpeed;
      player.rotation += 360;

      if (obstacles[(playerRow-1)*6 + Math.floor(player.rotation/60)%6] == 1) {
        player.rotation += player.rotationSpeed;
      } else if (obstacles[(playerRow)*6 + Math.floor(player.rotation/60)%6] == 1) {
        player.rotation += player.rotationSpeed;
      };
    }

    // To prevent negative numbers
    if (player.rotation < 0) {
      player.rotation += 360;
    }

    // Rotates the whole thing
    game.rotation += game.rotationSpeed;
    player.position = player.position%360 + game.rotationSpeed;
    player.rotation = player.rotation%360;

    // Stuff that stops happening when the player dies
    if (player.alive == true) {
      // Color change event
      if (frame%120 == 0) {
        color0 = game.color;
        color1 = newColor();
      } else if (frame%120 > 0 && frame%120 < 40 && frame > 60) {
        var i = frame%120;
        var r = parseInt((color1.r-color0.r)*(i/40)+(color0.r));
        var g = parseInt((color1.g-color0.g)*(i/40)+(color0.g));
        var b = parseInt((color1.b-color0.b)*(i/40)+(color0.b));
        game.color.r = r;
        game.color.g = g;
        game.color.b = b;
      }

      // Rotation change
      if (frame%190 == 0) {
        game.rotationSpeed *= -1;
        var randint = parseInt(Math.random()*2);
        fastRotationInt += randint+1;
        fastRotationInt = fastRotationInt % 4;
      }

      // fast roation event
      if (frame%190 == 30 && game.rotationSpeed == 10) {
        game.rotationSpeed = 3;
      } else if (frame%190 == 0 && fastRotationInt == 3) {
        game.rotationSpeed = 10;
      }
    }

    // draws the background
    c.lineJoin = "miter";
    c.beginPath();
    c.fillStyle = "rgb(" + (game.color.r*0.7) + ", " + (game.color.g*0.7) + ", " + (game.color.b*0.7) + ")";
    c.fillRect(0, 0, width, height);

    // Radius of the shapes on the background, for debugging and stuff
    var radius = 2*width;

    // draws the shapes on the background, they're just triangles
    for (var i = 0; i < 3; i++) {
      c.moveTo(width/2, height/2);
      c.lineTo(
        width/2  + flatView*radius*Math.cos((game.rotation%360/360+(i*1/3)+ecc)*tau),
        height/2 + radius*Math.sin((game.rotation%360/360+(i*1/3))*tau)
      );
      c.lineTo(
        width/2  + flatView*radius*Math.cos((game.rotation%360/360+1/6+(i*1/3)+ecc)*tau),
        height/2 + radius*Math.sin((game.rotation%360/360+1/6+(i*1/3))*tau)
      );
      c.lineTo(width/2, height/2);
    }

    // fills the triangles with a color a bit darker than the "standard" background-color
    c.fillStyle = "rgb(" + (game.color.r*0.55) + ", " + (game.color.g*0.55) + ", " + (game.color.b*0.55) + ")";
    c.fill();

    // Adds the obstacles onto the canvas
    if (player.alive == true) {
      for (var i = 0; i < obstacles.length/6; i++) {
        for (var j = 0; j < 6; j++) {
          if (obstacles[i*6+j] == 1) {
            obstacle(i*50-game.obstacleSpeed*frame+rowsSpliced*50, j);
          }
        };
      };
    } else { // if u ded
      for (var i = 0; i < obstacles.length/6; i++) {
        for (var j = 0; j < 6; j++) {
          if (obstacles[i*6+j] == 1) {
            obstacle(i*50-8*killFrame+rowsSpliced*50, j);
          }
        };
      };
    }

    // Draws the hexagon in the middle
    c.lineWidth = game.hexRadius/8;
    c.fillStyle = "rgb(" + (game.color.r*0.55) + ", " + (game.color.g*0.55) + ", " + (game.color.b*0.55) + ")";
    c.strokeStyle = "rgb(" + game.color.r + ", " + game.color.g + ", " + game.color.b + ")";
    c.beginPath();
    c.moveTo(
      width/2  + flatView*game.hexRadius*Math.cos((game.rotation%360/360+ecc)*tau),
      height/2 +          game.hexRadius*Math.sin((game.rotation%360/360     *tau))
    );
    for (var i = 0; i < 8; i++) { // 8 because stupid corners
      c.lineTo(
        width/2  + flatView*game.hexRadius*Math.cos((game.rotation%360/360+(i*1/6)+ecc)*tau),
        height/2 +          game.hexRadius*Math.sin((game.rotation%360/360+(i*1/6))    *tau)
      );
    };
    c.fill();
    c.stroke();

    // player and shadow
    c.lineJoin = "bevel";
    for (var i = 0; i < 2; i++) {
      if (i == 0) {c.fillStyle = "rgb(" + (game.color.r/2) + ", " + (game.color.g/2) + ", " + (game.color.b/2) + ")";}
      else        {c.fillStyle = "rgb(" + game.color.r + ", " + game.color.g + ", " + game.color.b + ")";}
      c.beginPath();
      c.moveTo(
        width/2  + flatView*player.radius*Math.cos(((player.rotation+game.rotation)/360+ecc)*tau),
        height/2 +          player.radius*Math.sin(((player.rotation+game.rotation)/360)*tau)-8*(i-1)
      );
      c.lineTo(
        width/2  + flatView*player.radius*Math.cos((((player.rotation+game.rotation)-5)/360+ecc)*tau),
        height/2 +          player.radius*Math.sin((((player.rotation+game.rotation)-5)/360)*tau)-8*(i-1)
      );
      c.lineTo(
        width/2  + flatView*(player.radius+20)*Math.cos(((player.rotation+game.rotation)/360+ecc)*tau),
        height/2 +          (player.radius+20)*Math.sin(((player.rotation+game.rotation)/360)*tau)-8*(i-1)
      );
      c.lineTo(
        width/2  + flatView*player.radius*Math.cos((((player.rotation+game.rotation)+5)/360+ecc)*tau),
        height/2 +          player.radius*Math.sin((((player.rotation+game.rotation)+5)/360)*tau)-8*(i-1)
      );
      c.fill();
    }

    if (player.alive == false) {
      c.lineJoin = "miter";
      c.beginPath();
      c.lineWidth = 16;
      c.moveTo(width/2-300 + killBoxShift, height/2-100);
      c.lineTo(width/2-200 + killBoxShift, height/2+100);
      c.lineTo(width/2+300 + killBoxShift, height/2+100);
      c.lineTo(width/2+200 + killBoxShift, height/2-100);
      c.lineTo(width/2-300 + killBoxShift, height/2-100);
      c.lineTo(width/2-200 + killBoxShift, height/2+100);

      c.fillStyle = "rgba(0, 0, 0, 0.75)";
      c.fill();
      c.strokeStyle = "rgb(0, 0, 0)";
      c.stroke();

      c.font = "60px Orbitron";
      c.textAlign = "center";
      c.fillStyle = "rgb(255, 255, 255)";
      c.fillText("GAME OVER", width/2 + killBoxShift - 16, height/2-8);

      c.font = "32px Orbitron";
      c.fillText("Time survived: " + s  + "." + cs + " s", width/2 + killBoxShift + 24, height/2+64);

      if (frame-60 < killFrame) {
        killBoxShift *= 0.9;
      }
    }

    displayTimer();

    frame++;
  }, 1000/60);
};

// Actually starts the game
run();
