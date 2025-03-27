
var c = document.getElementById("canvas").getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const tau = 2*Math.PI;

var gridSize = 5;
var lifeSpan = 50;
var generation = 0;

c.textAlign = "right";
var gridWidth = Math.ceil(width/gridSize);
var gridHeight = Math.ceil(height/gridSize);
var alive = 0;
var graphShowing = false;

var graphData = [0];
var a = [];
var nexta = [];

for (var x = 0; x < gridWidth; x++) {
  a[x] = [];
  for (var y = 0; y < gridHeight; y++) {
    if (/*Math.sqrt((x-gridWidth/2)**2+(y-gridHeight/2)**2) >= 21 &&
        Math.sqrt((x-gridWidth/2)**2+(y-gridHeight/2)**2) < 21+1*/

        x == Math.ceil(gridWidth/2) || y == Math.ceil(gridHeight/2)

        /*x%7 == 0 || y%5 == 0*/

        /*1.2*Math.random() < (-0.005*x + 0.01*y)*/

        /*1.5*Math.random() < (Math.sin(1/17*x*tau) + Math.sin(1/17*y*tau)-1)*/

        /* image input? */

        && (x > 0 && y > 0 && x < gridWidth-2 && y < gridHeight-2)) {
      a[x][y] = 1;
    } else {
      a[x][y] = 0;
    }
  }
}


// Drawing the squares
canvas.onclick = update;
function update(event) {
  if (graphShowing == false) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    var gridX = Math.floor(mouseX/gridSize);
    var gridY = Math.floor(mouseY/gridSize);

    if (a[gridX][gridY] == 0) {
      a[gridX][gridY] = 1;
      graphData[generation]++;
    } else {
      a[gridX][gridY] = 0;
      graphData[generation]--;
    }
    draw();
  }
}



// time++
function iteration() {
  alive = 0;

  nexta = [];
  for (var x = 0; x < gridWidth; x++) {
    nexta[x] = [];
    for (var y = 0; y < gridHeight; y++) {
      nexta[x][y] = a[x][y];
    }
  }

  // Checks every grid
  for (var x = 1; x < a.length-2; x++) {
    for (var y = 1; y < a[x].length-2; y++) {

      var adjAlive = 0;
      // Checks how many alive grids are next to the grid
      for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
          if (a[x+i][y+j] >= 1 && a[x+i][y+j] < lifeSpan) {
            adjAlive++;
          }
        }
      }


      // old
      if (a[x][y] >= lifeSpan) {
        // death
        nexta[x][y] = -1; // -n to wait n generations before able to be alive
      }

      // alive
      if (a[x][y] >= 1 && a[x][y] < lifeSpan) {
        adjAlive--;
        if (adjAlive == 2 || adjAlive == 3) {
          // still alive
          nexta[x][y] += 1;
          alive++;
        } else {
          // dead
          nexta[x][y] = 0;
        }

        // already dead
      } else {
        if (adjAlive == 3) {
          alive++;
          // alive!
          nexta[x][y] += 1;
        } else {
          // still dead
          nexta[x][y] = 0;
        }
      }

      // alive
      if (a[x][y] == 1) {
        adjAlive--; // Because if excluded, it would count 1 too much, since it's alive
      }

      /*
      if (adjAlive%2 == 1) {
        // still alive..
        nexta[x][y] = 1;
        alive++; // For the graph and statistics tracking
      } else {
        // ded
        nexta[x][y] = 0;
      }
      */
    }
  }
  graphData[generation] = alive;
  a = nexta;
  generation++;
}


function draw() {
  if (graphShowing == true) {
    var maxValue = 10;
    for (var i = 0; i < graphData.length; i++) {
      if (graphData[i] > maxValue)
      maxValue = graphData[i];
    }

    base = 2;
    var fieldLim = Math.ceil(Math.log(maxValue)/Math.log(2));

    var l1 = 1/10*width;
    c.beginPath();
    c.rect(0, 0, width, height);
    c.fillStyle = "rgb(30, 60, 80)";
    c.fill();

    for (var i = -5; i < fieldLim; i++) {
      if (height-2*l1-(2**i/maxValue)*(height-2*l1) > 0) {
        c.fillStyle = "rgb(" + (i*20-200) + "," + (60+i*5) + ", 80)";
        c.fillRect(l1, l1, width-2*l1, height-2*l1-(2**i/maxValue)*(height-2*l1));
      }
    }

    c.lineWidth = 3;
    c.strokeStyle = "rgb(200, 200, 200)";
    c.font = "30px Calibri";
    c.beginPath();
    c.moveTo(l1, l1-50);
    c.lineTo(l1, height-l1+50);
    c.moveTo(l1-50, height-l1);
    c.lineTo(width-l1+50, height-l1);
    c.moveTo(l1-15, l1);
    c.lineTo(l1+15, l1);
    c.moveTo(width-l1, height-l1-15);
    c.lineTo(width-l1, height-l1+15);
    c.stroke();

    c.textAlign = "right";
    c.fillStyle = "rgb(200, 200, 200)";
    c.fillText(maxValue, l1-23, l1+8);
    c.fill();

    c.textAlign = "center";
    c.fillStyle = "rgb(200, 200, 200)";
    c.fillText(generation, width-l1, height-l1+42);
    c.fill();

    c.lineWidth = 1;
    c.strokeStyle = "rgb(200, 200, 200)";
    c.fillStyle = "rgb(200, 0, 0)";

    // Draws the circles in the graph
    for (var i = 0; i < graphData.length; i++) {
      c.beginPath();
      c.arc(l1+((i+1)/graphData.length)*(width-2*l1), height-l1-(graphData[i]/maxValue)*(height-2*l1), 3, 0, tau);
      c.fill();
      c.stroke();
    }

  } else {
    c.beginPath();
    c.rect(0, 0, width, height);
    c.fillStyle = "rgb(30, 40, 50)";
    c.fill();

    // Draw and do stuff
    for (var x = 0; x < a.length; x++) {
      for (var y = 0; y < a[x].length; y++) {
        if (a[x][y] >= 1 /*&& a[x][y] < lifeSpan*/) {
          c.fillStyle = "rgb(" + (100+250*(a[x][y]/lifeSpan)) + "," + (450-400*(a[x][y]/lifeSpan)) + "," + 0 + ")";
          c.beginPath();
          c.fillRect(x*gridSize, y*gridSize, gridSize, gridSize);
          /*
          c.font = "20px Calibri";
          c.fillStyle = "rgb(0, 0, 0)";
          c.fillText(a[x][y], (x+1)*gridSize-3, (y+1)*gridSize-3);*/
        }
      }
    }

    c.fillStyle = "rgb(200, 200, 200)";
    c.textAlign = "right";
    c.font = "40px Calibri";
    c.fillText("Generation: " + generation, width-20, 50);
    c.fillText("Alive: " + alive, width-20, 100);

    /*if (graphShowing == true) {
      console.log(graphData);
    }*/
  }
}


addEventListener("keypress", keyPress);
function keyPress(event) {
  //console.log(event.keyCode);
  if (event.keyCode == 13) {
    iteration();
    draw();
  } else if (event.keyCode == 32) {
    if (graphShowing == false) {
      graphShowing = true;
      draw();
      console.log(a);
      //console.log("opening graph");
    } else if (graphShowing == true) {
      graphShowing = false;
      draw();
      //console.log("closing graph");
    }
  }


  /*else if (event.keyCode == 49) { // "1", walker
    a = [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ]
    fillarray();
  }*/
}

draw();


/*setInterval(function() {
  iteration();
  draw();
}, 300)*/
