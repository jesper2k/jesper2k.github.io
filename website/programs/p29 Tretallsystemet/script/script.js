
var c = document.getElementById("canvas").getContext("2d"),
    numbers = 1000,
    r = 0; // Current row
    size = 30; // size of the squares
    width = window.innerWidth,
    height = size*numbers;

if (numbers*size >= window.innerHeight) {
  document.body.style.overflow = "scroll";
}

canvas.width = width;
canvas.height = height;

function tertiary(n) {
  var b = [];
  var i = 0;
  while (n >= 1) {
    if (n%3 == 0) {
      b[i] = 0;
      n = n/3;
    } else if (n%3 == 1) {
      b[i] = 1;
      n = (n-1)/3;
    } else {
      b[i] = 2;
      n = (n-2)/3;
    }
    i++;
  }
  return b;
}

function drawTertiary(b, r, text) {
  c.lineWidth = 1;
  var textX = 5;

  for (var i = 0; i < b.length; i++) {
    c.beginPath();
    c.rect(i*size, r*size, size, size);
    if (b[i] == 0) {
      c.fillStyle = "rgb(255, 255, 255)";
    } else if (b[i] == 1) {
      c.fillStyle = "rgb(255, 0, 0)";
    } else if (b[i] == 2) {
      c.fillStyle = "rgb(0, 0, 255)";
    }

    c.fill();
    //c.stroke();

    textX += size;
  };
  c.font = (size/2 + "px Arial");
  c.fillStyle = "rgb(0, 0, 0)";
  c.fillText((r + ","), textX, r*size+15);
  c.fillText(text, textX+8*(r.toString().length)+10, r*size+15);
};
//var fib = [1, 0];

// Draws the numbers
for (var i = 0; i < numbers; i++) {
  //fib[i+1] = fib[i] + fib[i-1];

  drawTertiary(tertiary(i**2), r, i**2);

  r++;
}
