
window.onload = oppstart;

function oppstart() {
  document.getElementById("start").onclick = run;
}

var bugs = 2019;
var text = "";
var totalText = "";

function run() {
  if (bugs < 0) {
    bugs = 0;
  }

  while (bugs > 1) {
    text = "";
    text += bugs + " little bugs in the code,<br />" + bugs + " bugs in the code, <br />";
    text += "take one down, fix it around,<br />";

    // Collatz conjecture
    if (bugs % 2 === 0) {
      bugs = bugs/2;
    } else {
      bugs = bugs*3 + 1;
    }
    text += bugs + " little bugs in the code,<br /><br />";

    totalText += text;
  }

  // 1 bug igjen
  text = "";
  text += "Only " + bugs + " little bug in the code,<br />" + bugs + " little bug in the code <br />";
  text += "take it down, fix it around,<br />";
  text += "Now theres finally no bugs in the code!";
  totalText += text;

  document.getElementById("text").innerHTML = totalText;
}
