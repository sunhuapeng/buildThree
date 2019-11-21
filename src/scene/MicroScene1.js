/**
 * 保存和加载场景以及元素
 */
const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class World {
  scene;
  camera;
  renderer;
  container;
  light;
  controls;
  gridHelper;
  axisHelper;
  AmbientLight;
  constructor() {}
  init() {
    // 创建容器
    this.container = document.body;
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initHelper();
    this.initControls();
    this.initCylinder();
    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      true
    );
  }

  initCylinder() {
    // var geometry = new THREE.CylinderGeometry(50, 50, 200, 32);
    // var material = new THREE.MeshLambertMaterial({ color: 0x7effff });
    // var cylinder = new THREE.Mesh(geometry, material);
    // this.scene.add(cylinder);
  }
  // 渲染动画
  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  // 自适应
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0c1a4b, 600, 3000); //雾化场景
    var color = new THREE.Color(0x0c1a4b);
    this.scene.background = color;
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.camera.position.set(25, 350, 700);
  }
  // 初始化渲染器
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
      precision: "lowp", // 渲染器精度  "highp", "mediump"  "lowp"
      alpha: true,
      powerPreference: "high-performance"
    });
    // 设置屏幕像素比，防止在不同显示屏上模糊
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染的尺寸
    this.renderer.sortObjects = false; // 定义渲染器是否应对对象进行排序。默认是true.
    this.container.appendChild(this.renderer.domElement);
  }
  // 初始化灯光
  initLight() {
    // this.AmbientLight = new THREE.AmbientLight(0xffffff, 5);
    // this.scene.add(this.AmbientLight);
    this.light = new THREE.HemisphereLight(0xffffff, 0x444444);
    this.light.position.set(0, 200, 0);
    this.scene.add(this.light);
  }
  // 初始化鼠标
  initControls() {
    this.controls = new OrbitControls(
      this.camera,
      document.querySelector("canvas")
    );
    this.controls.update(); //更新控制器
  }
  // 初始化辅助线
  initHelper() {
    this.gridHelper = new THREE.GridHelper(4000, 100, 0x000a52, 0x000a52);
    // this.scene.add(this.gridHelper)
    this.axisHelper = new THREE.AxisHelper(250);
    this.scene.add(this.axisHelper);
  }
}
var world = new World();
world.init();
world.animate();
