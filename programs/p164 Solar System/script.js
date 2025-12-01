
// ======== PHYSICS PART ========
var G = 0.000001
var simulationSpeed = 1

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

    draw() {

        if (this.trail.length == 0) {
            return
        } else {
            c.beginPath()
            c.miterLimit = 3
            c.strokeStyle = this.color
            c.lineWidth = 0.1
            c.moveTo(this.trail[0].x, this.trail[0].y)

            for (let i = 1; i < this.trail.length; i++) {
                c.lineTo(this.trail[i].x, this.trail[i].y)
            }
            c.stroke()
            drawCircle(this.trail[0].x, this.trail[0].y, this.radius, false, this.color, (this.name != "Sol"))
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

        this.force.x += ax
        this.force.y += ay

        // Gravity formula
        this.boost(ax, ay)
    }

    drawForceVector() {    
        drawVector(
            this.position.x, 
            this.position.y,
            Math.min(this.force.magnitude*10 + 0.0005, 0.0015),
            this.force.angle,
            "rgb(250, 30, 0)"
        )
    }
    
    boost(x, y) {
        this.speed.x += x
        this.speed.y += y

        this.force.x += x // Temporary, only for this frame
        this.force.y += y
    }
}




// Massive objects
var physicsObjects = [
    Sol = new PhysicsObject(
        name = "Sol",
        position = new Point(0, 0.0),
        speed = new Point(0, 0.000004),
        mass = 1000,
        radius = 1,
        color = "rgba(224, 217, 0, 1)",
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
        name = "Voyager_3",
        position = new Point(-20, -0.4959),
        speed = new Point(0.0, -0.01),
        mass = 0,
        radius = 0.1,
        color = "rgba(103, 63, 131, 1)",
    ),

]


// ======== MAIN PART ========
const tau = 2 * Math.PI;
const FPS = 144

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

    c.translate(Width/2, Height/2)
    c.scale(1, -1);
}
c.translate(Width/2, Height/2)
c.scale(1, -1);

function colorToRGB(color, shiftR = 0, shiftG = 0, shiftB = 0) {
    return "rgb(" + (color.r + shiftR) + "," + (color.g + shiftG) + "," + (color.b + shiftB) + ")";
}

function drawBackground() {
    c.fillStyle = "rgb(10, 10, 30)"
    c.fillRect(-Width, -Height, Width*2, Height*2);
}


get("canvas").addEventListener("wheel", function(event) {
    if (event.deltaY < 0) {
        view.scale *= zoomAmount

        view.position.x -= (event.clientX - Width/2) / view.scale * (zoomAmount-1)
        view.position.y -= (event.clientY - Height/2) / view.scale * (zoomAmount-1)
        
    } else if (event.deltaY > 0) {
        view.scale /= zoomAmount
        
        view.position.x += (event.clientX - Width/2) / view.scale * (1/(1/(zoomAmount-1)+1))
        view.position.y += (event.clientY - Height/2) / view.scale * (1/(1/(zoomAmount-1)+1))
    }
})


// ----------- Dashboard buttons interaction ----------- 
var simulationPaused = false
var forceVectorsEnabled = false
var gridLinesEnabled = false

// Simulation speed buttons
get("btnHalfSpeed").addEventListener("mouseup", function(event) {
    if (!simulationPaused) { simulationSpeed *= 0.5 }
    simulationSpeed = Math.max(1, simulationSpeed) // Lower limit
    updateBtnText()
})
get("btnDoubleSpeed").addEventListener("mouseup", function(event) {
    if (!simulationPaused) { simulationSpeed *= 2 }
    updateBtnText()
})
get("btnSimSpeed").addEventListener("click", function(event) {
    simulationPaused = !simulationPaused
    updateBtnText()
})

function updateBtnText() {
    var btnText = "Sim speed: " + simulationSpeed + "x"
    if (simulationPaused) {btnText = "Simulation paused"}
    get("btnSimSpeed").innerHTML = btnText
    get("btnSimSpeed").style.backgroundColor = simulationPaused ? "rgb(250, 200, 200)" : "rgb(200, 250, 200)"
}
updateBtnText()



