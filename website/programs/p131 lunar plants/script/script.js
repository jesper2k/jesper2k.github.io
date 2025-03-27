const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}

var c = get("canvas").getContext("2d");
var Width = window.innerWidth;
var Height = window.innerHeight;
get("canvas").width = Width;
get("canvas").height = Height;

window.onresize = resize;
function resize() {
  Width = window.innerWidth;
  Height = window.innerHeight;
  get("canvas").width = Width;
  get("canvas").height = Height;
}

function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
  return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}

function drawBackground() {
  c.clearRect(0, 0, Width, Height);
}



class Leaf {
    
    static leaves = []

    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }

    drawLeaf() {
        c.save()
        c.translate(this.x, this.y)
        c.scale(3, 3)
        c.rotate(this.r*tau/360)
        
        c.beginPath()
        c.moveTo(0, 20)
        c.lineTo(-14, 0)
        c.lineTo(0, -20)
        c.lineTo(14, 0)
        c.lineTo(0, 20)

        c.fillStyle = "rgb(72, 165, 255)"
        if (this.color == 1) {c.fillStyle = "rgb(55, 139, 255)"}
        c.fill()

        c.restore()
    }

    
}

function drawLeaves() {
    Leaf.leaves.forEach(leaf => {
        leaf.drawLeaf()
    });
}

function Flower(x, y) {
    for (var i = 0; i < 8; i += 2) {
        Leaf.leaves.push(new Leaf(x + 80*Math.cos(((i+2)/8) * tau), y + 80*Math.sin(((i+2)/8) * tau), i*45, 1))
    }
    for (var i = 1; i < 8; i += 2) {
        Leaf.leaves.push(new Leaf(x + 80*Math.cos(((i+2)/8) * tau), y + 80*Math.sin(((i+2)/8) * tau), i*45, 0))
    }
}


for (let i = 0; i < Width*Height/200000; i++) {
    var rx = 120 + (Width - 240)*Math.random()
    var ry = 120 + (Height - 240)*Math.random()

    new Flower(rx, ry)
}

drawLeaves()
