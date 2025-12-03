
// Use [ctrl] + [F] "=== " to navigate to different parts

// Physics part:    Math and physics architecture, and planet initialization
// UI part:         Interaction handling
// Draw part:       Defining shapes and drawing each frame
// Main part:       Main program functionality handling


const FPS = 144
const interactionRadius = 0.1 // Cursor-circle size
const zoomAmount = 1.2 // Increase to speed up zooming
const maxScale = 10 // Zoom-in limit
const minScale = 0.001 // Zoom-out limit
const backgroundColor = "rgb(10, 10, 30)"

const vectorSize = 0.5 // For vector arrowhead and thickness
const vectorLength = 10 // For vector length
const minForceVectorLength = 0.0
const maxForceVectorLength = 1.0

// Don't touch these, or you'll break the universe
const tau = 2 * Math.PI;
const G = 1 / 1e6
const c = get("canvas").getContext("2d");


var Width = window.innerWidth;
var Height = window.innerHeight;

var frame = 0 // Simulation ticks
var time = 0 // Real time, in seconds
var simulationSpeed = 1 // Initial simulation speed multiplier

var simulationPaused = false
var forceVectorsEnabled = false

var gridLinesEnabled = false

var mouseDown = false
var draggingEnabled = true

var mouseDownPos = {
    x: null,
    y: null
}
var prevMousePos = {
    x: null,
    y: null
}
var mousePos = {
    x: null,
    y: null
}



var view = {
    scale: 1.0, // 1/zoom
    position: {
        x: 0,
        y: 0,
    },
}

var cameraPosition = {
    x: 0,
    y: 0,
}

var selectedObject = "none";
var followingObject = "none";
var objectsAdded = 0

var addingObject = false
var gridSize = 100
var gridRadius = 10

text = {
    follow: "<u>F</u>ollow",
    unfollow: "Un<u>F</u>ollow",
    forceVectors: "Force <u>V</u>ectors: ",
    gridlines: "<u>G</u>ridlines: ",
}

// ======== PHYSICS PART ========

function getMagnitude(x, y) {
    return Math.sqrt(x*x + y*y)
}

function getAngle(x, y) {
    return Math.atan2(y, x)
}       

class Point { // Also doubles as a vector
    constructor(x, y) {
        this.x = x
        this.y = y
        this.magnitude = Math.sqrt(x*x + y*y)
    }
}

class PhysicsObject {
    constructor(name, position = new Point(0, 0), speed = new Point(0, 0), mass, radius, color, active=true) {
        this.name = name
        this.position = position
        this.speed = speed
        this.mass = mass
        this.radius = radius * 2
        this.color = color
        this.framesUntilTrail = 0
        this.active = active

        this.force = {
            x: 0,
            y: 0,
            magnitude: 0,
            angle: 0,
        }

        this.trail = []
    }

    drawBody() {
        // Drawing planets with shadows, except for the sun
        drawCircle(this.position.x, this.position.y, this.radius, false, this.color, (this.name != "Sol"))
    }

    drawTrail() {
        if (this.trail.length == 0) {
            return
        } else {
            // Trail settings
            c.beginPath()
            c.miterLimit = 3
            c.strokeStyle = this.color
            c.lineWidth = 0.1
            
            // Drawing the trail
            c.moveTo(this.position.x, this.position.y)
            for (let i = 0; i < this.trail.length; i++) {
                c.lineTo(this.trail[i].x, this.trail[i].y)
            }
            c.stroke()
        }
    }
    
