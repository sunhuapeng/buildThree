/**
 * 保存和加载场景以及元素
 */
const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Stats } from "three/examples/js/libs/stats.min.js";
import { GUI } from "three/examples/js/libs/dat.gui.min.js";

export default class World {
  scene;
  camera;
  renderer;
  container;
  light;
  controls;
  group;
  stats;
  cube;
  gridHelper;
  axisHelper;
  AmbientLight;
  params = {
    rotatex: 0,
    rotatey: 0,
    rotatez: 0,
    saveMesh: () => {
      this.saveMesh();
    },
    loadMesh: () => {
      this.loadMesh();
    },
    removeOld: false,
    exportScene: () => {
      this.exportScene();
    },
    importScene: () => {
      this.importScene();
    },
    clearScene: () => {
      this.clearScene();
    }
  };
  loader = new THREE.ObjectLoader();
  constructor() {}
  init() {
    // 创建容器
    this.container = document.body;
    // document.body.appendChild(this.container);
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initHelper();
    this.initControls();
    this.initGround();
    // this.stats = new Stats();
    // this.container.appendChild(this.stats.dom);

    this.initCube();
    this.initGui();
    window.addEventListener("resize", ()=>{
      this.onWindowResize()
    }, true);
  }
  initGround() {
    let ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({
        color: 0x383634,
        side: THREE.DoubleSide,
        opacity: 0.6,
        transparent: true
      })
    );
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
  }
  initCube() {
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshLambertMaterial({ color: Math.random()*0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.name = "cube";
    this.scene.add(this.cube);
  }
  initGui() {
    var gui = new GUI();
    gui.add(this.params, "rotatex", 0, 2, 0.01).onChange(() => {
      this.rotateMesh();
    });
    gui.add(this.params, "rotatey", 0, 2, 0.01).onChange(() => {
      this.rotateMesh();
    });
    gui.add(this.params, "rotatez", 0, 2, 0.01).onChange(() => {
      this.rotateMesh();
    });
    gui.add(this.params, "saveMesh");
    gui.add(this.params, "loadMesh");
    gui.add(this.params, "exportScene");
    gui.add(this.params, "clearScene");
    gui.add(this.params, "importScene");
  }
  rotateMesh() {
    this.scene
      .getObjectByName("cube")
      .rotation.set(
        Math.PI * this.params.rotatex,
        Math.PI * this.params.rotatey,
        Math.PI * this.params.rotatez
      );
  }
  saveMesh() {
    console.log("save");
    let json = this.cube.toJSON();
    localStorage.setItem("json", JSON.stringify(json));
  }
  loadMesh() {
    console.log("load");
    let json = localStorage.getItem("json");
    if (json) {
      var loadedGeometry = JSON.parse(json);
      var newCube = this.loader.parse(loadedGeometry);
      newCube.position.x = this.getRandomInt(-500, 300);
      newCube.position.y = this.getRandomInt(-300, 200);
      newCube.position.z = this.getRandomInt(-300, 100);
      this.scene.add(newCube);
    }
  }

  clearScene() {
    console.log("清除场景");
    this.scene = new THREE.Scene();
  }

  exportScene() {
    console.log("导出场景");
    localStorage.setItem("scene", JSON.stringify(this.scene));
  }
  importScene() {
    console.log("导入场景");
    var json = localStorage.getItem("scene");
    if (json) {
      var loadedGeometry = JSON.parse(json);
      var newScene = this.loader.parse(loadedGeometry);
      this.scene = newScene;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
    this.scene.fog = new THREE.Fog(0xa0a0a0, 600, 3000); //雾化场景
    var color = new THREE.Color(0x000000);
    this.scene.background = color
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
