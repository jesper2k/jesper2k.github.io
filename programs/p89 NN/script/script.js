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

function S_p(x) {
  return S(x) * (1 - S(x));
}


var data = [
  [3, 1.5, 1],
  [2, 1, 0],
  [4, 1.5, 1],
  [3.5, 0.5, 1],
  [2, 0.5, 0],
  [5.5, 1, 1],
  [1, 1, 0],
  [4, 5, 0],
  [6, 3, 0],
]


var trainingLength = 10000;
var learningRate = 0.1;

// Random numbers from -5 to 5
var w1 = 0 * (2*Math.random()-1);
var w2 = 0 * (2*Math.random()-1);
var b = 0 * (2*Math.random()-1);

var costs = [];
var avgcosts = [];
var costSum = 0;

for (var i = 0; i < trainingLength; i++) {
  var randIndex = parseInt(Math.random()*data.length);

  var z = data[randIndex][0] * w1 + data[randIndex][1] * w2 + b;

  var pred = S(z);
  var target = data[randIndex][2];

  var cost = (pred - target)**2;

  costs.push(cost);
  costSum += cost;
  avgcosts.push(costSum/(i+1));

  /* Finds the adjustments to w1, w2 and b

         o  pred (output)
    w1  / \  w2
  [0]  o   o  [1]

  See 3blue1brown NN chapter 4 for more info

  */

  // Backpropogation
  var dcost_dpred = 2*(pred-target);
  var dpred_dz = S_p(z);

  var dz_dw1 = data[randIndex][0]; // Slope is data[randIndex][0]
  var dz_dw2 = data[randIndex][1];
  var dz_db = 1; // (const)' --> 1

  var dcost_dw1 = dcost_dpred * dpred_dz * dz_dw1; // chain rule
  var dcost_dw2 = dcost_dpred * dpred_dz * dz_dw2;
  var dcost_db = dcost_dpred * dpred_dz * dz_db;

  // adjusts the weights and the bias
  w1 = w1 - (learningRate * dcost_dw1);
  w2 = w2 - (learningRate * dcost_dw2);
  b = b - (learningRate * dcost_db);
}



//console.log(costs);
function drawCosts(array, color) {
  c.fillStyle = color;
  for (var i = 0; i < array.length; i++) {
    c.beginPath();
    c.fillRect(Width/2 + 50 + i*(Width/2-100)/(array.length), (Height-50)-(Height-100)*array[i], 5, 5);
  }
}

function drawData() {
  c.save();
  c.translate(0, Height);
  c.scale(1, -1);
  c.translate(50, 50);

  for (var i = 0; i < data.length; i++) {
    if (data[i][2] == 0) {
      c.strokeStyle = "rgb(0, 0, 255)";
    } else {
      c.strokeStyle = "rgb(255, 0, 0)";
    }

    c.beginPath();
    c.arc(data[i][0]*100, data[i][1]*100, 5, 0, tau);
    c.stroke();
  }
  c.restore();
}

function drawPred() {
  c.save();
  c.translate(0, Height);
  c.scale(1, -1);
  c.translate(50, 50);
  for (var x = 0; x < 60; x++) {
    for (var y = 0; y < 60; y++) {

      var test_z = x/10 * w1 + y/10 * w2 + b;
      var test_pred = S(test_z);

      if (test_pred < 0.5) {
        c.fillStyle = "rgb(0, 0, 255, 0.4)";
      } else {
        c.fillStyle = "rgb(255, 0, 0, 0.4)";
      }
      c.beginPath();
      c.fillRect(x*10, y*10, 10, 10);
    }
  }
  c.restore();
}

drawData();
drawPred();
drawCosts(costs, "rgb(0, 0, 0, 0.1)");
drawCosts(avgcosts, "rgb(200, 0, 0, 1)");

//