    update() {
        
        this.force.x = 0
        this.force.y = 0

        this.position.x += this.speed.x
        this.position.y += this.speed.y

        var framesPerTrailPoint = simulationSpeed
        var maxTrailLength = 200

        this.framesUntilTrail--
        
        // Every nth frame, add a trail point
        if (this.framesUntilTrail < 0) { 
            this.framesUntilTrail += framesPerTrailPoint
            this.trail.unshift(new Point(this.position.x, this.position.y))
        }
        
        // Only store trail points for the last n frames
        if (this.trail.length >= maxTrailLength) { 
            this.trail.pop()
        }

        physicsObjects.forEach(physicsObject => {
            if (physicsObject == this) {
                return // Skips itself
            }
            this.applyGravity(physicsObject)
        });

        this.force.magnitude = getMagnitude(this.force.x, this.force.y)
        this.force.angle = getAngle(this.force.x, this.force.y)

        
    }

    applyGravity(physicsObject) {
        if (!this.active) {return}
        var m = physicsObject.mass
        var d = getMagnitude(
            physicsObject.position.x - this.position.x,
            physicsObject.position.y - this.position.y
        )
        
        // Crash
        /*if (d < physicsObject.radius) {
            physicsObjects.splice(physicsObjects.indexOf(this), 1)
        }*/

        // Gravitational point-force/acceleration
        var a = G * m / (d*d)
        var angle = getAngle(
            physicsObject.position.x - this.position.x,
            physicsObject.position.y - this.position.y
        )

        var ax = a * Math.cos(angle)
        var ay = a * Math.sin(angle)

        // Gravity formula
        this.boost(ax, ay)
    }

    // Actually an acceleration vector
    drawForceVector() {    
        drawVector(
            this.position.x, 
            this.position.y,
            Math.min(Math.max(this.force.magnitude*10, minForceVectorLength), maxForceVectorLength),
            this.force.angle,
            "rgb(250, 30, 0)"
        )
    }
    
    boost(x, y) {
        // A 1-frame acceleration
        this.speed.x += x
        this.speed.y += y

        this.force.x += x
        this.force.y += y
    }
}


/*
Sol = new PhysicsObject(
    name = "Sol",                           // Name, identical to object identifier
    position = new Point(0, 0.0),           // Position x and y in grid units
    speed = new Point(0, 0.000004),         // Initial speed in units per frame
    mass = 1000,                            // Mass in earth masses
    radius = 1,                             // Radius (not diameter) in grid units
    color = "rgba(224, 217, 0, 1)",       // Sunlit color
),
*/

