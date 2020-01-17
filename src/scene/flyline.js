const THREE = require("three");
import initFly from "../modular/fly.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
var scene, camera, renderer, container;
var light, controls, group, stats;
var loader = new SVGLoader();
var _Fly;
var clock = new THREE.Clock();
var lineGroup = new THREE.Group();
init();
animate();
function init() {
  // 创建容器
  container = document.createElement("div");
  document.body.appendChild(container);
  // 创建渲染函数
  renderer = new THREE.WebGLRenderer({
    antialias: true //抗锯齿
  });
  renderer.setPixelRatio(window.devicePixelRatio); //设置渲染的比例
  renderer.setSize(window.innerWidth, window.innerHeight); //设置渲染的尺寸
  container.appendChild(renderer.domElement);

  // 创建fps监控器
  stats = new Stats();
  container.appendChild(stats.dom);

  // 创建相机
  /*
          camera = new THREE.PerspectiveCamera(
            80,
            window.innerWidth / window.innerHeight,
            1,
            10000
          );
        */
  camera = new THREE.OrthographicCamera(
    window.innerWidth / -2.7,
    window.innerWidth / 2.7,
    window.innerHeight / 2.7,
    window.innerHeight / -2.7,
    -10000,
    10000
  );
  camera.zoom = 1.3;
  camera.position.set(700, 3500, 700); //设置相机位置

  // 设置鼠标操作（控制器）
  controls = new OrbitControls(camera, document.querySelector("canvas"));
  // controls.target = new THREE.Vector3(90, 58, -104);
  // 设置场景
  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0xa0a0a0, 600, 3000); //雾化场景
  scene.background = new THREE.Color(0xa0a0a0);
  scene.add(lineGroup);
  lineGroup.rotation.x = Math.PI / 2;
  // 设置光照
  light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);
  let ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({
      color: 0x383634,
      side: THREE.DoubleSide
    })
  );
  ground.rotation.x = -Math.PI / 2;
  getsvg();
  // 创建参考线
  var axisHelper = new THREE.AxisHelper(250);
  scene.add(axisHelper);
  // 根据窗口自适应改变
  window.addEventListener("resize", onWindowResize, false);
}
function getsvg() {
  loader.load("./static/svg/road.svg", function(data) {
    // console.log(data);
    _Fly = new initFly({});
    let shapeArr = [];
    let index = 0;
    for (let i = 0; i < data.paths.length; i++) {
      let path = data.paths[i];
      var shapes = path.toShapes(true);
      var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide
      });
      shapes.forEach(shape => {
        if (path.userData.node.id.indexOf("fly") !== -1) {
          shapeArr.push(shape);
        } else {
          let geoPlane = new THREE.ShapeBufferGeometry(shape);
          var mesh = new THREE.Mesh(geoPlane, material);
          getEdges(mesh);
          // lineGroup.add(mesh);
        }
      });
    }
    let b = new THREE.Box3();
    b.expandByObject(lineGroup);
    let center = new THREE.Vector3();
    b.getCenter(center).negate();
    lineGroup.position.copy(center);
    interval(shapeArr);
  });
}
// 定时器
function interval(shapeArr) {
  let index = 0;
  var time = setInterval(() => {
    let shape = shapeArr[index];
    if (index === shapeArr.length - 1) {
      clearInterval(time);
    }
    let geoPlane = new THREE.ShapeGeometry(shape);
    var points = geoPlane.vertices;
    setLine(points);
    index++;
  });
}
function getEdges(dom) {
  var edges = new THREE.EdgesGeometry(dom.geometry, 10);
  var line = new THREE.LineSegments(edges);
  line.material.color = new THREE.Color(0x00ffff);
  line.material.depthTest = false;
  line.material.opacity = 0.2;
  line.material.transparent = true;
  // line.rotation.set(Math.PI * 0.5, 0, 0);
  lineGroup.add(line);
}
function setLine(points) {
  var curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.0001);
  var point = null;

  try {
    point = curve.getPoints(1000);
  } catch (err) {
    if (!point) {
      // index++;
      return;
    }
  }
  // console.log(point);
  var material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });

  var geometry = new THREE.Geometry();
  geometry.vertices = [...point];
  var line = new THREE.Line(geometry, material);
  // line.rotation.set(Math.PI * 0.5, 0, 0);
  setFlyLine(point);
  // lineGroup.add(line);
}
// 放置飞线
function setFlyLine(points) {
  var flyMesh = _Fly.addFly({
    color: getRandomColor(),
    curve: points,
    width: 10,
    length: 1000,
    speed: 20,
    repeat: Infinity
  });
  // flyMesh.rotation.set(Math.PI * 0.5, 0, 0);
  lineGroup.add(flyMesh);
}
function getRandomColor() {
  var rgb =
    "rgb(" +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    ")";
  return rgb;
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  var delta = clock.getDelta();
  controls.update(); //更新控制器
  if (_Fly) _Fly.animation(delta);
  stats.update();
}
