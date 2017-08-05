var Color = require('color')
var earstream = require('earstream')

var TAU = 2 * Math.PI
var N_POINTS = 120

var xOrigin = window.innerWidth / 2
var yOrigin = window.innerHeight / 2

var es = earstream(N_POINTS)
var points = createPoints(2 * N_POINTS)

document.body.style.background = '#222'

points.forEach(function (point) {
  document.body.appendChild(point.el)
})

es.on('data', function (data) {
  data.norm.forEach(function (v, i) {
    var pointSiblings = [
      points[i],
      points[(N_POINTS * 2) - (i + 1)]
    ]

    var rotation = TAU * (Date.now() / 10000)

    pointSiblings.forEach(function (point) {
      var colorString = Color.rgb(
        34 + v * 255,
        34 + v * 255,
        34 + v * 255
      ).round().string()

      point
        .setSize(v * 70)
        .setColor(colorString)
        .setPosition(rotation + point.theta, v * yOrigin)
    })
  })
})

function createPoints (nPoints) {
  return new Array(nPoints).fill(0).map(function (item, i) {
    var theta = (i / nPoints) * TAU
    var radius = 0

    var point = {
      el: document.createElement('div'),
      theta: theta,
      radius: radius,
      setSize: setSize,
      setColor: setPointColor,
      setPosition: setPointPosition
    }

    point.el.style.position = 'absolute'
    point.el.style.borderRadius = '50%'

    point.setPosition(theta, radius)

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