// Massive objects
const physicsObjects = [

    Sol2 = new PhysicsObject(
        name = "Sol 2",                           // Name, identical to object identifier
        position = new Point(-1, 0),           // Position x and y in grid units
        speed = new Point(0.00005, -0.013),         // Initial speed in units per frame
        mass = 400,                            // Mass in earth masses
        radius = 0.35,                             // Radius (not diameter) in grid units
        color = "rgba(224, 168, 0, 1)",       // Sunlit color
    ),
    Sol = new PhysicsObject(
        name = "Sol",                           // Name, identical to object identifier
        position = new Point(1, 0),           // Position x and y in grid units
        speed = new Point(0.00005, 0.00865),         // Initial speed in units per frame
        mass = 600,                            // Mass in earth masses
        radius = 0.5,                             // Radius (not diameter) in grid units
        color = "rgba(224, 209, 0, 1)",       // Sunlit color
    ),

    Mercury = new PhysicsObject(
        name = "Mercury",
        position = new Point(-5, 0),
        speed = new Point(0, -0.013),
        mass = 0.2,
        radius = 0.1,
        color = "rgba(116, 116, 116, 1)",
    ),

    Venus = new PhysicsObject(
        name = "Venus",
        position = new Point(10, 0),
        speed = new Point(0.00, 0.010),
        mass = 1,
        radius = 0.2,
        color = "rgba(211, 197, 118, 1)",
    ),

    Earth = new PhysicsObject(
        name = "Earth",
        position = new Point(-20, 0),
        speed = new Point(0.00, -0.007),
        mass = 1,
        radius = 0.2,
        color = "rgba(0, 160, 195, 1)",
    ),

    Moon = new PhysicsObject(
        name = "Moon",
        position = new Point(-19.5, 0),
        speed = new Point(-0.0, -0.0057),
        mass = 0,
        radius = 0.1,
        color = "rgba(172, 189, 193, 1)",
    ),

    Mars = new PhysicsObject(
        name = "Mars",
        position = new Point(30, 0),
        speed = new Point(0.00, 0.006),
        mass = 1,
        radius = 0.1,
        color = "rgba(195, 62, 0, 1)",
    ),

    Jupiter = new PhysicsObject(
        name = "Jupiter",
        position = new Point(-70, 0),
        speed = new Point(0.00, -0.0037),
        mass = 4.5,
        radius = 0.5,
        color = "rgba(195, 143, 0, 1)",
    ),
    
    Ganymede = new PhysicsObject(
        name = "Ganymede",
        position = new Point(-71, 0),
        speed = new Point(0.00, -0.0013),
        mass = 0.5,
        radius = 0.1,
        color = "rgba(136, 127, 102, 1)",
    ),

    Saturn = new PhysicsObject(
        name = "Saturn",
        position = new Point(100, 0),
        speed = new Point(0.00, 0.0033),
        mass = 3,
        radius = 0.5,
        color = "rgba(197, 175, 115, 1)",
    ),

    Uranus = new PhysicsObject(
        name = "Uranus",
        position = new Point(-170, 0),
        speed = new Point(0.00, -0.0025),
        mass = 2,
        radius = 0.3,
        color = "rgba(64, 200, 204, 1)",
    ),

    Umbriel = new PhysicsObject(
        name = "Umbriel",
        position = new Point(-169.5, 0),
        speed = new Point(0.00, -0.0005),
        mass = 0,
        radius = 0.1,
        color = "rgba(113, 143, 191, 1)",
    ),

    Neptune = new PhysicsObject(
        name = "Neptune",
        position = new Point(250, 0),
        speed = new Point(0.00, 0.002),
        mass = 2,
        radius = 0.3,
        color = "rgba(37, 121, 255, 1)",
    ),

    comet_1 = new PhysicsObject(
        name = "comet_1",
        position = new Point(100, -50),
        speed = new Point(0.0005, 0.0005),
        mass = 0,
        radius = 0.1,
        color = "rgba(128, 128, 128, 1)",
    ),

    Voyager_3 = new PhysicsObject(
        name = "Voyager 3",
        position = new Point(-20, -0.4959),
        speed = new Point(0.0, -0.01),
        mass = 0,
        radius = 0.1,
        color = "rgba(103, 63, 131, 1)",
    ),

]


// ======== UI PART ========

function get(selector) {
    return document.getElementById(selector);
}

get("canvas").width = Width;
get("canvas").height = Height;

window.onresize = resize;
function resize() {
    Width = window.innerWidth;
    Height = window.innerHeight;
    
    get("canvas").width = Width;
    get("canvas").height = Height;

    c.translate(Width/2, Height/2)
    c.scale(1, -1);
}
c.translate(Width/2, Height/2)
c.scale(1, -1);

function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
    return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}

function drawBackground() {
    c.fillStyle = backgroundColor
    c.fillRect(-Width, -Height, Width*2, Height*2);
}


get("canvas").addEventListener("wheel", (event) => {

    if (event.deltaY < 0) {
        // Zooming in
        view.scale *= zoomAmount
        view.scale = Math.min(view.scale, maxScale)
        if (view.scale >= maxScale) {return}
        
        view.position.x -= (event.clientX - Width/2) / view.scale * (zoomAmount-1)
        view.position.y -= (event.clientY - Height/2) / view.scale * (zoomAmount-1)
        
    } else if (event.deltaY > 0) {
        // Zooming out
        view.scale /= zoomAmount
        view.scale = Math.max(view.scale, minScale)
        if (view.scale <= minScale) {return}
        
        view.position.x += (event.clientX - Width/2) / view.scale * (1/(1/(zoomAmount-1)+1))
        view.position.y += (event.clientY - Height/2) / view.scale * (1/(1/(zoomAmount-1)+1))
    }
})



