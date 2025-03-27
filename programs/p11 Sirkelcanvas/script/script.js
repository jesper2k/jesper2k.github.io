/*
To do:

Temaknapper: outset border ved hover, inset og bakgrunnsfarge ved aktiv theme
Egendefinert fargevelger: "rød: [0-255] grønn: [0-50] blå: [150] +- 70
Flere figurer, som n-kant, stjerne, hjerte, donut (bare border)
Finere knapper, bedre layout

*/

// "Default"-variabler
var theme = 7;
var size = 30;

var r = Math.round(Math.random()*255);
var g = Math.round(Math.random()*255);
var b = Math.round(Math.random()*255);

window.onload = oppstart;
// Kjører denne funksjonen ved oppstart
function oppstart() {
  document.getElementById("tegneflate").onmousemove = flyttMus;
  document.getElementById("size").innerHTML = size;

  // Knapper
  document.getElementById("btnSizePlus").onclick = sizePlus;
  document.getElementById("btnSizeMinus").onclick = sizeMinus;
  document.getElementById("btnTykk").onclick = nySize;
  document.getElementById("btnClear").onclick = clear;
  document.getElementById("btnTheme0").onclick = theme0;
  document.getElementById("btnTheme1").onclick = theme1;
  document.getElementById("btnTheme2").onclick = theme2;
  document.getElementById("btnTheme3").onclick = theme3;
  document.getElementById("btnTheme4").onclick = theme4;
  document.getElementById("btnTheme5").onclick = theme5;
  document.getElementById("btnTheme6").onclick = theme6;
  document.getElementById("btnTheme7").onclick = theme7;
  //document.getElementById("btnTheme8").onclick = theme8;
  //document.getElementById("btnTheme9").onclick = theme9;
  //document.getElementById("btnTheme10").onclick = theme10;
}

// Funksjonsland

// Funksjon for å endre størrelsen på sirklene
function nySize() {
  size = document.getElementById("tykkelse").value;
  size = parseInt(size); // Ellers blir 20 + 5 = 205 når sizePlus blir kalt
  document.getElementById("size").innerHTML = size;
}

// Haug med funksjoner som endrer fargetema
function theme0() {theme = 0;}
function theme1() {theme = 1;}
function theme2() {theme = 2;}
function theme3() {theme = 3;}
function theme4() {theme = 4;}
function theme5() {theme = 5;}
function theme6() {theme = 6;}
function theme7() {theme = 7;}
//function theme7() {theme = 8;}
//function theme7() {theme = 9;}
//function theme7() {theme = 10;}

// Funksjon som stryker ut canvas når knapp blir trykket
function clear() {
  var ctx = document.getElementById("tegneflate").getContext("2d");
  ctx.rect(0, 0, tegneflate.width, tegneflate.height);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
}

// Funksjoner for å endre størrelsen på sirkelen med knapper
function sizePlus() {
  size += 5;
  document.getElementById("size").innerHTML = size;
}
function sizeMinus() {
  size -= 5;
  if (size < 0) {
    size = 0;
  }
  document.getElementById("size").innerHTML = size;
}

// Tegner en sirkel når musa blir flyttet
function flyttMus(evt) {

  // Angir fargevedier etter hvilket tema som er aktivt
  // Tilfeldig, theme 0, default
  if (theme === 0) {
    r = Math.round(Math.random()*255);
    g = Math.round(Math.random()*255);
    b = Math.round(Math.random()*255);
  } else

  // Skog, theme 1
  if (theme === 1) {
    r = Math.round(Math.random()*255);
    g = Math.round(Math.random()*255);
    b = 0;
  } else

  // Kveld, theme 2
  if (theme === 2) {
    r = Math.round(Math.random()*255);
    g = 0;
    b = Math.round(Math.random()*255);
  } else

  // Himmel, theme 3
  if (theme === 3) {
    r = 0;
    g = Math.round(Math.random()*255);
    b = Math.round(Math.random()*255);
  } else

  // Helvete, theme 4
  if (theme === 4) {
    r = Math.round(Math.random()*255);
    g = 0;
    b = 0;
  } else

  // Blader, theme 5
  if (theme === 5) {
    r = 0;
    g = Math.round(Math.random()*255);
    b = 0;
  } else

  // Natt, theme 6
  if (theme === 6) {
    r = 0;
    g = 0;
    b = Math.round(Math.random()*255);
  } else

  // Ember, theme 7
  if (theme === 7) {
    r = Math.random()*255;
    g = Math.random()*r;
    if (r < 200) {g -= 100;} // For å minke antall kjedelige oransje farger
    b = 0;
  } /*else

  // temaNavn8, theme 8
  if (theme === 6) {
    r = 0;
    g = 0;
    b = Math.round(Math.random()*255);
  } else

  // temaNavn9, theme 9
  if (theme === 6) {
    r = 0;
    g = 0;
    b = Math.round(Math.random()*255);
  } else

  // temaNavn10, theme 10
  if (theme === 6) {
    r = 0;
    g = 0;
    b = Math.round(Math.random()*255);
  } */

  /* For å legge til ny theme, legg til knapp i index, en funksjonskaller i oppstart
  en funksjon for theme-variabelen, og fargeverdiene for temaet. */


  // Gjør om fargevariablene til en "rgb()" string, fordi ctx.fillStyle tydeligvis bare kan ta strings
  var rs = r.toString()
  var gs = g.toString()
  var bs = b.toString()

  var rgbcolor = "rgb(" + rs + "," + gs + "," + bs + ")"

  // Tegner sirkelen
  var ctx = document.getElementById("tegneflate").getContext("2d");
  ctx.beginPath();
  ctx.arc(evt.clientX-10, evt.clientY - 100, size, 0, 2 * Math.PI);
  ctx.fillStyle = rgbcolor;
  ctx.fill();
}
