var Color = require('color')
var earstream = require('earstream')

var TAU = 2 * Math.PI
var N_POINTS = 120
var PALETTE = ['#E86AFF', '#8A65E8', '#658EFF', '#65CEE8', '#80FFD1']
  .map((hex) => Color(hex))

var xOrigin = window.innerWidth / 2
var yOrigin = window.innerHeight / 2

var es = earstream(N_POINTS)
var points = createPoints(2 * N_POINTS)

var bgColor = Color.rgb(22, 22, 22)

document.body.style.background = '#222'

points.forEach(function (point) {
  document.body.appendChild(point.el)
})

var cycleDuration = 10000

es.on('data', function (data) {
  var p = (Date.now() % cycleDuration) / cycleDuration
  var iPalette = p * PALETTE.length
  var colorStart = PALETTE[Math.floor(iPalette)]
  var colorEnd = PALETTE[Math.ceil(iPalette) % PALETTE.length]

  var pColor = iPalette - Math.floor(iPalette)
  var baseColor = colorStart.mix(colorEnd, pColor)

  data.norm.forEach(function (v, i) {
    var pointSiblings = [
      points[i],
      points[(N_POINTS * 2) - (i + 1)]
    ]

    var rotation = TAU * (Date.now() / 10000)

    pointSiblings.forEach(function (point) {
      var colorString = baseColor.mix(bgColor, 1 - v).round().string()

      point
        .setSize(v * 30)
        .setColor(colorString)
        .setPosition(rotation + point.theta, v * yOrigin)
    })
  })
})

function createPoints (nPoints) {
  return new Array(nPoints).fill(0).map(function (item, i) {
    var el = document.createElement('div')
    el.style.position = 'absolute'
    el.style.borderRadius = '50%'

    var point = {
      el: el,
      theta: (i / nPoints) * TAU,
      radius: 0,
      setSize: setSize,
      setColor: setPointColor,
      setPosition: setPointPosition
    }

    return point
  })
}

function setPointPosition (theta, radius) {
  var x = xOrigin + radius * Math.cos(theta)
  var y = yOrigin + radius * Math.sin(theta)
  this.el.style.left = x + 'px'
  this.el.style.top = y + 'px'
  return this
}

function setPointColor (color) {
  this.el.style.background = color
  return this
}

function setSize (size) {
  this.el.style.width = size + 'px'
  this.el.style.height = size + 'px'
  return this
}
