
/*
to do:

Kule farger :D
begeve seg med piltaster/dra med mus + zoom
// OPTIMIZE

*/

var c = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

const tau = 2*Math.PI;


// Viewbox
/*
const viewboxX = -0.6215248068;
const viewboxY = -0.462999442;
const viewboxWidth = 0.0000000015;
const viewboxHeight = 0.0000000015;
*/
const viewboxX = -0.749946;
const viewboxY = -0.019946;
const viewboxWidth = 0.000005;
const viewboxHeight = 0.000005;


/*
const viewboxX = -2;
const viewboxY = -1.3;
const viewboxWidth = 4;
const viewboxHeight = 4;
*/


// Variables
const iterations = 2500;

const pixelSize = 2*Math.abs(viewboxWidth)/width;
var pixels = [];


for (var i = 0; i < viewboxHeight/pixelSize*(height/width); i++) {
  pixels[i] = [];
  for (var j = 0; j < viewboxWidth/pixelSize; j++) {
    coordinate = {
      real: viewboxX + j*pixelSize,
      imag: viewboxY + i*pixelSize,
    }

    // Black or white
    var a = 0;
    var b = f(coordinate, iterations);

    if (b == "true") {a = 1} else {a = b/iterations}

    c.beginPath();
    c.fillStyle = "rgba(0, 0, 0, " + a + ")";
    c.fillRect(
      width * (j/(viewboxHeight/pixelSize)),
      width * (i/(viewboxHeight/pixelSize)),
      2, 2
    );

  }
}



function f(c, iterations) {
  var c = {
    real: c.real,
    imag: c.imag,
  }

  var newc = {
    real: 0,
    imag: 0,
  }

  for (var i = 0; i < iterations; i++) {
    if (Math.sqrt(newc.real**2 + newc.imag**2) >= 2) {
      return i;
    }

    // Actual function
    var foilF = newc.real*newc.real;
    var foilO = newc.real*newc.imag;
    var foilI = newc.imag*newc.real;
    var foilL = newc.imag*newc.imag;

    newc.real = (foilF - foilL) + c.real;
    newc.imag = (foilO + foilI) + c.imag;
  }

  return "true";
}