// UI functionality, with some extra parameterless functions to be used in the hotkey setup
function halfSimSpeed() {   scaleSimSpeed(0.5) }
function doubleSimSpeed() { scaleSimSpeed(2) }

function scaleSimSpeed(multiplier) {
    var newSimSpeed = multiplier * simulationSpeed
    simulationSpeed = Math.min(Math.max(1, newSimSpeed), 1024) // Clamping
    updateBtnText()
}

function toggleSimulationPaused() {
    simulationPaused = !simulationPaused
    updateBtnText()
}

function toggleForceVectors() {
    forceVectorsEnabled = !forceVectorsEnabled
    updateVectorBtnText()
}

function toggleGridlines() {
    gridLinesEnabled = !gridLinesEnabled
    updateGridlinesBtnText()
}

// Simulation speed buttons, interfacing with the HTML
get("btnHalfSpeed").addEventListener("mouseup", () => { halfSimSpeed() })
get("btnDoubleSpeed").addEventListener("mouseup", () => { doubleSimSpeed() })
get("btnSimSpeed").addEventListener("click", () => { toggleSimulationPaused() })
get("btnToggleForceVectors").addEventListener("click", () => { toggleForceVectors() })
get("btnToggleGridlines").addEventListener("click", () => {toggleGridlines()})


// UI update functions
updateBtnText()
function updateBtnText() {
    var btnText
    if (simulationPaused) {
        btnText = "Sim paused (" + simulationSpeed + "x)"
    } else {
        btnText = "Sim speed: " + simulationSpeed + "x"
    }
    get("btnSimSpeed").innerHTML = btnText
    get("btnSimSpeed").style.backgroundColor = simulationPaused ? "rgb(250, 200, 200)" : "rgb(200, 250, 200)"
}

updateVectorBtnText()
function updateVectorBtnText() {
    get("btnToggleForceVectors").innerHTML = text.forceVectors + (forceVectorsEnabled ? "On" : "Off")
    get("btnToggleForceVectors").style.backgroundColor = !forceVectorsEnabled ? "rgb(250, 200, 200)" : "rgb(200, 250, 200)"
}

updateGridlinesBtnText()
function updateGridlinesBtnText() {
    get("btnToggleGridlines").innerHTML = text.gridlines + (gridLinesEnabled ? "On" : "Off")
    get("btnToggleGridlines").style.backgroundColor = !gridLinesEnabled ? "rgb(250, 200, 200)" : "rgb(200, 250, 200)"
}



get("canvas").addEventListener("mousedown", (event) => {
    mouseDown = true
    
    mouseDownPos = {
        x: event.clientX,
        y: event.clientY,
    }
    mousemove(event)
    click(event.clientX, event.clientY)
})
get("canvas").addEventListener("mouseup", (event) => {
    mouseDown = false
    release(event.clientX, event.clientY)
})
get("canvas").addEventListener("mousemove", (event) => {
    mousemove(event)
})

function mousemove(event) {
    if (mouseDown && !addingObject) {
        view.position.x += (event.clientX - prevMousePos.x)/view.scale
        view.position.y += (event.clientY - prevMousePos.y)/view.scale
    }

    prevMousePos = {
        x: event.clientX,
        y: event.clientY,
    }
    
    mousePos = {
        x: event.clientX,
        y: event.clientY,
    }
}



get("btnFollow").addEventListener("click", () => {
    if (selectedObject != "none" && (selectedObject != followingObject)) {
        // Starting to follow
        view.position = { x: 0, y: 0 } // Resetting pan
        view.scale = Math.max(0.2 / getObjectByName(selectedObject).radius, 0.3)
        followObject(selectedObject)
    } else {
        unfollowObject()
    }
})


function selectObject(physicsObject) {
    console.log("selecing " + physicsObject);
    
    selectedObject = physicsObject
    var objectInfo = getObjectByName(selectedObject)
    get("selectedObject").innerHTML = objectInfo.name
    get("btnFollow").style.display = "block"
    get("selectionInfo").style.display = "block"

    if (selectedObject != "none" && (selectedObject != followingObject)) {
        get("btnFollow").innerHTML = text.follow
    }
}