// Force vector toggle logic
get("btnToggleForceVectors").addEventListener("click", function(event) {
    forceVectorsEnabled = !forceVectorsEnabled
    updateVectorBtnText()
})

function updateVectorBtnText() {
    get("btnToggleForceVectors").innerHTML = "Force vectors: " + (forceVectorsEnabled ? "On" : "Off")
    get("btnToggleForceVectors").style.backgroundColor = !forceVectorsEnabled ? "rgb(250, 200, 200)" : "rgb(200, 250, 200)"
}
updateVectorBtnText()



// Gridlines toggle
get("btnToggleGridlines").addEventListener("click", function(event) {
    gridLinesEnabled = !gridLinesEnabled
    updateGridlinesBtnText()
})

function updateGridlinesBtnText() {
    get("btnToggleGridlines").innerHTML = "Gridlines: " + (gridLinesEnabled ? "On" : "Off")
    get("btnToggleGridlines").style.backgroundColor = !gridLinesEnabled ? "rgb(250, 200, 200)" : "rgb(200, 250, 200)"
}
updateGridlinesBtnText()


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

get("canvas").addEventListener("mousedown", function(event) {
    mouseDown = true
    
    mouseDownPos = {
        x: event.clientX,
        y: event.clientY,
    }
    mousemove(event)
    click(event.clientX, event.clientY)
})
get("canvas").addEventListener("mouseup", function(event) {
    mouseDown = false
    release(event.clientX, event.clientY)
})
get("canvas").addEventListener("mousemove", function(event) {
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

var zoomAmount = 1.2
var view = {
    scale: 1.0, // aka zoom
    position: {
        x: 0,
        y: 0,
    },
}
var cameraPosition = {
    x: 0,
    y: 0,
}


// Selected object text
var interactionRadius = 0.1
var selectedObject = "none";
var followingObject = "none";
var objectsAdded = 0


get("btnFollow").addEventListener("click", function (event) {
    if (selectedObject != "none" && (selectedObject != followingObject)) {
        // Starting to follow
        view.position = { x: 0, y: 0 } // Resetting pan
        view.scale = Math.max(0.2/getObjectByName(selectedObject).radius, 0.3)
        followObject(selectedObject)
    } else {
        unfollowObject()
    }
})


function selectObject(physicsObject) {
    selectedObject = physicsObject
    get("selectedObject").innerHTML = selectedObject
    get("btnFollow").style.display = "block"
    if (selectedObject != "none" && (selectedObject != followingObject)) {
        get("btnFollow").innerHTML = "Follow"
    }
}

function unselectObject() {
    get("selectedObject").innerHTML = "none"
    if (followingObject == "none") {
        get("btnFollow").style.display = "none"
    }
    selectedObject = "none"
}

function followObject(physicsObject) {
    followingObject = physicsObject
    get("btnFollow").innerHTML = "Unfollow"
}

function unfollowObject() {
    followingObject = "none"
    
    if (selectedObject == "none") {
        get("btnFollow").style.display = "none"
    }
    get("btnFollow").innerHTML = "Follow"
}



var addingObject = false
get("btnAddObject").addEventListener("click", function (event) {
    addingObject = true
    updateAddObjectBtn()
})

function updateAddObjectBtn() {
    get("btnAddObject").innerHTML = addingObject ? "Adding object on click" : "Add object"
}
updateAddObjectBtn()




var gridSize = 100
var gridRadius = 10



var scaleStack = []

function scale(x) {
    scaleStack.push(x)
    c.scale(x, x)
}

function unscale() {
    x = scaleStack.pop()
    c.scale(1/x, 1/x)
}

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
    var size = 1
    var length = magnitude * 1e3/size
    c.lineWidth = 0.11
    c.strokeStyle = color

    
    c.translate(x, y)
    c.scale(size, size)
    c.rotate(angle)
        c.beginPath()
        c.translate(length, 0)
            c.moveTo(0.2, 0)
            c.lineTo(0.0, 0.075)
            c.lineTo(0.0, -0.075)
            c.lineTo(0.2, 0)
            c.lineTo(0.0, 0.075)
        c.translate(-length, 0)
        c.stroke()

        c.beginPath()
        c.moveTo(0, 0)
        c.lineTo(length, 0)
    c.rotate(-angle)
    c.stroke()
    c.scale(1/size, 1/size)
    c.translate(-x, -y)
    
    

}

function drawSelectedObject(physicsObject) {
    var GUIScale = 1
    var d = 0.2 * GUIScale
    
    var r = physicsObject.radius

    drawCircle(
        physicsObject.trail[0].x,
        physicsObject.trail[0].y,
        r*1.4*GUIScale,
        false,
        "rgb(0, 150, 250, 0.3)",// + (0.3 + 0.2 * Math.sin(frame / (30 * simulationSpeed))),
        false
    )

    c.translate(physicsObject.trail[0].x, physicsObject.trail[0].y)
    for (let i = 0; i < 4; i++) {
        c.beginPath()
        c.moveTo(0, r + d)
        c.rotate(i*tau/4 + frame / (-1e3 * simulationSpeed))
        c.lineTo(d/2, r + 2*d)
        c.lineTo(-d/2, r + 2*d)
        c.lineTo(0, r + d)
        c.lineTo(d/2, r + 2*d)
        c.fillStyle = "rgb(255, 255, 255, 0.5)"
        c.fill()
        c.rotate(-i*tau/4 - frame / (-1e3 * simulationSpeed))
    }
    c.translate(-physicsObject.trail[0].x, -physicsObject.trail[0].y)
}

function drawGridlines() {
    
    for (let i = 0; i < 2; i++) {
        
        // Only draw gridlines close to the view scale
        scale(Math.pow(10, i), Math.pow(10, i))
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
        c.lineWidth = 3/gridSize
        c.stroke();

        unscale()
    }
    
    
    
    // Thicker axes
    c.beginPath()
    c.moveTo(0, -1000)
    c.lineTo(0, 1000)
    c.moveTo(-1000, 0)
    c.lineTo(1000, 0)
    c.lineWidth = 10/gridSize
    c.stroke();
}

function drawOrbit(physicsObject) {
    
}

function draw() {
    
    drawBackground()
    scale(view.scale)
    c.translate(view.position.x, -view.position.y)
    scale(gridSize)
    c.translate(-cameraPosition.x, -cameraPosition.y)


    // ------- Draw call -------
    if (gridLinesEnabled) { drawGridlines() }

    // Force vectors
    physicsObjects.forEach(physicsObject => {
        physicsObject.draw()

        if (forceVectorsEnabled) { physicsObject.drawForceVector() }
    });

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
    
    c.translate(cameraPosition.x, cameraPosition.y)
    unscale()
    c.translate(-view.position.x, view.position.y)
    unscale()
}


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

    console.log(closestDistance, interactionRadius, getObjectByName(closestObject).radius, interactionRadius + getObjectByName(closestObject).radius);
    console.log(closestDistance - (interactionRadius/view.scale + getObjectByName(closestObject).radius))
    
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
        "rgb(50, 150, 250, " + ((active ? 0.6 : 0.3) + (addingObject ? 0.2 * Math.sin(frame / (30 * simulationSpeed)) : 0))
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



function update() {
    if (simulationPaused) { return }

    if (followingObject != "none") {
        
        var physicsObject = getObjectByName(followingObject)
        cameraPosition.x = physicsObject.position.x
        cameraPosition.y = physicsObject.position.y
    }   
        

    for (let i = 0; i < simulationSpeed; i++) {    
        frame++
        physicsObjects.forEach(physicsObject => {
            physicsObject.update()
        });
    }

}



var frame = 0
var time = 0

function animate() {
    
    update()
    draw()
    
    frame++
    time += FPS
    requestAnimationFrame(animate)
}

animate()

