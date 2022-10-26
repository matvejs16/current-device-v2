// Save the previous value of the device variable.
const previousDevice = window.device

const device = {}

const changeOrientationList = []

// Add device as a global object.
window.device = device

// The <html> element.
const documentElement = window.document.documentElement

// The client user agent string.
// Lowercase, so we can use the more efficient indexOf(), instead of Regex
const userAgent = window.navigator.userAgent.toLowerCase()

// Detectable television devices.
const television = [
  'googletv',
  'viera',
  'smarttv',
  'internet.tv',
  'netcast',
  'nettv',
  'appletv',
  'boxee',
  'kylo',
  'roku',
  'dlnadoc',
  'pov_tv',
  'hbbtv',
  'ce-html'
]


let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

ctx.fillStyle = "rgb(255,0,255)";
ctx.beginPath();
ctx.rect(20, 20, 150, 100);
ctx.fill();
ctx.stroke();
ctx.closePath();
ctx.beginPath();
ctx.fillStyle = "rgb(0,255,255)";
ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
ctx.fill();
ctx.stroke();   
ctx.closePath();

let txt = 'abz190#$%^@£éú';
ctx.textBaseline = "top";
ctx.font = '17px "Arial 17"';
ctx.textBaseline = "alphabetic";
ctx.fillStyle = "rgb(255,5,5)";
ctx.rotate(.03);
ctx.fillText(txt, 4, 17);
ctx.fillStyle = "rgb(155,255,5)";
ctx.shadowBlur=8;
ctx.shadowColor="red";
ctx.fillRect(20,12,100,5);

// hashing function
let src = canvas.toDataURL();
hash = 0;

for (i = 0; i < src.length; i++) {
	char = src.charCodeAt(i);
	hash = ((hash<<5)-hash)+char;
	hash = hash & hash;
}

device.fingerprint = {
  hash: hash,
  pxDepth: window.screen.pixelDepth,
  colorDepth: window.screen.colorDepth,
}

// Main functions
// --------------

device.macos = function() {
  return find('mac')
}

device.ios = function() {
  return device.iphone() || device.ipod() || device.ipad()
}

device.iphone = function() {
  return !device.windows() && find('iphone')
}

device.ipod = function() {
  return find('ipod')
}

device.ipad = function() {
  const iPadOS13Up =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return find('ipad') || iPadOS13Up
};

device.android = function() {
  return !device.windows() && find('android')
}

device.androidPhone = function() {
  return device.android() && find('mobile')
}

device.androidTablet = function() {
  return device.android() && !find('mobile')
}

device.blackberry = function() {
  return find('blackberry') || find('bb10')
}

device.blackberryPhone = function() {
  return device.blackberry() && !find('tablet')
}

device.blackberryTablet = function() {
  return device.blackberry() && find('tablet')
}

device.windows = function() {
  return find('windows')
}

device.windowsPhone = function() {
  return device.windows() && find('phone')
}

device.windowsTablet = function() {
  return device.windows() && (find('touch') && !device.windowsPhone())
}

device.fxos = function() {
  return (find('(mobile') || find('(tablet')) && find(' rv:')
}

device.fxosPhone = function() {
  return device.fxos() && find('mobile')
}

device.fxosTablet = function() {
  return device.fxos() && find('tablet')
}

device.meego = function() {
  return find('meego')
}

device.cordova = function() {
  return window.cordova && location.protocol === 'file:'
}

device.nodeWebkit = function() {
  return typeof window.process === 'object'
}

device.mobile = function() {
  return (
    device.androidPhone() ||
    device.iphone() ||
    device.ipod() ||
    device.windowsPhone() ||
    device.blackberryPhone() ||
    device.fxosPhone() ||
    device.meego()
  )
}

device.tablet = function() {
  return (
    device.ipad() ||
    device.androidTablet() ||
    device.blackberryTablet() ||
    device.windowsTablet() ||
    device.fxosTablet()
  )
}

device.desktop = function() {
  return !device.tablet() && !device.mobile()
}

device.television = function() {
  let i = 0
  while (i < television.length) {
    if (find(television[i])) {
      return true
    }
    i++
  }
  return false
}

device.portrait = function() {
  if (
    screen.orientation &&
    Object.prototype.hasOwnProperty.call(window, 'onorientationchange')
  ) {
    return includes(screen.orientation.type, 'portrait')
  }
  if (
    device.ios() &&
    Object.prototype.hasOwnProperty.call(window, 'orientation')
  ) {
    return Math.abs(window.orientation) !== 90
  }
  return window.innerHeight / window.innerWidth > 1
}