function unselectObject() {
    get("selectedObject").innerHTML = "none"

    if (followingObject == "none") {
        get("btnFollow").style.display = "none"
    } else {
        get("btnFollow").innerHTML = text.unfollow
    }
    get("selectionInfo").style.display = "none"
    selectedObject = "none"
}


function toggleFollowSelection() {
    if (get("btnFollow").style.display == "none") { return }
    get("btnFollow").click()
}

function followObject(physicsObject) {
    followingObject = physicsObject
    lookAt(followingObject)
    get("btnFollow").innerHTML = text.unfollow
}

function unfollowObject() {
    followingObject = "none"
    
    if (selectedObject == "none") {
        get("btnFollow").style.display = "none"
    }
    get("btnFollow").innerHTML = text.follow
}



get("btnAddObject").addEventListener("click", () => {
    addingObject = true
    updateAddObjectBtn()
})

function updateAddObjectBtn() {
    get("btnAddObject").innerHTML = addingObject ? "Adding object on click" : "Add object"
}
updateAddObjectBtn()




// Keyboard manager

class Hotkey { // Also doubles as a vector
    constructor(key, action) {
        this.key = key
        this.doAction = action
    }

    doAction() {
        
    }
}

window.addEventListener("keydown", (event) => {
    keyMap.forEach(hotkey => {
        if (event.key.toUpperCase() == hotkey.key.toUpperCase())
        hotkey.doAction()
    });
})

function logK() {
    console.log("K!")
}

const keyMap = [
    new Hotkey("K", logK),
    new Hotkey(" ", toggleSimulationPaused),
    new Hotkey("V", toggleForceVectors),
    new Hotkey("G", toggleGridlines),
    new Hotkey("F", toggleFollowSelection),
    new Hotkey("ArrowRight", doubleSimSpeed),
    new Hotkey("ArrowLeft", halfSimSpeed),
]

// ======== DRAWING PART ========


function drawSquare(x = 0, y = 0, size = 1) {
    c.beginPath();
    c.fillStyle = "rgb(0, 0, 0)"
    c.fillRect(x, y, size, size)
}

function drawImage(id, x = 0, y = 0, size = 1, centered = true) {
    if (centered) {
        c.drawImage(get(id), x-size/2, y-size/2, size, size)
    } else {
        c.drawImage(get(id), x, y, size, size)
    }
}

function drawCircle(x = 0, y = 0, radius = 1, hasBorder = true, color = "rgba(0,0,0,1)", hasShadow = false) {
    c.beginPath();
    c.fillStyle = color
    c.arc(x, y, radius, 0, tau)
    c.fill();
    c.strokeStyle = "rgb(0,0,0)"
    c.lineWidth = 0.05
    if (hasBorder) { c.stroke() };

    if (hasShadow) {
        var angle = getAngle(x - getObjectByName("Sol").position.x, y - getObjectByName("Sol").position.y)
        c.beginPath();
        c.fillStyle = "rgb(0, 0, 0, 0.2)"
        c.arc(x, y, radius, angle + 3*tau/4, angle + tau/4)
        c.fill()
    }
}

function drawVector(x, y, magnitude, angle, color = "rgb(0, 50, 250, 0)") {
    
    var length = magnitude * gridSize/vectorSize * vectorLength
    c.strokeStyle = color
    
    c.lineWidth = 0.11 // Needs to be fixed at 0.11 to completely fill the arrowhead
    c.translate(x, y)
    c.scale(vectorSize, vectorSize)
    c.rotate(angle)
        c.beginPath()
        c.translate(length, 0)
            c.moveTo(0.2, 0.0)
            c.lineTo(c.lineWidth/2-0.01, 0.06)
            c.lineTo(c.lineWidth/2-0.01, -0.06)
            c.lineTo(0.2, 0.0)
            c.lineTo(c.lineWidth/2-0.01, 0.06)
        c.translate(-length, 0)
        c.stroke()

        c.beginPath()
        c.moveTo(0, 0)
        c.lineTo(length, 0)
    c.rotate(-angle)
    c.stroke()
    c.scale(1/vectorSize, 1/vectorSize)
    c.translate(-x, -y)
}

