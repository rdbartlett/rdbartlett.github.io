(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var stateMgmt = require('./js/stateMgmt')
stateMgmt.init();

var rangesMgmt = require('./js/rangesMgmt')
rangesMgmt.init();

var ui = require('./js/ui')

var drawCanvas = require('./js/drawCanvas')
drawCanvas.setRoot();
drawCanvas.fromState();
window.addEventListener('resize', function() {
  drawCanvas.setRoot()
  drawCanvas.fromState();
});

var presets = require('./js/presets')
var keys = require('./js/keys')
var animate = require('./js/animate')

animate.sweep();

var slides = require('./js/slides')
slides.show(1)

},{"./js/animate":2,"./js/drawCanvas":3,"./js/keys":4,"./js/presets":5,"./js/rangesMgmt":6,"./js/slides":7,"./js/stateMgmt":8,"./js/ui":9}],2:[function(require,module,exports){
var stateMgmt = require('./stateMgmt')
var state = stateMgmt.get()
var rangesMgmt = require('./rangesMgmt')
var ranges = rangesMgmt.get()

var drawCanvas = require('./drawCanvas')

const attrs = [ 'quirkk', 'widthh', 'energy', 'repeat', 'tensor', 'yessss' ]

// If widthh is sweeping from 20 to 50 degrees and back to 20
// in a period of 10 frames,
// the delta is 6 degrees-per-frame [(50-20)/(10/2)].
// If quirkk is sweeping from 10-20 over 5 frames, the delta is 4.
//
//         0     1     2     3     4     5     6     7     8     9     10
// Frames: | - - | - - | - - | - - | - - | - - | - - | - - | - - | - - |
// Widthh: 20    26    32    38    44    50    44    38    32    26    20
// Quirkk: 10    14    18    18    14    10    14    18    18    14    10
//

var sweepTimer
var growing = {
  quirkk: true,
  widthh: true,
  energy: true,
  repeat: true,
  tensor: true,
  yessss: true
}

function sweep(){
  sweepTimer = setInterval(function(){ nextFrame() }, 200/state.urgncy)
}

function resetSweep(){
  clearTimeout(sweepTimer)
  sweep()
}

var bounds = {
  energy: {min: 0, max: 100},
  repeat: {min: 0, max: 300},
  tensor: {min: 0, max: 999},
  yessss: {min: 0, max: 16},
  urgncy: {min: 1, max: 100}
}


function LTMax(attr){ return (state[attr] + 1 <= bounds[attr].max) }
function GTMin(attr){ return (state[attr] - 1 >= bounds[attr].min) }
function LTTop(attr){ return (state[attr] < ranges[attr].center + ranges[attr].amplitude) }
function GTBot(attr){ return (state[attr] > ranges[attr].center - ranges[attr].amplitude) }
function grow(attr){   stateMgmt.inc(attr, deltas[attr]) }
function shrink(attr){ stateMgmt.dec(attr, deltas[attr]) }

function shouldGrow(attr){
  if(bounds[attr]) return LTTop(attr) && LTMax(attr)
  else return LTTop(attr)
}

function shouldShrink(attr){
  if(bounds[attr]) return GTBot(attr) && GTMin(attr)
  else return GTBot(attr)
}

function nextFrame(){
  state = stateMgmt.get()
  deltas = rangesMgmt.getDeltas()

  attrs.forEach(function(attr){
    if(growing[attr]){
      if(shouldGrow(attr)){
        if(bounds[attr] && LTMax(attr)) grow(attr)
        else grow(attr)
      } else growing[attr] = !growing[attr]
    }
    else{
      if(shouldShrink(attr)){
        if(bounds[attr] && GTMin(attr)) shrink(attr)
        else shrink(attr)
      } else growing[attr] = !growing[attr]
    }
  });

  if(state.orbitt) stateMgmt.inc('angle', 1);

  drawCanvas.fromState();
}

playing = false

function playOrPause(){
  if(!playing) {
    playing = !playing
    resetSweep()
  }
  else {
    playing = !playing
    clearTimeout(sweepTimer)
  }
}

function pause(){
  playing = false
  clearTimeout(sweepTimer)
}

function play(){
  playing = true
  resetSweep()
}

module.exports = {sweep, resetSweep, playOrPause, playing, play, pause}

},{"./drawCanvas":3,"./rangesMgmt":6,"./stateMgmt":8}],3:[function(require,module,exports){
var stateMgmt = require('./stateMgmt')
var state
var rangesMgmt = require('./rangesMgmt')
var ranges = rangesMgmt.get()
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
const deg_to_rad = Math.PI / 180.0;
var rootX
var rootY

function setRoot(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  rootX = canvas.width / 2;
  rootY = canvas.height / 2;
}

function fromState(){
  state = stateMgmt.get();
  var rgb = 'rgb(' + state.red + ', ' + state.green + ', ' + state.blue + ')'
  context.fillStyle = rgb
  context.strokeStyle = rgb
  context.globalAlpha = state.energy / 100;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = state.lineWidth;
  context.beginPath();
  treeIteration = 0;
  drawReflectedTrees(rootX, rootY, state.angle, Number(state.yessss.toFixed(0)))
  context.closePath();
  context.stroke();
}

function updateStateWithRanges(){
  stateMgmt.set('quirkk', ranges.quirkk.center)
  stateMgmt.set('widthh', ranges.widthh.center)
  stateMgmt.set('energy', ranges.energy.center)
  stateMgmt.set('repeat', ranges.repeat.center)
  stateMgmt.set('tensor', ranges.tensor.center)
  stateMgmt.set('yessss', ranges.yessss.center)
}

function drawReflectedTrees(x1, y1, angle, depth){
  while (Number(state.repeat.toFixed(0)) - treeIteration !== 0) {
    drawTree(x1, y1, angle, depth);
    treeIteration++;
  }
}

function drawTree(x1, y1, angle, depth){
  var mirrorAngle = treeIteration/state.repeat * (2 * Math.PI)
  if (depth !== 0){
    var x2 = x1 + (Math.cos(angle * deg_to_rad + mirrorAngle) * depth * state.tensor);
    var y2 = y1 + (Math.sin(angle * deg_to_rad + mirrorAngle) * depth * state.tensor);
    drawLine(x1, y1, x2, y2, depth);
    drawTree(x2, y2, (angle + state.widthh + state.quirkk), depth - 1);
    drawTree(x2, y2, (angle - state.widthh), depth - 1);
  }
}

function drawLine(x1, y1, x2, y2){
  context.moveTo(x1, y1);
  if(state.points){
    pointSize = state.pointSize
    context.fillRect(x2 - pointSize/2, y2 - pointSize/2, pointSize, pointSize)
  }
  else{
    context.lineTo(x2, y2)
  }
}


module.exports = {
  setRoot, fromState, updateStateWithRanges
}
},{"./rangesMgmt":6,"./stateMgmt":8}],4:[function(require,module,exports){
var Mousetrap = require('mousetrap')
var ui = require('./ui')
var stateMgmt = require('./stateMgmt')
var state = stateMgmt.get()
var rangesMgmt = require('./rangesMgmt')
var ranges
var attrs = rangesMgmt.attrs
var drawCanvas = require('./drawCanvas')
var animate = require('./animate')
var presets = require('./presets')
var slides = require('./slides')

Mousetrap.bind('1', function() { presets.load(0) });
Mousetrap.bind('2', function() { presets.load(1) });
Mousetrap.bind('3', function() { presets.load(2) });
Mousetrap.bind('4', function() { presets.load(3) });
Mousetrap.bind('5', function() { presets.load(4) });
Mousetrap.bind('6', function() { presets.load(5) });
Mousetrap.bind('7', function() { presets.load(6) });
Mousetrap.bind('8', function() { presets.load(7) });
Mousetrap.bind('9', function() { presets.load(8) });
Mousetrap.bind('0', function() { presets.load(9) });

Mousetrap.bind('a',  function() { if(state.modeIndex > 0) stateMgmt.set('modeIndex', state.modeIndex-1) })
Mousetrap.bind('z',  function() { if(state.modeIndex < 7) stateMgmt.set('modeIndex', state.modeIndex+1) })

Mousetrap.bind('q', function() { stateMgmt.set('modeIndex', 0); ui.updateModeSelection(state) })
Mousetrap.bind('w', function() { stateMgmt.set('modeIndex', 1); ui.updateModeSelection(state) })
Mousetrap.bind('e', function() { stateMgmt.set('modeIndex', 2); ui.updateModeSelection(state) })
Mousetrap.bind('r', function() { stateMgmt.set('modeIndex', 3); ui.updateModeSelection(state) })
Mousetrap.bind('t', function() { stateMgmt.set('modeIndex', 4); ui.updateModeSelection(state) })
Mousetrap.bind('y', function() { stateMgmt.set('modeIndex', 5); ui.updateModeSelection(state) })
Mousetrap.bind('h', function() { stateMgmt.set('modeIndex', 6); ui.updateModeSelection(state) })
Mousetrap.bind('u', function() { stateMgmt.set('modeIndex', 7); ui.updateModeSelection(state) })

Mousetrap.bind('j',  incState)
Mousetrap.bind('n',  decState)
Mousetrap.bind('k',  incSwing)
Mousetrap.bind('m',  decSwing)
Mousetrap.bind('l',  incFreq)
Mousetrap.bind(',',  decFreq)

function incState(){
  if (stateMgmt.mode() == 'urgncy') {
    stateMgmt.inc('urgncy', 1)
    animate.resetSweep()
  } else if (stateMgmt.mode() == 'huuuue'){
    stateMgmt.inc('red', 5)
    ui.updateRed(state)
  } else {
    rangesMgmt.inc(stateMgmt.mode(), 'center', 1)
    drawCanvas.updateStateWithRanges()
    drawCanvas.fromState()
  }
}

function decState(){
  if (stateMgmt.mode() == 'urgncy') {
    stateMgmt.dec('urgncy', 1)
    animate.resetSweep()
  } else if (stateMgmt.mode() == 'huuuue'){
    stateMgmt.dec('red', 5)
    ui.updateRed(state)
  } else {
    rangesMgmt.dec(stateMgmt.mode(), 'center', 1)
    drawCanvas.updateStateWithRanges()
    drawCanvas.fromState()
  }
}

function incSwing(){
  if (stateMgmt.mode() == 'urgncy') return
  else if (stateMgmt.mode() == 'huuuue') {
    stateMgmt.inc('green', 5)
    ui.updateGreen(state)
  } else {
    rangesMgmt.inc(stateMgmt.mode(), 'amplitude', 1)
    drawCanvas.updateStateWithRanges()
    drawCanvas.fromState()
  }
}

function decSwing(){
  if (stateMgmt.mode() == 'urgncy') return
  else if (stateMgmt.mode() == 'huuuue') {
    stateMgmt.dec('green', 5)
    ui.updateGreen(state)
  } else {
    rangesMgmt.dec(stateMgmt.mode(), 'amplitude', 1)
    drawCanvas.updateStateWithRanges()
    drawCanvas.fromState()
  }
}

function incFreq(){
  if (stateMgmt.mode() == 'huuuue') {
    stateMgmt.inc('blue', 5)
    ui.updateBlue(state)
  } else if (stateMgmt.mode() != 'urgncy') rangesMgmt.inc(stateMgmt.mode(), 'freq', 1)
}

function decFreq(){
  if (stateMgmt.mode() == 'huuuue') {
    stateMgmt.dec('blue', 5)
    ui.updateBlue(state)
  } else if (stateMgmt.mode() != 'urgncy') rangesMgmt.dec(stateMgmt.mode(), 'freq', 1)
}

Mousetrap.bind('i', function() { toggleControls() });
Mousetrap.bind('o', function() { toggle('orbitt') });
Mousetrap.bind('p', function() { toggle('points') });


Mousetrap.bind('space', animate.playOrPause);

// add bounds
Mousetrap.bind('down', slides.next);
Mousetrap.bind('up', slides.prev);
Mousetrap.bind('right', slides.last);


function toggle(attr){
  state = stateMgmt.get()
  if(state[attr]) stateMgmt.set(attr, false)
  else stateMgmt.set(attr, true)
  drawCanvas.fromState()
}

showingControls = true

function toggleControls(){
  if(showingControls) {
    showingControls = !showingControls
    document.getElementById('stateReader').style.display = 'none'
  }
  else {
    showingControls = !showingControls
    document.getElementById('stateReader').style.display = 'block'
  }
}
},{"./animate":2,"./drawCanvas":3,"./presets":5,"./rangesMgmt":6,"./slides":7,"./stateMgmt":8,"./ui":9,"mousetrap":10}],5:[function(require,module,exports){
var stateMgmt = require('./stateMgmt')
var rangesMgmt = require('./rangesMgmt')
var drawCanvas = require('./drawCanvas')
var ui = require('./ui')


var presets = [
    {repeat: 1,  yessss: 7,  widthh: 19,  tensor: 12, quirkk: 7,   energy: 100}
  , {repeat: 2,  yessss: 9,  widthh: 44,  tensor: 6,  quirkk: -26, energy: 100}
  , {repeat: 6,  yessss: 14, widthh: 60,  tensor: 20, quirkk: 0,   energy: 15}
  , {repeat: 5,  yessss: 9,  widthh: 180, tensor: 20, quirkk: -60, energy: 25}
  , {repeat: 6,  yessss: 9,  widthh: 60,  tensor: 8,  quirkk: 0,   energy: 60}
  , {repeat: 16, yessss: 13, widthh: 60,  tensor: 13, quirkk: 0,   energy: 20}
  , {repeat: 3,  yessss: 7,  widthh: 6,   tensor: 4,  quirkk: -90, energy: 80}
  , {repeat: 4,  yessss: 10, widthh: 45,  tensor: 8,  quirkk: 90,  energy: 40}
  , {repeat: 7,  yessss: 11, widthh: 90,  tensor: 13, quirkk: 0,   energy: 50}
  , {repeat: 9,  yessss: 9,  widthh: 30,  tensor: 10, quirkk: 0,   energy: 100}

  , {repeat: 1,  yessss: 2,  widthh: 30,  tensor: 40, quirkk: 0,   energy: 100}
  , {repeat: 1,  yessss: 3,  widthh: 30,  tensor: 27, quirkk: 0,   energy: 100}
  , {repeat: 1,  yessss: 6,  widthh: 30,  tensor: 13, quirkk: 0,   energy: 100}
  , {repeat: 1,  yessss: 6,  widthh: 60,  tensor: 13, quirkk: 0,   energy: 100}
  , {repeat: 2,  yessss: 6,  widthh: 60,  tensor: 13, quirkk: 0,   energy: 100}
  , {repeat: 2,  yessss: 6,  widthh: 60,  tensor: 13, quirkk: 30,   energy: 100}
  , {repeat: 2,  yessss: 6,  widthh: 60,  tensor: 5, quirkk: 30,   energy: 100}
  , {repeat: 2,  yessss: 6,  widthh: 60,  tensor: 5, quirkk: 30,   energy: 75}
  , {repeat: 6,  yessss: 10,  widthh: 60,  tensor: 10, quirkk: -60,  energy: 75}


]

function load(index){
  var newState = presets[index]
  rangesMgmt.set('quirkk', 'center', newState.quirkk)
  rangesMgmt.set('widthh', 'center', newState.widthh)
  rangesMgmt.set('energy', 'center', newState.energy)
  rangesMgmt.set('repeat', 'center', newState.repeat)
  rangesMgmt.set('tensor', 'center', newState.tensor)
  rangesMgmt.set('yessss', 'center', newState.yessss)
  stateMgmt.set('quirkk', newState.quirkk)
  stateMgmt.set('widthh', newState.widthh)
  stateMgmt.set('energy', newState.energy)
  stateMgmt.set('repeat', newState.repeat)
  stateMgmt.set('tensor', newState.tensor)
  stateMgmt.set('yessss', newState.yessss)
  drawCanvas.fromState()

  state = stateMgmt.get()
  if(state.tutorial) ui.updateTutorialSlideWithState(state)
}

module.exports = { presets, load }
},{"./drawCanvas":3,"./rangesMgmt":6,"./stateMgmt":8,"./ui":9}],6:[function(require,module,exports){
var ui = require('./ui')

var ranges = {}

const attrs = [ 'quirkk', 'widthh', 'energy', 'repeat', 'tensor', 'yessss' ]

function init(){
  ranges = {
    quirkk: {center: 0 , amplitude: 0 , freq: 1},
    widthh: {center: 0 , amplitude: 180, freq: 1},
    energy: {center: 100 , amplitude: 0 , freq: 1},
    repeat: {center: 1 , amplitude: 0, freq: 1},
    tensor: {center: 10 , amplitude: 0 , freq: 1},
    yessss: {center: 8 , amplitude: 0 , freq: 1}
  }

  attrs.forEach(function(attr){
    updateDeltas(attr)
    ui.updateRange(attr, ranges[attr])
  })

  return ranges
}

var deltas = []


function updateDeltas(attr){
  if (ranges[attr].freq > 0){
    deltas[attr] = ranges[attr].amplitude * ranges[attr].freq / 100
  }
  else deltas[attr] = 0

  return deltas
}

function getDeltas(){
  return deltas
}

function get(){
  return ranges
}

function set(attr, key, to){
  ranges[attr][key] = to
}


var bounds = {
  energy: {min: 0, max: 100},
  repeat: {min: 0, max: 300},
  tensor: {min: 0, max: 999},
  yessss: {min: 0, max: 16},
  urgncy: {min: 1, max: 100}
}

function inc(attr, key, by){
  // only increment the attribute if it is not at maximum
  if(bounds[attr]){
    if((ranges[attr][key] + by) <= bounds[attr].max){
      ranges[attr][key] += by
    }
  }
  else{ ranges[attr][key] += by }
  updateDeltas(attr)
  ui.updateRange(attr, ranges[attr])
}

function dec(attr, key, by){
  // only decrement the attribute if it is not at minimum
  if(bounds[attr]){
    if((ranges[attr][key] - by) >= bounds[attr].min){
      ranges[attr][key] -= by
    }
  }
  else{ ranges[attr][key] -= by }
  updateDeltas(attr)
  ui.updateRange(attr, ranges[attr])
}

module.exports = { init, get, inc, dec, getDeltas, attrs, set }
},{"./ui":9}],7:[function(require,module,exports){
var animate = require('./animate')
var presets = require('./presets')

var i = 0;

function hide(){
  parent = document.getElementById('slides')
  Array.prototype.forEach.call(parent.children, child => {
    child.style.display = 'none'
  })
}

function show(index){
  hide()
  i = index
  if(d = document.getElementById('slide-' + index))
    d.style.display = 'block'

  console.log("slide: " + index)

  switch(index){
    case 2:
      animate.pause()
      break
    case 3:
      presets.load(10)
      break
    case 4:
      presets.load(11)
      break
    case 5:
      presets.load(12)
      break
    case 6:
      presets.load(13)
      break
    case 9:
      presets.load(14)
      break
    case 10:
      presets.load(15)
      break
    case 11:
      presets.load(16)
      break
    case 12:
      document.getElementById("tutorialState").style.display = "none"
      presets.load(17)
      break
    case 13:
      document.getElementById("tutorialState").style.display = "block"
      presets.load(18)
      break
    case 15:
      document.getElementById("tutorialState").style.display = "block"

      document.getElementById("slides-container").style.display = "block"
      document.getElementById("stateReader").style.display = "none"
      break
    case 16:
      document.getElementById("stateReader").style.display = "block"

      d = document.getElementsByClassName("phase2")
      for(var j = 0; j < d.length; j++) d[j].style.visibility = "hidden"

      document.getElementById("tutorialState").style.display = "none"
      break
    case 17:
      document.getElementById("slides-container").style.display = "none"
      break
    case 18:
      document.getElementById("slides-container").style.display = "block"

      d = document.getElementsByClassName("phase2")
      for(var j = 0; j < d.length; j++) d[j].style.visibility = "visible"

      animate.play()
      break
    case 19:
      document.getElementById("slides-container").style.display = "none"
      break
  }

}

function next(){
  i++
  show(i)
}

function prev(){
  i--
  show(i)
}

function last(){
  show(19)
}

module.exports = {show, next, prev, last}
},{"./animate":2,"./presets":5}],8:[function(require,module,exports){
var ui = require('./ui')

var state = {}

function init(){
  state = {
    quirkk: 0, widthh: 180, energy: 30, repeat: 16, tensor: 13, yessss: 10,
    angle: 90, pointSize: 2, lineWidth: 1,
    points: false, orbitt: false, urgncy: 2,
    red: 255, green: 0, blue: 150,
    modes: ['quirkk', 'widthh', 'energy', 'repeat', 'tensor', 'yessss', 'huuuue', 'urgncy'],
    modeIndex: 0,
    tutorial: true
  }
  ui.updateState(state)
  return state
}

var bounds = {
  energy: {min: 0, max: 100},
  repeat: {min: 0, max: 300},
  tensor: {min: 0, max: 999},
  yessss: {min: 0, max: 16},
  urgncy: {min: 1, max: 100},
  red: {min: 0, max: 255},
  green: {min: 0, max: 255},
  blue: {min: 0, max: 255}
}

function mode(){
  return state.modes[state.modeIndex]
}

function get(){
  return state
}

function set(attr, to){
  state[attr] = to
  ui.updateState(state)
  if(attr = 'modeIndex') ui.updateModeSelection(state)
}

function inc(attr, by){
  // only increment the attribute if it is not at maximum
  if(bounds[attr]){
    if((state[attr] + by) <= bounds[attr].max){
      state[attr] += by
    }
  }
  else{ state[attr] += by }
  ui.updateState(state)
}

function dec(attr, by){
  // only decrement the attribute if it is not at maximum
  if(bounds[attr]){
    if((state[attr] - by) >= bounds[attr].min){
      state[attr] -= by
    }
  }
  else{ state[attr] -= by }
  ui.updateState(state)
}


module.exports = { init, get, set, inc, dec, mode}

},{"./ui":9}],9:[function(require,module,exports){
function updateState(state){
  document.getElementById('quirkkState').textContent = state.quirkk.toFixed(2);
  document.getElementById('widthhState').textContent = state.widthh.toFixed(2);
  document.getElementById('energyState').textContent = state.energy.toFixed(2);
  document.getElementById('repeatState').textContent = state.repeat.toFixed(0);
  document.getElementById('tensorState').textContent = state.tensor.toFixed(2);
  document.getElementById('yessssState').textContent = state.yessss.toFixed(0);
  document.getElementById('orbittState').textContent = state.orbitt.toString();
  document.getElementById('pointsState').textContent = state.points.toString();
  document.getElementById('urgncyState').textContent = state.urgncy.toString();
}


function updateRed(state){
  document.getElementById('huuuueRed').textContent = state.red;
}
function updateGreen(state){
  document.getElementById('huuuueGreen').textContent = state.green;
}
function updateBlue(state){
  document.getElementById('huuuueBlue').textContent = state.blue;
}


function updateModeSelection(state){
  state.modes.forEach(function(attr){ document.getElementById(attr + 'UI').className = "" })
  document.getElementById(state.modes[state.modeIndex] + 'UI').className = "selected"
}

function updateRange(attr, vals){
  document.getElementById(attr + 'Amplitude').textContent = vals.amplitude.toFixed(2);
  document.getElementById(attr + 'Period').textContent = vals.freq.toFixed(2);
}

function updateTutorialSlideWithState(state){
  document.getElementById('tutorialQuirkkState').textContent = state.quirkk.toFixed(2);
  document.getElementById('tutorialWidthhState').textContent = state.widthh.toFixed(2);
  document.getElementById('tutorialEnergyState').textContent = state.energy.toFixed(2);
  document.getElementById('tutorialRepeatState').textContent = state.repeat.toFixed(0);
  document.getElementById('tutorialTensorState').textContent = state.tensor.toFixed(2);
  document.getElementById('tutorialYessssState').textContent = state.yessss.toFixed(0);
}

module.exports = {
  updateState, updateRange, updateModeSelection, updateRed, updateGreen, updateBlue, updateTutorialSlideWithState
}
},{}],10:[function(require,module,exports){
/*global define:false */
/**
 * Copyright 2012-2017 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.6.1
 * @url craig.is/killing/mice
 */
(function(window, document, undefined) {

    // Check if mousetrap is used inside browser, if not, return
    if (!window) {
        return;
    }

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta'
    };

    /**
     * mapping for special characters so they can support
     *
     * this dictionary is only used incase you want to bind a
     * keyup or keydown event to one of these keys
     *
     * @type {Object}
     */
    var _KEYCODE_MAP = {
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111 : '/',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: '\''
    };

    /**
     * this is a mapping of keys that require shift on a US keypad
     * back to the non shift equivelents
     *
     * this is so you can use keyup events with these keys
     *
     * note that this will only work reliably on US keyboards
     *
     * @type {Object}
     */
    var _SHIFT_MAP = {
        '~': '`',
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '_': '-',
        '+': '=',
        ':': ';',
        '\"': '\'',
        '<': ',',
        '>': '.',
        '?': '/',
        '|': '\\'
    };

    /**
     * this is a list of special strings you can use to map
     * to modifier keys when you specify your keyboard shortcuts
     *
     * @type {Object}
     */
    var _SPECIAL_ALIASES = {
        'option': 'alt',
        'command': 'meta',
        'return': 'enter',
        'escape': 'esc',
        'plus': '+',
        'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
    };

    /**
     * variable to store the flipped version of _MAP from above
     * needed to check if we should use keypress or not when no action
     * is specified
     *
     * @type {Object|undefined}
     */
    var _REVERSE_MAP;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {

        // This needs to use a string cause otherwise since 0 is falsey
        // mousetrap will never fire for numpad 0 pressed as part of a keydown
        // event.
        //
        // @see https://github.com/ccampbell/mousetrap/pull/258
        _MAP[i + 96] = i.toString();
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }

        object.attachEvent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            var character = String.fromCharCode(e.which);

            // if the shift key is not pressed then it is safe to assume
            // that we want the character to be lowercase.  this means if
            // you accidentally have caps lock on then your key bindings
            // will continue to work
            //
            // the only side effect that might not be desired is if you
            // bind something like 'A' cause you want to trigger an
            // event when capital A is pressed caps lock will no longer
            // trigger the event.  shift+a will though.
            if (!e.shiftKey) {
                character = character.toLowerCase();
            }

            return character;
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map

        // with keydown and keyup events the character seems to always
        // come in as an uppercase character whether you are pressing shift
        // or not.  we should make sure it is always lowercase for comparisons
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * prevents default for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            return;
        }

        e.returnValue = false;
    }

    /**
     * stops propogation for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            return;
        }

        e.cancelBubble = true;
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * Converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {Array}
     */
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }

        combination = combination.replace(/\+{2}/g, '+plus');
        return combination.split('+');
    }

    /**
     * Gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {Object}
     */
    function _getKeyInfo(combination, action) {
        var keys;
        var key;
        var i;
        var modifiers = [];

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }

    function _belongsTo(element, ancestor) {
        if (element === null || element === document) {
            return false;
        }

        if (element === ancestor) {
            return true;
        }

        return _belongsTo(element.parentNode, ancestor);
    }

    function Mousetrap(targetElement) {
        var self = this;

        targetElement = targetElement || document;

        if (!(self instanceof Mousetrap)) {
            return new Mousetrap(targetElement);
        }

        /**
         * element to attach key events to
         *
         * @type {Element}
         */
        self.target = targetElement;

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        self._callbacks = {};

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        self._directMap = {};

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        var _sequenceLevels = {};

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        var _resetTimer;

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        var _ignoreNextKeyup = false;

        /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
        var _ignoreNextKeypress = false;

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        var _nextExpectedAction = false;

        /**
         * resets all sequence counters except for the ones passed in
         *
         * @param {Object} doNotReset
         * @returns void
         */
        function _resetSequences(doNotReset) {
            doNotReset = doNotReset || {};

            var activeSequences = false,
                key;

            for (key in _sequenceLevels) {
                if (doNotReset[key]) {
                    activeSequences = true;
                    continue;
                }
                _sequenceLevels[key] = 0;
            }

            if (!activeSequences) {
                _nextExpectedAction = false;
            }
        }

        /**
         * finds all callbacks that match based on the keycode, modifiers,
         * and action
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event|Object} e
         * @param {string=} sequenceName - name of the sequence we are looking for
         * @param {string=} combination
         * @param {number=} level
         * @returns {Array}
         */
        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
            var i;
            var callback;
            var matches = [];
            var action = e.type;

            // if there are no events related to this keycode
            if (!self._callbacks[character]) {
                return [];
            }

            // if a modifier key is coming up on its own we should allow it
            if (action == 'keyup' && _isModifier(character)) {
                modifiers = [character];
            }

            // loop through all callbacks for the key that was pressed
            // and see if any of them match
            for (i = 0; i < self._callbacks[character].length; ++i) {
                callback = self._callbacks[character][i];

                // if a sequence name is not specified, but this is a sequence at
                // the wrong level then move onto the next match
                if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                    continue;
                }

                // if the action we are looking for doesn't match the action we got
                // then we should keep going
                if (action != callback.action) {
                    continue;
                }

                // if this is a keypress event and the meta key and control key
                // are not pressed that means that we need to only look at the
                // character, otherwise check the modifiers as well
                //
                // chrome will not fire a keypress if meta or control is down
                // safari will fire a keypress if meta or meta+shift is down
                // firefox will fire a keypress if meta or control is down
                if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                    // when you bind a combination or sequence a second time it
                    // should overwrite the first one.  if a sequenceName or
                    // combination is specified in this call it does just that
                    //
                    // @todo make deleting its own method?
                    var deleteCombo = !sequenceName && callback.combo == combination;
                    var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                    if (deleteCombo || deleteSequence) {
                        self._callbacks[character].splice(i, 1);
                    }

                    matches.push(callback);
                }
            }

            return matches;
        }

        /**
         * actually calls the callback function
         *
         * if your callback function returns false this will use the jquery
         * convention - prevent default and stop propogation on the event
         *
         * @param {Function} callback
         * @param {Event} e
         * @returns void
         */
        function _fireCallback(callback, e, combo, sequence) {

            // if this event should not happen stop here
            if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
                return;
            }

            if (callback(e, combo) === false) {
                _preventDefault(e);
                _stopPropagation(e);
            }
        }

        /**
         * handles a character key event
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event} e
         * @returns void
         */
        self._handleKey = function(character, modifiers, e) {
            var callbacks = _getMatches(character, modifiers, e);
            var i;
            var doNotReset = {};
            var maxLevel = 0;
            var processedSequenceCallback = false;

            // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
            for (i = 0; i < callbacks.length; ++i) {
                if (callbacks[i].seq) {
                    maxLevel = Math.max(maxLevel, callbacks[i].level);
                }
            }

            // loop through matching callbacks for this key event
            for (i = 0; i < callbacks.length; ++i) {

                // fire for all sequence callbacks
                // this is because if for example you have multiple sequences
                // bound such as "g i" and "g t" they both need to fire the
                // callback for matching g cause otherwise you can only ever
                // match the first one
                if (callbacks[i].seq) {

                    // only fire callbacks for the maxLevel to prevent
                    // subsequences from also firing
                    //
                    // for example 'a option b' should not cause 'option b' to fire
                    // even though 'option b' is part of the other sequence
                    //
                    // any sequences that do not match here will be discarded
                    // below by the _resetSequences call
                    if (callbacks[i].level != maxLevel) {
                        continue;
                    }

                    processedSequenceCallback = true;

                    // keep a list of which sequences were matches for later
                    doNotReset[callbacks[i].seq] = 1;
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                    continue;
                }

                // if there were no sequence matches but we are still here
                // that means this is a regular match so we should fire that
                if (!processedSequenceCallback) {
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
                }
            }

            // if the key you pressed matches the type of sequence without
            // being a modifier (ie "keyup" or "keypress") then we should
            // reset all sequences that were not matched by this event
            //
            // this is so, for example, if you have the sequence "h a t" and you
            // type "h e a r t" it does not match.  in this case the "e" will
            // cause the sequence to reset
            //
            // modifier keys are ignored because you can have a sequence
            // that contains modifiers such as "enter ctrl+space" and in most
            // cases the modifier key will be pressed before the next key
            //
            // also if you have a sequence such as "ctrl+b a" then pressing the
            // "b" key will trigger a "keypress" and a "keydown"
            //
            // the "keydown" is expected when there is a modifier, but the
            // "keypress" ends up matching the _nextExpectedAction since it occurs
            // after and that causes the sequence to reset
            //
            // we ignore keypresses in a sequence that directly follow a keydown
            // for the same character
            var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
            if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
                _resetSequences(doNotReset);
            }

            _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
        };

        /**
         * handles a keydown event
         *
         * @param {Event} e
         * @returns void
         */
        function _handleKeyEvent(e) {

            // normalize e.which for key events
            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
            if (typeof e.which !== 'number') {
                e.which = e.keyCode;
            }

            var character = _characterFromEvent(e);

            // no character found then stop
            if (!character) {
                return;
            }

            // need to use === for the character check because the character can be 0
            if (e.type == 'keyup' && _ignoreNextKeyup === character) {
                _ignoreNextKeyup = false;
                return;
            }

            self.handleKey(character, _eventModifiers(e), e);
        }

        /**
         * called to set a 1 second timeout on the specified sequence
         *
         * this is so after each key press in the sequence you have 1 second
         * to press the next key before you have to start over
         *
         * @returns void
         */
        function _resetSequenceTimer() {
            clearTimeout(_resetTimer);
            _resetTimer = setTimeout(_resetSequences, 1000);
        }

        /**
         * binds a key sequence to an event
         *
         * @param {string} combo - combo specified in bind call
         * @param {Array} keys
         * @param {Function} callback
         * @param {string=} action
         * @returns void
         */
        function _bindSequence(combo, keys, callback, action) {

            // start off by adding a sequence level record for this combination
            // and setting the level to 0
            _sequenceLevels[combo] = 0;

            /**
             * callback to increase the sequence level for this sequence and reset
             * all other sequences that were active
             *
             * @param {string} nextAction
             * @returns {Function}
             */
            function _increaseSequence(nextAction) {
                return function() {
                    _nextExpectedAction = nextAction;
                    ++_sequenceLevels[combo];
                    _resetSequenceTimer();
                };
            }

            /**
             * wraps the specified callback inside of another function in order
             * to reset all sequence counters as soon as this sequence is done
             *
             * @param {Event} e
             * @returns void
             */
            function _callbackAndReset(e) {
                _fireCallback(callback, e, combo);

                // we should ignore the next key up if the action is key down
                // or keypress.  this is so if you finish a sequence and
                // release the key the final key will not trigger a keyup
                if (action !== 'keyup') {
                    _ignoreNextKeyup = _characterFromEvent(e);
                }

                // weird race condition if a sequence ends with the key
                // another sequence begins with
                setTimeout(_resetSequences, 10);
            }

            // loop through keys one at a time and bind the appropriate callback
            // function.  for any key leading up to the final one it should
            // increase the sequence. after the final, it should reset all sequences
            //
            // if an action is specified in the original bind call then that will
            // be used throughout.  otherwise we will pass the action that the
            // next key in the sequence should match.  this allows a sequence
            // to mix and match keypress and keydown events depending on which
            // ones are better suited to the key provided
            for (var i = 0; i < keys.length; ++i) {
                var isFinal = i + 1 === keys.length;
                var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
                _bindSingle(keys[i], wrappedCallback, action, combo, i);
            }
        }

        /**
         * binds a single keyboard combination
         *
         * @param {string} combination
         * @param {Function} callback
         * @param {string=} action
         * @param {string=} sequenceName - name of sequence if part of sequence
         * @param {number=} level - what part of the sequence the command is
         * @returns void
         */
        function _bindSingle(combination, callback, action, sequenceName, level) {

            // store a direct mapped reference for use with Mousetrap.trigger
            self._directMap[combination + ':' + action] = callback;

            // make sure multiple spaces in a row become a single space
            combination = combination.replace(/\s+/g, ' ');

            var sequence = combination.split(' ');
            var info;

            // if this pattern is a sequence of keys then run through this method
            // to reprocess each pattern one key at a time
            if (sequence.length > 1) {
                _bindSequence(combination, sequence, callback, action);
                return;
            }

            info = _getKeyInfo(combination, action);

            // make sure to initialize array if this is the first time
            // a callback is added for this key
            self._callbacks[info.key] = self._callbacks[info.key] || [];

            // remove an existing match if there is one
            _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

            // add this call back to the array
            // if it is a sequence put it at the beginning
            // if not put it at the end
            //
            // this is important because the way these are processed expects
            // the sequence ones to come first
            self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
                callback: callback,
                modifiers: info.modifiers,
                action: info.action,
                seq: sequenceName,
                level: level,
                combo: combination
            });
        }

        /**
         * binds multiple combinations to the same callback
         *
         * @param {Array} combinations
         * @param {Function} callback
         * @param {string|undefined} action
         * @returns void
         */
        self._bindMultiple = function(combinations, callback, action) {
            for (var i = 0; i < combinations.length; ++i) {
                _bindSingle(combinations[i], callback, action);
            }
        };

        // start!
        _addEvent(targetElement, 'keypress', _handleKeyEvent);
        _addEvent(targetElement, 'keydown', _handleKeyEvent);
        _addEvent(targetElement, 'keyup', _handleKeyEvent);
    }

    /**
     * binds an event to mousetrap
     *
     * can be a single key, a combination of keys separated with +,
     * an array of keys, or a sequence of keys separated by spaces
     *
     * be sure to list the modifier keys first to make sure that the
     * correct key ends up getting bound (the last key in the pattern)
     *
     * @param {string|Array} keys
     * @param {Function} callback
     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
     * @returns void
     */
    Mousetrap.prototype.bind = function(keys, callback, action) {
        var self = this;
        keys = keys instanceof Array ? keys : [keys];
        self._bindMultiple.call(self, keys, callback, action);
        return self;
    };

    /**
     * unbinds an event to mousetrap
     *
     * the unbinding sets the callback function of the specified key combo
     * to an empty function and deletes the corresponding key in the
     * _directMap dict.
     *
     * TODO: actually remove this from the _callbacks dictionary instead
     * of binding an empty function
     *
     * the keycombo+action has to be exactly the same as
     * it was defined in the bind method
     *
     * @param {string|Array} keys
     * @param {string} action
     * @returns void
     */
    Mousetrap.prototype.unbind = function(keys, action) {
        var self = this;
        return self.bind.call(self, keys, function() {}, action);
    };

    /**
     * triggers an event that has already been bound
     *
     * @param {string} keys
     * @param {string=} action
     * @returns void
     */
    Mousetrap.prototype.trigger = function(keys, action) {
        var self = this;
        if (self._directMap[keys + ':' + action]) {
            self._directMap[keys + ':' + action]({}, keys);
        }
        return self;
    };

    /**
     * resets the library back to its initial state.  this is useful
     * if you want to clear out the current keyboard shortcuts and bind
     * new ones - for example if you switch to another page
     *
     * @returns void
     */
    Mousetrap.prototype.reset = function() {
        var self = this;
        self._callbacks = {};
        self._directMap = {};
        return self;
    };

    /**
     * should we stop this event before firing off callbacks
     *
     * @param {Event} e
     * @param {Element} element
     * @return {boolean}
     */
    Mousetrap.prototype.stopCallback = function(e, element) {
        var self = this;

        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
            return false;
        }

        if (_belongsTo(element, self.target)) {
            return false;
        }

        // stop for input, select, and textarea
        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
    };

    /**
     * exposes _handleKey publicly so it can be overwritten by extensions
     */
    Mousetrap.prototype.handleKey = function() {
        var self = this;
        return self._handleKey.apply(self, arguments);
    };

    /**
     * allow custom key mappings
     */
    Mousetrap.addKeycodes = function(object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                _MAP[key] = object[key];
            }
        }
        _REVERSE_MAP = null;
    };

    /**
     * Init the global mousetrap functions
     *
     * This method is needed to allow the global mousetrap functions to work
     * now that mousetrap is a constructor function.
     */
    Mousetrap.init = function() {
        var documentMousetrap = Mousetrap(document);
        for (var method in documentMousetrap) {
            if (method.charAt(0) !== '_') {
                Mousetrap[method] = (function(method) {
                    return function() {
                        return documentMousetrap[method].apply(documentMousetrap, arguments);
                    };
                } (method));
            }
        }
    };

    Mousetrap.init();

    // expose mousetrap to the global object
    window.Mousetrap = Mousetrap;

    // expose as a common js module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Mousetrap;
    }

    // expose mousetrap as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return Mousetrap;
        });
    }
}) (typeof window !== 'undefined' ? window : null, typeof  window !== 'undefined' ? document : null);

},{}]},{},[1]);
