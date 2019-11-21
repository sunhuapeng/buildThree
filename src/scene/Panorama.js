const THREE = require("three");
import { CubemapGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator.js";
var camera, scene, renderer;
var onPointerDownPointerX,
  onPointerDownPointerY,
  onPointerDownLon,
  onPointerDownLat;

var lon = 0,
  lat = 0;
var phi = 0,
  theta = 0;

var textureLoader = new THREE.TextureLoader();
// texture = new THREE.TextureLoader().load(
//   "./static/images/大连全景.jpg"
// );
var texture2 = null;
textureLoader.load("./static/images/大连全景.jpg", function(texture) {
  texture.mapping = THREE.UVMapping;
  init(texture);
  animate();

  textureLoader.load("./static/images/大连全景HD.jpg", function(texture) {
    texture.mapping = THREE.UVMapping;
    texture2 = texture;
  });
});

function init(texture) {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  initScene(texture);
  // var options = {
  //   resolution: 1024,
  //   generateMipmaps: true,
  //   minFilter: THREE.LinearMipmapLinearFilter,
  //   magFilter: THREE.LinearFilter
  // };

  // scene.background = new CubemapGenerator(renderer).fromEquirectangular(
  //   texture,
  //   options
  // );

  document.body.appendChild(renderer.domElement);

  document.addEventListener("mousedown", onDocumentMouseDown, false);

  document.addEventListener("wheel", onDocumentMouseWheel, false);

  window.addEventListener("resize", onWindowResized, false);
}
function initScene(texture) {
  var options = {
    resolution: 1024,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter
  };

  scene.background = new CubemapGenerator(renderer).fromEquirectangular(
    texture,
    options
  );
}
function onWindowResized() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function onDocumentMouseDown(event) {
  event.preventDefault();

  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;

  onPointerDownLon = lon;
  onPointerDownLat = lat;

  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("mouseup", onDocumentMouseUp, false);
}

function onDocumentMouseMove(event) {
  lon = (event.clientX - onPointerDownPointerX) * 0.1 + onPointerDownLon;
  lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
}

function onDocumentMouseUp() {
  document.removeEventListener("mousemove", onDocumentMouseMove, false);
  document.removeEventListener("mouseup", onDocumentMouseUp, false);
}

function onDocumentMouseWheel(event) {
  var fov = camera.fov + event.deltaY * 0.05;

  camera.fov = THREE.Math.clamp(fov, 10, 75);

  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  var time = Date.now();

  lon += 0.15;

  lat = Math.max(-85, Math.min(85, lat));

  phi = THREE.Math.degToRad(90 - lat);

  theta = THREE.Math.degToRad(lon);

  camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
  camera.position.y = 100 * Math.cos(phi);
  camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

document.getElementById("high").onclick = function() {
  if (texture2) {
    initScene(texture2);
  }
};
