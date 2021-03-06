const NODE_DISPLACEMENT = 96
  , WAVECOUNT = 4
  , CANVAS_DEBUG = !1;
function startCanvas() {
    ANIMATION = null,
    cvs = canvasElement = document.getElementById("pond"),
    ctx = cvs.getContext("2d"),
    cvs.width = cvs.getBoundingClientRect().width,
    cvs.height = cvs.getBoundingClientRect().height,
    waveHeight = 46,
    waveYCoord = .2 * cvs.height,
    waveSpacing = 25,
    DROPCOUNT = Math.ceil(100 * window.innerWidth / 1536),
    SPEED = cvs.height / 754,
    colorScheme = [gradientColor("rgba(20, 87, 108, 0.8)", 1), gradientColor("rgba(23, 100, 125, 0.8)", 2, "rgba(0, 0, 0, 1)", 1), gradientColor("rgba(26, 114, 141, 0.7)", 2, "rgba(0, 0, 0, 1)", 1), gradientColor("rgba(32, 140, 174, 0.3)", 2, "rgba(0, 0, 0, 1)", 1)],
    ocean = new Ocean(NODE_DISPLACEMENT,waveYCoord,waveSpacing,colorScheme,WAVECOUNT,DROPCOUNT,20,1.1 * Math.PI,cvs.height / 754 * .5),
    ocean.newWaveFrame()
}
function createGradient(...t) {
    var i = ctx.createLinearGradient(0, 0, 0, cvs.height);
    i.addColorStop(0, t[0]);
    for (var s = 1; s < t.length; s++)
        i.addColorStop(s / (t.length - 1), t[s]);
    return i
}
function gradientColor(...t) {
    if (t.length % 2 == 1)
        return "#000000";
    for (var i = 0, s = []; i < t.length / 2; i++)
        for (var e = 0; e < t[2 * i + 1]; e++)
            s.push(t[2 * i]);
    return createGradient.apply(null, s)
}
window.addEventListener("resize", function(t) {
    window.cancelAnimationFrame(ANIMATION),
    startCanvas()
});
class Ocean {
    constructor(t, i, s, e, o, h, n, r, a) {
        this.waves = [];
        for (var d = 0; d < o; d++)
            this.waves.push(new Wave(t,i + d * s,e[d],h,n,r,a))
    }
    newWaveFrame() {
        ctx.clearRect(0, 0, cvs.width, cvs.height),
        ctx.fillStyle = "rgb(118, 157, 167)",
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        for (var t = 0; t < this.waves.length; t++)
            this.waves[t].updateNodes(),
            this.waves[t].rain.updateRain(),
            this.waves[t].drawWave(),
            this.waves[t].rain.drawRain();
        ANIMATION = window.requestAnimationFrame(this.newWaveFrame.bind(this))
    }
}
class Wave {
    constructor(t, i, s, e, o, h, n) {
        this.color = s,
        this.yCoord = i,
        this.nodeGap = t,
        this.nodes = this.createNodes(t),
        this.rain = new Rain(e,this.yCoord + waveHeight,o,h,this.color,n)
    }
    createNodes(t) {
        for (var i = function(t, i) {
            var s = Math.random();
            return s < t && (s += i),
            s
        }, s = 0, e = []; s <= cvs.width / t + 1; s++)
            e.push([t * s, this.yCoord + randNum(-1 * waveHeight, waveHeight, 1), Math.random() * (i(.4, .4) * SPEED * 2e3), i(.4, .4) * SPEED]);
        return e
    }
    drawNodes() {
        ctx.strokeStyle = "black";
        for (var t = 0; t < this.nodes.length; t++)
            ctx.beginPath(),
            ctx.arc(this.nodes[t][0], this.nodes[t][1], 4, 0, 2 * Math.PI),
            ctx.stroke()
    }
    updateNodes() {
        for (var t = 0; t < this.nodes.length; t++)
            0 != t && (this.nodes[t][0] = this.nodeGap / 3 * Math.cos(this.nodes[t][2] / 20) + this.nodeGap * t),
            this.nodes[t][1] = waveHeight / 2 * Math.sin(this.nodes[t][2] / 20) + this.yCoord,
            this.nodes[t][2] += this.nodes[t][3]
    }
    drawWave() {
        CANVAS_DEBUG && this.drawNodes(),
        ctx.fillStyle = this.color,
        ctx.beginPath(),
        ctx.moveTo(this.nodes[0][0], this.nodes[0][1]);
        for (var t = 0; t < this.nodes.length; t++) {
            if (this.nodes[t + 1])
                var i = this.nodes[t + 1][1];
            else
                i = this.nodes[t - 1][1];
            ctx.quadraticCurveTo(this.nodes[t][0], this.nodes[t][1], medianOf(this.nodes[t][0], this.nodes[t][0] + cvs.width / (this.nodes.length + 1)), medianOf(this.nodes[t][1], i))
        }
        ctx.lineTo(cvs.width, cvs.height),
        ctx.lineTo(0, cvs.height),
        ctx.closePath(),
        ctx.fill()
    }
}
class Rain {
    constructor(t, i, s, e, o, h) {
        this.dropsNeeded = t,
        this.yBound = i,
        this.dropLength = s,
        this.dropDirection = e,
        this.dropColor = o,
        this.dropIntensity = h,
        this.drops = [];
        for (var n = 0; n < this.dropsNeeded; n++)
            this.drops.push(new Raindrop(this.yBound - Math.random() * waveHeight,this.dropLength,this.dropDirection,this.dropColor,this.dropIntensity))
    }
    updateRain() {
        for (var t = 0, i = []; t < this.drops.length; t++)
            this.drops[t].updateDrop(),
            this.drops[t].pointA[1] <= this.drops[t].yGoal && this.drops[t].pointB[1] >= this.drops[t].yGoal && (this.drops[t].color = "white",
            this.drops[t].pointA = [medianOf(this.drops[t].pointA[0], this.drops[t].pointB[0]), this.drops[t].yGoal]),
            this.drops[t].finishedRoute && i.push(t);
        for (t = i.length - 1; t > -1; t--)
            this.drops.splice(i[t], 1);
        for (t = 0; t < i.length; t++)
            this.drops.push(new Raindrop(this.yBound - Math.random() * waveHeight,this.dropLength,this.dropDirection,this.dropColor,this.dropIntensity))
    }
    drawRain() {
        for (var t = 0; t < this.drops.length; t++)
            this.drops[t].drawDrop()
    }
}
class Raindrop {
    constructor(t, i, s, e, o) {
        this.xChange = i * Math.sin(s),
        this.yChange = -1 * i * Math.cos(s),
        this.yGoal = t,
        this.color = e,
        this.fallingSpeed = o,
        this.pointB = [randNum(0, 1.5 * cvs.width, 1), randNum(-.2 * cvs.height, this.yGoal, 0)],
        this.pointA = [this.pointB[0] - this.xChange, this.pointB[1] - this.yChange]
    }
    drawDrop() {
        ctx.beginPath(),
        ctx.strokeStyle = this.color,
        ctx.lineWidth = 2,
        ctx.moveTo(this.pointA[0], this.pointA[1]),
        ctx.lineTo(this.pointB[0], this.pointB[1]),
        ctx.stroke()
    }
    updateDrop() {
        var t = this.fallingSpeed * this.xChange
          , i = this.fallingSpeed * this.yChange;
        this.pointA = [this.pointA[0] + t, this.pointA[1] + i],
        this.pointB = [this.pointB[0] + t, this.pointB[1] + i]
    }
    get finishedRoute() {
        return this.pointA[1] > this.yGoal
    }
}