function drawSelectedObject(physicsObject) {
    var GUIScale = 1
    var d = 0.2 * GUIScale
    
    var r = physicsObject.radius

    drawCircle(
        physicsObject.position.x,
        physicsObject.position.y,
        r*1.4*GUIScale,
        false,
        "rgb(0, 150, 250, 0.3)",// + (0.3 + 0.2 * Math.sin(time)),
        false
    )

    c.translate(physicsObject.position.x, physicsObject.position.y)
    for (let i = 0; i < 4; i++) {
        c.beginPath()
        c.moveTo(0, r + d)
        c.rotate(i*tau/4-time)
        c.lineTo(d/2, r + 2*d)
        c.lineTo(-d/2, r + 2*d)
        c.lineTo(0, r + d)
        c.lineTo(d/2, r + 2*d)
        c.fillStyle = "rgb(255, 255, 255, 0.5)"
        c.fill()
        c.rotate(-i*tau/4+time)
    }
    c.translate(-physicsObject.position.x, -physicsObject.position.y)
}

function drawGridlines() {
    
    for (let i = 0; i < 3; i++) {
        
        // Only draw gridlines close to the view scale
        c.save()
        c.scale(Math.pow(10, i), Math.pow(10, i))
        if (false) {
            return
        }

        c.beginPath()
        // Vertical gridlines
        for (let j = -gridRadius; j <= gridRadius; j++) {
            c.moveTo(j, -gridRadius)
            c.lineTo(j, gridRadius)
        }

        // Horizontal gridlines
        for (let j = -gridRadius; j <= gridRadius; j++) {
            c.moveTo(-gridRadius, j)
            c.lineTo(gridRadius, j)
        }

        c.strokeStyle = "rgb(250,250,250, 0.2)"
        c.lineWidth = 3/gridSize* 1/Math.pow(10, i) * 1/(Math.pow(view.scale, 0.8))
        c.stroke();

        c.restore()
    }
    
    
    
    // Thicker axes
    c.beginPath()
    c.strokeStyle = "rgb(050,250,200, 0.4)"
    c.moveTo(0, -1000)
    c.lineTo(0, 1000)
    c.moveTo(-1000, 0)
    c.lineTo(1000, 0)
    c.lineWidth = 3/gridSize * 1/view.scale
    c.stroke();
}


function draw() {
    drawBackground()
    c.save()
    c.scale(view.scale, view.scale)
    c.translate(view.position.x, -view.position.y)
    c.scale(gridSize, gridSize)
    c.translate(-cameraPosition.x, -cameraPosition.y)


    // ------- Draw stuff here -------

    if (gridLinesEnabled) { drawGridlines() }

    // Drawing all objects, with trails below all objects, and force vectors on top
    physicsObjects.forEach(physicsObject => {
        physicsObject.drawTrail()
    });
    physicsObjects.forEach(physicsObject => {
        physicsObject.drawBody()
    });
    if (forceVectorsEnabled) {
        physicsObjects.forEach(physicsObject => {
            physicsObject.drawForceVector()
        });
    }
        

    // Adding object
    if (addingObject && mouseDown) {
        var { Cx, Cy } = screenToCoordinates(mouseDownPos.x, mouseDownPos.y)
        var x1 = Cx
        var y1 = Cy
        var { Cx, Cy } = screenToCoordinates(mousePos.x, mousePos.y)
        var x2 = Cx
        var y2 = Cy

        var magnitude = getMagnitude(x2 - x1, y2 - y1)
        var angle = getAngle(x2 - x1, y2 - y1)

        drawVector(
            x1, y1, magnitude*0.001, angle,
            "rgb(255,255,255)"
        )
    }

    if (selectedObject != "none") {
        drawSelectedObject(getObjectByName(selectedObject))
    }

    drawCursor()

    c.restore()
}






