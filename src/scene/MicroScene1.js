/**
 * 保存和加载场景以及元素
 */
const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";

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
  spotLight;
  plane; //平面
  textureLoader = new THREE.TextureLoader()
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
    this.initSpotLight()
    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      true
    );
    this.textureLoader.load('./static/images/桌面贴图.jpg', texture => {
      this.initPlane(texture)
    })
  }
  initPlane(texture) {
    var geometry = new THREE.PlaneGeometry(300, 800, 32);
    var material = new THREE.MeshBasicMaterial({
      // color: 0x3d3c3c,
      map: texture,
      side: THREE.DoubleSide,
    });
    this.plane = new THREE.Mesh(geometry, material);
    this.plane.rotation.x = Math.PI * 0.5
    // console.log(this.plane)
    this.plane.receiveShadow = true
    this.plane.castShadow = true
    this.scene.add(this.plane);
  }
  initCylinder() {
    var geometry = new THREE.CylinderGeometry(5, 5, 10, 32);
    var material = new THREE.MeshLambertMaterial({
      color: 0x7effff
    });
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.y = 5
    cylinder.castShadow = true
    cylinder.receiveShadow = true
    this.scene.add(cylinder);
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
    this.scene.fog = new THREE.Fog(0x221f20, 600, 3000); //雾化场景
    var color = new THREE.Color(0x221f20);
    this.scene.background = color;
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.camera.position.set(700, 350, 700);
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
  initSpotLight() {
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0,100,100)
    this.scene.add(directionalLight);
    var helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    this.scene.add(helper);
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