var Color = require('color')
var earstream = require('earstream')

var MAX_SIZE = 50
var TAU = 2 * Math.PI
var N_POINTS = 20
// var PALETTE = ['#E86AFF', '#8A65E8', '#658EFF', '#65CEE8', '#80FFD1']
var PALETTE = ['#FF8B97', '#FFC1AA', '#C7CDE5', '#87BFE2', '#21A0D3']
  .map((hex) => Color(hex))

var xOrigin = window.innerWidth / 2
var yOrigin = window.innerHeight / 2

var es = earstream(N_POINTS)
var points = createPoints(2 * N_POINTS)

var bgColor = Color.rgb(0, 0, 0)
document.body.style.height = '100vh'

points.forEach(function (point) {
  document.body.appendChild(point.el)
})

var cycleDuration = 20000
var rotationDuration = 10000

es.on('data', renderSound)

function renderSound (soundData) {
  var p = (Date.now() % cycleDuration) / cycleDuration

  setBackgroundColor(p)

  soundData.norm.forEach(function (amp, i) {
    renderFrequency(amp, i, p)
  })
}

function renderFrequency (amp, i, p) {
  var rotation = TAU * (Date.now() / rotationDuration)

  var pointSiblings = [
    points[i],
    points[(N_POINTS * 2) - (i + 1)]
  ]

  pointSiblings.forEach(function (point) {
    var iPalette = ((i / N_POINTS) + p) % 1 * PALETTE.length

    point
      .setSize(amp * MAX_SIZE)
      .setColor(iPalette, amp)
      .setPosition(rotation + point.theta, amp * yOrigin)
  })
}

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

function setPointColor (iPalette, v) {
  var colorStart = PALETTE[Math.floor(iPalette)]
  var colorEnd = PALETTE[Math.ceil(iPalette) % PALETTE.length]

  var pColor = iPalette - Math.floor(iPalette)
  var baseColor = colorStart.mix(colorEnd, pColor)
  var colorString = baseColor.fade(1 - v).round().string()
  this.el.style.background = colorString
  return this
}

function setSize (size) {
  this.el.style.width = size + 'px'
  this.el.style.height = size + 'px'
  return this
}

function setBackgroundColor (p) {
  var colorTop = getPaletteColor(p)
    .mix(bgColor, 0.8)
    .string()

  var colorBottom = getPaletteColor(1 - p)
    .mix(bgColor, 0.8)
    .string()

  document.body.style.background = `linear-gradient(${colorTop}, ${colorBottom})`
}

function getPaletteColor (p) {
  var iPalette = p * PALETTE.length
  var colorStart = PALETTE[Math.floor(iPalette)]
  var colorEnd = PALETTE[Math.ceil(iPalette) % PALETTE.length]

  var pColor = iPalette - Math.floor(iPalette)

  return colorStart.mix(colorEnd, pColor)
}
