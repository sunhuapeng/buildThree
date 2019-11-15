/**
 * 保存和加载场景以及元素
 */
const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Stats } from "three/examples/js/libs/stats.min.js";
import { GUI } from "three/examples/js/libs/dat.gui.min.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

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
    showTube:false,
    showLine:true,
  };
  loader = new THREE.ObjectLoader();
  points = 800
  arc = null
  progress=0
  airObject=null
  tube = null
  line = null
  addY = 0
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
    // this.initGround();
    this.initGui();
    this.initLine()
    this.initTube()
    this.setObjLoader()
    window.addEventListener("resize", ()=>{
      this.onWindowResize()
    }, true);
  }
  setObjLoader() {
    // 加载普通模型
    new OBJLoader().load("./static/obj/ta183.obj", object=>{
      this.airObject = object;
      this.airObject.scale.set(0.3, 0.3, 0.3);

      let point = this.arc.getPoint(this.progress);
      console.log(point);
      this.airObject.position.set(point.x, point.y + this.addY, point.z);
      this.airObject.rotation.set(0, 0 * (this.points / 180) * Math.PI, 0);

      this.camera.position.set(100, 200, 320);
      this.scene.add(this.airObject);
    });
  }

  initLine(){
     // 圆弧  通过计算顶点位置渲染
     var geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
     var R = 100; //圆弧半径
     // 可以通过分段数量的多少  绘制多边形
     var N = 360; //分段数量
     // 批量生成圆弧上的顶点数据
     let a = 0;
     for (var i = 0; i < this.points; i++) {
       var angle = ((2 * Math.PI) / N) * i;
       var x = R * Math.sin(angle);
       var z = R * Math.cos(angle);
       geometry.vertices.push(new THREE.Vector3(x, (a += 0.2), z));
     }
     this.arc = new THREE.CatmullRomCurve3(geometry.vertices);
     // 绘制直线
     var material = new THREE.LineBasicMaterial({
       color: 0x589eff
     }); //材质对象
     //线条模型对象
     this.line = new THREE.Line(geometry, material);
     this.scene.add(this.line); //线条对象添加到场景中
  }
  initTube(){
    var tubeGeometry = new THREE.TubeGeometry(this.arc, 100, 5, 50, false);
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    //等价texture.repeat= new THREE.Vector2(20,1)
    var tubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xfffff0,
      transparent: true,
      opacity:0.6
    });
    this.tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    this.tube.visible = false
    this.scene.add(this.tube);
  }
  showTube(){
    this.tube.visible = this.params.showTube
    this.addY = !this.params.showTube?0:2.5
  }
  showLine(){
    this.line.visible = this.params.showLine
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
  initGui() {
    var gui = new GUI();
    gui.add(this.params, "showTube").onChange(() => {
      this.showTube()
    });
    gui.add(this.params, "showLine").onChange(() => {
      this.showLine()
    });
    
  }
  // 渲染动画
  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    // 飞机运动速度
    this.progress += 0.001;
    if (this.progress >= 1) {
      this.progress = 0;
      // return
    }
    if (this.arc && this.airObject) {
      // 获取顶点
      let point = this.arc.getPoint(this.progress);
      if (point && point.x) {
        // 设置飞机位置
        this.airObject.position.set(point.x, point.y + this.addY, point.z);
        let deg = this.progress;
        // 根据不同位置,进行旋转
        this.airObject.rotation.set(0, deg * (this.points / 180) * Math.PI, 0);
      }
    }

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