device.landscape = function() {
  if (
    screen.orientation &&
    Object.prototype.hasOwnProperty.call(window, 'onorientationchange')
  ) {
    return includes(screen.orientation.type, 'landscape')
  }
  if (
    device.ios() &&
    Object.prototype.hasOwnProperty.call(window, 'orientation')
  ) {
    return Math.abs(window.orientation) === 90
  }
  return window.innerHeight / window.innerWidth < 1
}

// Public Utility Functions
// ------------------------

// Run device.js in noConflict mode,
// returning the device variable to its previous owner.
device.noConflict = function() {
  window.device = previousDevice
  return this
}

// Private Utility Functions
// -------------------------

// Check if element exists
function includes(haystack, needle) {
  return haystack.indexOf(needle) !== -1
}

// Simple UA string search
function find(needle) {
  return includes(userAgent, needle)
}

// Check if documentElement already has a given class.
function hasClass(className) {
  return documentElement.className.match(new RegExp(className, 'i'))
}

// Add one or more CSS classes to the <html> element.
function addClass(className) {
  let currentClassNames = null
  if (!hasClass(className)) {
    currentClassNames = documentElement.className.replace(/^\s+|\s+$/g, '')
    documentElement.className = `${currentClassNames} ${className}`
  }
}

// Remove single CSS class from the <html> element.
function removeClass(className) {
  if (hasClass(className)) {
    documentElement.className = documentElement.className.replace(
      ` ${className}`,
      ''
    )
  }
}

// HTML Element Handling
// ---------------------

// Insert the appropriate CSS class based on the _user_agent.

if (device.ios()) {
  if (device.ipad()) {
    addClass('ios ipad tablet')
  } else if (device.iphone()) {
    addClass('ios iphone mobile')
  } else if (device.ipod()) {
    addClass('ios ipod mobile')
  }
} else if (device.macos()) {
  addClass('macos desktop')
} else if (device.android()) {
  if (device.androidTablet()) {
    addClass('android tablet')
  } else {
    addClass('android mobile')
  }
} else if (device.blackberry()) {
  if (device.blackberryTablet()) {
    addClass('blackberry tablet')
  } else {
    addClass('blackberry mobile')
  }
} else if (device.windows()) {
  if (device.windowsTablet()) {
    addClass('windows tablet')
  } else if (device.windowsPhone()) {
    addClass('windows mobile')
  } else {
    addClass('windows desktop')
  }
} else if (device.fxos()) {
  if (device.fxosTablet()) {
    addClass('fxos tablet')
  } else {
    addClass('fxos mobile')
  }
} else if (device.meego()) {
  addClass('meego mobile')
} else if (device.nodeWebkit()) {
  addClass('node-webkit')
} else if (device.television()) {
  addClass('television')
} else if (device.desktop()) {
  addClass('desktop')
}

if (device.cordova()) {
  addClass('cordova')
}

// Orientation Handling
// --------------------

// Handle device orientation changes.
function handleOrientation() {
  if (device.landscape()) {
    removeClass('portrait')
    addClass('landscape')
    walkOnChangeOrientationList('landscape')
  } else {
    removeClass('landscape')
    addClass('portrait')
    walkOnChangeOrientationList('portrait')
  }
  setOrientationCache()
}

function walkOnChangeOrientationList(newOrientation) {
  for (let index = 0; index < changeOrientationList.length; index++) {
    changeOrientationList[index](newOrientation)
  }
}

device.onChangeOrientation = function(cb) {
  if (typeof cb == 'function') {
    changeOrientationList.push(cb)
  }
}

// Detect whether device supports orientationchange event,
// otherwise fall back to the resize event.
let orientationEvent = 'resize'
if (Object.prototype.hasOwnProperty.call(window, 'onorientationchange')) {
  orientationEvent = 'orientationchange'
}

// Listen for changes in orientation.
if (window.addEventListener) {
  window.addEventListener(orientationEvent, handleOrientation, false)
} else if (window.attachEvent) {
  window.attachEvent(orientationEvent, handleOrientation)
} else {
  window[orientationEvent] = handleOrientation
}

handleOrientation()

// Public functions to get the current value of type, os, or orientation
// ---------------------------------------------------------------------

function findMatch(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (device[arr[i]]()) {
      return arr[i]
    }
  }
  return 'unknown'
}

device.type = findMatch(['mobile', 'tablet', 'desktop'])
device.os = findMatch([
  'ios',
  'iphone',
  'ipad',
  'ipod',
  'android',
  'blackberry',
  'macos',
  'windows',
  'fxos',
  'meego',
  'television'
])

function setOrientationCache() {
  device.orientation = findMatch(['portrait', 'landscape'])
}

setOrientationCache()

export default device
