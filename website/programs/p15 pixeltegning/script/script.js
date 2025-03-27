
// størrelsen på kvadratene
var size = 50;

window.onload = oppstart;

function oppstart() {
  var canvas = document.getElementById("canvas");

  // Setter bredden til canvas til bredden av vinduet
  canvas.setAttribute("width", window.innerWidth);
  canvas.setAttribute("height", window.innerHeight);

  // starter canvas-greier
  ctx = canvas.getContext("2d");

  ctx.fillStyle = "#4424c210";
  ctx.rectStyle = "000000";

  canvas.onmousemove = draw;


  console.log(ctx);
}

function draw(event) {
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  // fester koordinatene til et multippel av size
  var mouseXInGrid = mouseX - (mouseX % size);
  var mouseYInGrid = mouseY - (mouseY % size);

  // viser fyllet på rektangelet
  ctx.fillRect(mouseXInGrid, mouseYInGrid, size, size);
  ctx.fillRect(mouseXInGrid, mouseYInGrid, size, size);
  ctx.fillRect(mouseXInGrid+size, mouseYInGrid, size, size);
  ctx.fillRect(mouseXInGrid-size, mouseYInGrid, size, size);
  ctx.fillRect(mouseXInGrid, mouseYInGrid-size, size, size);
  ctx.fillRect(mouseXInGrid, mouseYInGrid+size, size, size);
}
