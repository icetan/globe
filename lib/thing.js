var EventEmitter = require('events').EventEmitter,
    THREE = require('three');

(function() {
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function createThing(container) {
  var WIDTH = container.offsetWidth;
  var HEIGHT = container.offsetHeight;

  var VIEW_ANGLE = 45;
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1;
  var FAR = 1000;

  var renderer = new THREE.WebGLRenderer();
  var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  var scene = new THREE.Scene();

  camera.position.z = 65;
  camera.lookAt(scene.position);

  renderer.setSize(WIDTH, HEIGHT);

  container.appendChild(renderer.domElement);

  scene.add(camera);

  var thing = new EventEmitter();

  thing.render = function() {
    renderer.render(scene, camera);
  };

  thing.start = function() {
    var frame = 0, time,
        startTime = Date.now();
    (function() {
      frame += 1;
      time = Date.now() - startTime;
      thing.emit('frame', frame, time);
      thing.render();
      requestAnimationFrame(arguments.callee);
    })();
  };

  thing.scene = scene;

  return thing;
}

module.exports = createThing;