// ======== MAIN PROGRAM LOGIC PART ========


function screenToCoordinates(x, y) {
    var Cx, Cy
    
    Cx = (x-Width/2 - view.position.x*view.scale)/gridSize*1/view.scale + cameraPosition.x
    Cy = -(y-Height/2 - view.position.y*view.scale)/gridSize*1/view.scale + cameraPosition.y
    return {Cx, Cy}
}

function click(x, y) {
    var { Cx, Cy } = screenToCoordinates(x, y)
    var { closestObject, closestDistance } = getClosestObject(Cx, Cy)
    
    if (addingObject) {
        physicsObjects.push(
            new PhysicsObject(
                name = "New Object " + (++objectsAdded),
                new Point(Cx, Cy),
                new Point(0, 0),
                0, 0.2, "rgb(255, 255, 255, 1)",
                false
            )
        )
        updateAddObjectBtn()
        return
    }

    if (closestDistance > (interactionRadius/view.scale + getObjectByName(closestObject).radius)) {
        unselectObject()
    } else {
        selectObject(closestObject)
    }
}
function drawCursor(active = false) {
    var { Cx, Cy } = screenToCoordinates(mousePos.x, mousePos.y)
    var { closestObject, closestDistance } = getClosestObject(Cx, Cy)
    
    var active = (closestDistance < interactionRadius/view.scale + getObjectByName(closestObject).radius)
    drawCircle(Cx, Cy, interactionRadius / view.scale, false,
        "rgb(50, 150, 250, " + ((active ? 0.6 : 0.3) + (addingObject ? 0.2 * Math.sin(10*time) : 0))
    )
}

function release(x, y) {
    if (addingObject) {
        physicsObjects[physicsObjects.length-1].active = true
        physicsObjects[physicsObjects.length-1].speed = new Point(
            (mousePos.x - mouseDownPos.x)/3e4, -(mousePos.y - mouseDownPos.y)/3e4
        )
        addingObject = false
        updateAddObjectBtn()
    }
}

function getClosestObject(Cx, Cy) {
    var closestDistance = 1e6
    var closestObject = "none"

    physicsObjects.forEach(PO => {
        if (getMagnitude(PO.position.x - Cx, PO.position.y - Cy) < closestDistance) {
            closestObject = PO.name
            closestDistance = getMagnitude(PO.position.x - Cx, PO.position.y - Cy)
        }
    });
    return {closestObject, closestDistance}
}

function getObjectByName(name) {
    var gottenPhysicsObject = null
    physicsObjects.forEach(PO => {
        
        if (PO.name == name) {
            gottenPhysicsObject = PO
        }
    });
    return gottenPhysicsObject
}


function lookAt(physicsObjectName) {
    var physicsObject = getObjectByName(physicsObjectName)
    cameraPosition.x = physicsObject.position.x
    cameraPosition.y = physicsObject.position.y
}

function update() {
    if (simulationPaused) { return }
    
    for (let i = 0; i < simulationSpeed; i++) {    
        frame++
        physicsObjects.forEach(physicsObject => {
            physicsObject.update()
        });
    }

    if (followingObject != "none") {
        lookAt(followingObject)
    }
    if (selectedObject != "none") {
        var objectInfo = getObjectByName(selectedObject)
        get("selectionMass").innerHTML = objectInfo.mass + " m𓇳"
        get("selectionSpeed").innerHTML = (getMagnitude(objectInfo.speed.x, objectInfo.speed.y)*FPS).toFixed(3) + " u/s"
    }
        


}





function animate() {
    update()
    draw()
    
    frame++
    time += 1/FPS
    requestAnimationFrame(animate)
}

animate()
