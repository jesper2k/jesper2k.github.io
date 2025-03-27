
var c = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

// Variables
var speedPower = 40;
var keySize = 70;
var gravityStrength = 1.2;

var spawnSpeedDisturb = 3;
var spawnRotationSpeed = 0.1;

var keys = [];

addEventListener("keypress", spawnKey);

function spawnKey(event) {
  console.log(event.keyCode);
  var key = {
    name: "null",
    speed: {
      x: spawnSpeedDisturb*(Math.random()*2-1),
      y: spawnSpeedDisturb*(Math.random()*2-1)-speedPower,
    },
    rotation: 0,
    rotationSpeed: spawnRotationSpeed*(Math.random()*2-1),
    position: {
      x: width/2,
      y: height+100,
    },
    row: 0,
  }

  if (event.keyCode == 97) {key.row = 3; key.nr = 1; key.name = "A"} else // A
  if (event.keyCode == 98) {key.row = 4; key.nr = 5; key.name = "B"} else // B
  if (event.keyCode == 99) {key.row = 4; key.nr = 3; key.name = "C"} else // C
  if (event.keyCode == 100) {key.row = 3; key.nr = 3; key.name = "D"} else // D
  if (event.keyCode == 101) {key.row = 2; key.nr = 3; key.name = "E"} else // E
  if (event.keyCode == 102) {key.row = 3; key.nr = 4; key.name = "F"} else // F
  if (event.keyCode == 103) {key.row = 3; key.nr = 5; key.name = "G"} else // G
  if (event.keyCode == 104) {key.row = 3; key.nr = 6; key.name = "H"} else // H
  if (event.keyCode == 105) {key.row = 2; key.nr = 8; key.name = "I"} else // I
  if (event.keyCode == 106) {key.row = 3; key.nr = 7; key.name = "J"} else // J
  if (event.keyCode == 107) {key.row = 3; key.nr = 8; key.name = "K"} else // K
  if (event.keyCode == 108) {key.row = 3; key.nr = 9; key.name = "L"} else // L
  if (event.keyCode == 109) {key.row = 4; key.nr = 7; key.name = "M"} else // M
  if (event.keyCode == 110) {key.row = 4; key.nr = 6; key.name = "N"} else // N
  if (event.keyCode == 111) {key.row = 2; key.nr = 9; key.name = "O"} else // O
  if (event.keyCode == 112) {key.row = 2; key.nr = 10; key.name = "P"} else // P
  if (event.keyCode == 113) {key.row = 2; key.nr = 1; key.name = "Q"} else // Q
  if (event.keyCode == 114) {key.row = 2; key.nr = 4; key.name = "R"} else // R
  if (event.keyCode == 115) {key.row = 3; key.nr = 2; key.name = "S"} else // S
  if (event.keyCode == 116) {key.row = 2; key.nr = 5; key.name = "T"} else // T
  if (event.keyCode == 117) {key.row = 2; key.nr = 7; key.name = "U"} else // U
  if (event.keyCode == 118) {key.row = 4; key.nr = 4; key.name = "V"} else // V
  if (event.keyCode == 119) {key.row = 2; key.nr = 2; key.name = "W"} else // W
  if (event.keyCode == 120) {key.row = 4; key.nr = 2; key.name = "X"} else // X
  if (event.keyCode == 121) {key.row = 2; key.nr = 6; key.name = "Y"} else // Y
  if (event.keyCode == 122) {key.row = 4; key.nr = 1; key.name = "Z"} else // Z
  if (event.keyCode == 230) {key.row = 3; key.nr = 11; key.name = "Æ"} else // Æ
  if (event.keyCode == 248) {key.row = 3; key.nr = 10; key.name = "Ø"} else // Ø
  if (event.keyCode == 229) {key.row = 2; key.nr = 11; key.name = "Å"} else // Å
  if (event.keyCode == 32) {key.row = 5; key.nr = 5; key.name = "space"} else // Space
  if (event.keyCode >= 49 && event.keyCode <= 57) {key.row = 1; key.nr = event.keyCode-48; key.name = event.keyCode-48}

  var marginLeft = 0;
  var keyMargin = 11;
  var rowSpacing = keySize + keyMargin;

  if (key.row == 1) {marginLeft = 65} else
  if (key.row == 2) {marginLeft = 100} else
  if (key.row == 3) {marginLeft = 120} else
  if (key.row == 4) {marginLeft = 160} else
  if (key.row == 5) {marginLeft = 160}

  key.position.y = height + key.row*rowSpacing;
  key.position.x = (keySize+keyMargin)*key.nr+marginLeft;

  keys.push(key);
}


c.textAlign = "left";
c.font = "50px Calibri";

// Draws the stuff
function draw() {
  c.beginPath();
  c.fillStyle = "rgb(255, 255, 255)";
  c.clearRect(0, 0, width, height);

  c.fillStyle = "rgb(50, 50, 50)";

  for (var i = 0; i < keys.length; i++) {
    if (keys[i].name != "null") {
      c.save();
      c.beginPath();

      c.translate(keys[i].position.x, keys[i].position.y);
      c.rotate(keys[i].rotation);
      if (keys[i].name == "space") {
        c.fillRect(-5*keySize/2, -keySize/2, 5*keySize, keySize);
      } else {
        c.fillRect(-keySize/2, -keySize/2, keySize, keySize);
        //c.fillStyle = "rgb(255, 255, 255)";
        //c.fillText(keys[i].name, -keySize/2+10, 10);
      }

      c.restore();

      keys[i].position.x += keys[i].speed.x;
      keys[i].position.y += keys[i].speed.y;

      keys[i].speed.y += gravityStrength;

      keys[i].rotation += keys[i].rotationSpeed;
    }



    // Deletes keys off screen
    if (keys[i].position.y > 1500) {
      keys.splice(i, 1);
      i--;
    }
  }
}

var running = setInterval(function() {
  draw();
}, 1000/58)
