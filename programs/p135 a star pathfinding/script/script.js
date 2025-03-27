
/*
Tasks:
task 1 - implement the map and simulate the solutions
task 2 - just replace the start and end nodes (ez)
task 3 - Different tile costs




*/






const tau = 2 * Math.PI

function get(selector) {
    return document.getElementById(selector)
}

var c = get("canvas").getContext("2d")
var Width = window.innerWidth
var Height = window.innerHeight
get("canvas").width = Width
get("canvas").height = Height

function drawBackground() {
    c.clearRect(0, 0, Width, Height)
    c.fillStyle = "rgb(50, 50, 100)"
    c.fillRect(0, 0, Width, Height)

    c.clearRect(0, 0, Width, Height)
    c.fillStyle = "rgb(50, 50, 100)"
    c.fillRect(0, 0, Width, Height)
}

drawBackground()

// Setup and board generation
grid = []
gridSize = 10
cellSize = 50

for (let x = 0; x < gridSize; x++) {
    grid[x] = []
    for (let y = 0; y < gridSize; y++) {
        grid[x][y] = Math.random() < 0.3 ? 1 : 0 // 0 for walkable cell, 1 for wall
        if (grid[x][y]) {c.fillStyle = "rgb(0, 0, 0)"} else {c.fillStyle = "rgb(200, 200, 200)"}
        c.beginPath()
        c.fillRect(Width/2 - gridSize*cellSize/2 + x * cellSize, Height/2 - gridSize*cellSize/2 + y * cellSize, cellSize, cellSize)
    }
}


start = {x: 1, y: 1}
goal = {x: 8, y: 8}

grid[start.x][start.y] = 2
grid[goal.x][goal.y] = 3

// Coloring the special nodes
c.beginPath()
c.fillStyle = "rgb(150, 250, 150)"
c.fillRect(Width/2 - gridSize*cellSize/2 + 1 * cellSize, Height/2 - gridSize*cellSize/2 + 1 * cellSize, cellSize, cellSize)

c.beginPath()
c.fillStyle = "rgb(150, 150, 250)"
c.fillRect(Width/2 - gridSize*cellSize/2 + 8 * cellSize, Height/2 - gridSize*cellSize/2 + 8 * cellSize, cellSize, cellSize)



// f = g (from goal) + h (from start)

function f(node) {
    return Math.abs(node.x - start.x) + Math.abs(node.y - start.y) + Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y)
}

function g(node) {
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y)
}


// Visualizing all f and g values with text

c.fillStyle = "rgb(0, 0, 0)"
c.textAlign = "center"
for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
        
        if (!grid[x][y]) { // Skips nodes with walls
            // Text for total distance and distance to end node
            c.fillText(f(new Node(x, y)), Width/2 - gridSize*cellSize/2 + cellSize*x + 25, Height/2 - gridSize*cellSize/2 + cellSize*y + 25)
            c.fillText("(" + ((Math.abs(x - 8) + Math.abs(y - 8))) + ")", Width/2 - gridSize*cellSize/2 + cellSize*x + 25, Height/2 - gridSize*cellSize/2 + cellSize*y + 40)
        }
        
    }
}



// Node structure and generation
function Node(x, y) {
    this.x = x
    this.y = y

    this.close = function() {

        if (grid[this.x][this.y] == 3) {complete()}

        // Opening adjacent cells
        for (let adjX = -1; adjX <= 1; adjX++) {
            for (let adjY = -1; adjY <= 1; adjY++) {

                if (Math.abs(adjX) + Math.abs(adjY) == 2) {continue} // Prevent diagonals (feel free to comment out)
                if (adjX == 0 && adjY == 0) {continue} // Skip this node
                if (x + adjX < 0 || x + adjX >= gridSize || y + adjY < 0 || y + adjY >= gridSize) {continue} // Outside of board
                if (grid[this.x + adjX][this.y + adjY] == 1) {continue} // Skip obstacles/walls
                if (closedBoard[this.x + adjX][this.y + adjY]) {continue} // Skip already closed 
                if (openBoard[this.x + adjX][this.y + adjY]) {continue} // Skip already closed 

                
                newNode = new Node(this.x + adjX, this.y + adjY)

                openBoard[this.x + adjX][this.y + adjY] = newNode
                openNodes.push(newNode)

                // Drawing a red sqare for open (unexplored) nodes
                colorNode(this.x + adjX, this.y + adjY, "rgb(250, 100, 100)")
            }
        }

        openNodes.splice(openNodes.indexOf(this), 1) // Removes this node from open nodes
        openBoard[this.x][this.y] = 0
        closedBoard[this.x][this.y] = this
        closedNodes.push(this)

        c.beginPath()
        colorNode(this.x, this.y, "rgb(100, 250, 100)")

    }
}


// Colors a node with a sqaure
function colorNode(x, y, color) { 
    c.beginPath()
    c.fillStyle = color
    c.fillRect(Width/2 - gridSize*cellSize/2 + cellSize*x + 20, Height/2 - gridSize*cellSize/2 + cellSize*y + 5, 10, 10)
}

openNodes = []
closedNodes = []

openBoard = [] // Lookup table for checking if a node is open, either 0 or a node-object
closedBoard = []

for (let x = 0; x < gridSize; x++) {
    openBoard[x] = []
    closedBoard[x] = []
    for (let y = 0; y < gridSize; y++) {
        openBoard[x][y] = 0
        closedBoard[x][y] = 0
    }
}


// First node is the start node
openNodes.push(new Node(start.x, start.y))


function lowestCost(array) {
    closest = array[0]

    // For each element in openNodes
    for (let i = 1; i < array.length; i++) {
        if (f(array[i]) < f(closest)) {
            closest = array[i]
        } else if (f(array[i]) == f(closest)) {
            if (g(array[i]) < g(closest)) {
                closest = array[i]
            }
        }
    }

    return closest
}

var finished = false

function iterate() {
    if (finished) {
        // Do nothing, the program has finished
    } else if (openNodes.length == 0) {
        fail()
    } else {
        // Sort the open nodes by lowest total path distance (f), and if equal, lowest distance to goal (g)

        lowestCost(openNodes).close()
    }

}

//document.addEventListener("keydown", iterate);


setInterval(function() {
    iterate()
}, 100)



/*
while(!) {
    iterate()
}
*/


function complete() {
    console.log("Path found");
    finished = true
}

function fail() {
    console.log("No path");
    finished = true
}