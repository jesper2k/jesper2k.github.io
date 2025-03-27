

// Controls
var tableItemsX = 4;
var tableItemWidth = 200;
var tableItemHeight = 200;
var tableItemMargin = 30;

// pls dont adjust these
var currentElementX = 0;

var Width = window.innerWidth;

var colorSeed = "abcdefghbadgefhcehfadgagefhcbcda";



var elementAttatch = document.getElementById("theTable");

var programs = [
  {name: "Canvas-painting", pathName: "p11 Sirkelcanvas"},
  {name: "Bugs", pathName: "p13 Bugs i koden"},
  {name: "Pixel-painting", pathName: "p15 pixeltegning"},
  {name: "Time", pathName: "p24 time"},
  {name: "Random walk", pathName: "p25 tilfeldig"},
  {name: "Squares, ternary", pathName: "p29 Tretallsystemet"},
  {name: "Duper Hexagon", pathName: "p31 Super Hexagon"},
  {name: "Eyes", pathName: "p33 eyes"},
  {name: "Fourier", pathName: "p34 fourier"},
  {name: "Gravity", pathName: "p36 gravitasjon"},
  {name: "Game of life", pathName: "p37 Game of life"},
  {name: "Collition", pathName: "p39 kollisjon"},
  {name: "3D, v1", pathName: "p41 3D"},
  {name: "Procedural terrain", pathName: "p44 Terrain"},
  {name: "Typing", pathName: "p48 Keyboard"},
  {name: "Diffusion", pathName: "p51 Diffusjon_dings"},
  {name: "Mandelbrot", pathName: "p52 Mandelbrot"},
  {name: "The trapped knight", pathName: "p63 knight"},
  {name: "Terrain & movement", pathName: "p65 movement"},
  {name: "Asteroids", pathName: "p73 asteroids"},
  {name: "3D, v2", pathName: "p82 3DV2"},
  {name: "Dancing cubes", pathName: "p86 cubes"},
  {name: "Snake", pathName: "p88 snek"},
  {name: "Learning", pathName: "p89 NN"},
  {name: "Scale of the universe", pathName: "p93 SotU"},
  {name: "Paricle", pathName: "p95 infinite plane"},
  {name: "Nodes", pathName: "p101 Axon"},
  {name: "Natural mesh", pathName: "p102 natural grid"},
  {name: "Waves", pathName: "p105 lading"},
  {name: "Minesweeper", pathName: "p120 minesweeper"},
];


// Please god do not look at this

function instantiateProgramTable() {
    for (var i = 0; i < programs.length; i++) {
        var x = tableItemMargin/2 - (tableItemWidth + tableItemMargin) * tableItemsX/2 + i%tableItemsX * (tableItemWidth + tableItemMargin);
        var y = Math.floor(i/tableItemsX) * (tableItemHeight + tableItemMargin);

        var colors = colorGenerator(colorSeed[i]);

        var address = "programs/"+ programs[i].pathName + "/index.html";
        address = address.split(" ").join("%20");

        var htmlstuff = "";
        htmlstuff += "<div class='outerProgramDiv' onClick=redirectTo('" + address + "') ";
        htmlstuff += "style ='margin-left:" + x + "px; margin-top:" + y + "px;'><div class='innerProgramDiv' style='background-image: linear-gradient(160deg, " + colors.color1 + "," + colors.color2 + ");'>";
        htmlstuff += "<a href=" + address + ">" + programs[i].name + "</a>";
        htmlstuff += "</div></div>";

        elementAttatch.innerHTML += htmlstuff;
    }

}

function setCursorPointer() {
    document.getElementsByClassName("outerProgramDiv").style.cursor = "pointer";
}

function setCursorDefault() {
    document.getElementsByClassName("outerProgramDiv").style.cursor = "default";
}

function redirectTo(path) {
    location.href = path;
}


function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
    return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}


function colorGenerator(value) {
    var colors = { /* Default value */
        color1: "rgb(100, 200, 250)",
        color2: "rgb(100, 100, 250)",
    }

    if (value == "b") {
        colors.color1 = "rgb(250, 200, 100)";
        colors.color2 = "rgb(250, 100, 100)";
    } else if (value == "c") {
        colors.color1 = "rgb(200, 250, 100)";
        colors.color2 = "rgb(100, 150, 100)";
    } else if (value == "d") {
        colors.color1 = "rgb(100, 250, 200)";
        colors.color2 = "rgb(100, 150, 150)";
    } else if (value == "e") {
        colors.color1 = "rgb(250, 150, 200)";
        colors.color2 = "rgb(200, 100, 100)";
    } else if (value == "f") {
        colors.color1 = "rgb(250, 100, 100)";
        colors.color2 = "rgb(200, 50, 50)";
    } else if (value == "g") {
        colors.color1 = "rgb(250, 250, 100)";
        colors.color2 = "rgb(150, 150, 50)";
    } else if (value == "h") {
        colors.color1 = "rgb(200, 100, 200)";
        colors.color2 = "rgb(150, 50, 150)";
    }


    return colors;
}

instantiateProgramTable();
