const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}

var c = get("canvas").getContext("2d");
var Width = window.innerWidth;
var Height = window.innerHeight;
get("canvas").width = Width;
get("canvas").height = Height;

function clearBackground() {
  c.clearRect(0, 0, Width, Height);
}

function reLU(x) {
  if (x <= 0) {
    return 0;
  } else {
    return x;
  }
}

function S(x) {
  return (1/(1+Math.E**-x));
}



var input = Math.random();

var node1 = {
  value: input,
  draw: function() {
    c.lineWidth = 8;
    c.fillStyle = "rgb(250, 200, 200)";
    c.strokeStyle = "rgb(250, 100, 100)";
    c.beginPath();
    c.arc(Width/2-300, Height/2, 100, 0, tau);
    c.fill();
    c.stroke();

    c.textAlign = "center"
    c.fillStyle = "rgb(0, 0, 0)";
    c.font = "60px Roboto";
    c.fillText(this.value.toFixed(2), Width/2-300, Height/2+20);
  }
}

var neuron = {
  weight: Math.random(),
  bias: Math.random(),
  draw: function() {
    c.lineWidth = (10 + Math.abs(this.weight));
    c.strokeStyle = "rgb(" + (100 + this.weight*10) + ","  + (100 - this.weight*5) + "," + (100 - this.weight*10) + "," + (0.25 + Math.abs(this.weight)/10) + ")"
    c.beginPath();
    c.moveTo(Width/2-300, Height/2);
    c.lineTo(Width/2+300, Height/2);
    c.stroke();

    // Draw text
    c.textAlign = "center"
    c.fillStyle = "rgb(0, 0, 0)";
    c.font = "40px Roboto";
    c.fillText("weight: " + this.weight.toFixed(2), Width/2, Height/2-80);
    c.fillText("bias: " + this.bias.toFixed(2), Width/2, Height/2-30);
  }
}

var z = node1.value * neuron.weight + neuron.bias;

var node2 = {
  value: S(z),
  draw: function() {
    c.lineWidth = 8;
    c.fillStyle = "rgb(200, 250, 250)";
    c.strokeStyle = "rgb(100, 200, 250)";
    c.beginPath();
    c.arc(Width/2+300, Height/2, 100, 0, tau);
    c.fill();
    c.stroke();

    c.textAlign = "center"
    c.fillStyle = "rgb(0, 0, 0)";
    c.font = "60px Roboto";
    c.fillText(this.value.toFixed(2), Width/2+300, Height/2+20);
  }
}


var desiedOutput = 1;


setTimeout(function() {
  neuron.draw();
  node1.draw();
  node2.draw();
}, 50);

function cost() {

}


function drawNeuron() {

}










//
