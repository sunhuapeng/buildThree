const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import {
    CubemapGenerator
} from "three/examples/jsm/loaders/EquirectangularToCubeGenerator.js";

export default class World {
    scene = null // 场景
    camera = null // 相机（主）
    renderer = null // 渲染器
    controls = null // 轨道控制器
    width = null // 渲染宽度
    height = null // 渲染高度
    container = null // 渲染dom
    mouse = null // 鼠标
    rayList = null // 射线组
    LineGroup = null // 线框 组
    AmbientLight = null // 自然灯光
    gridHelper = null // 地平线
    axisHelper = null // 轴线
    lowIndex = 4 // 地下数量
    sphereMesh = null
    isUserInteracting = false
    onMouseDownMouseX = 0
    onMouseDownMouseY = 0
    lon = 0
    onMouseDownLon = 0
    lat = 0
    onMouseDownLat = 0
    phi = 0
    theta = 0
    static HD
    changeTexture() {
        if (world.HD) {
            this.sphereMesh.material.map = this.texture2
        } else {
            this.sphereMesh.material.map = this.texture
        }
    }
    init() {
        this.container = document.body;
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.initRenderer();
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initHelper();
        this.initControls();

        this.initSphere();

        window.addEventListener('resize', () => {
            this.onWindowResize
        }, true)
    }
    // 渲染动画
    animate() {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.controls.update()
        // this.update()
        this.renderer.render(this.scene, this.camera);
    }
    initSphere() {
        var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale(-1, 1, 1);
        this.texture = new THREE.TextureLoader().load(
            "./static/images/大连全景.jpg"
        );


        var material = new THREE.MeshBasicMaterial({
            map: this.texture
        });
        this.sphereMesh = new THREE.Mesh(geometry, material);
        this.sphereMesh.name = 'sphere'
        this.scene.add(this.sphereMesh);

        this.texture2 = new THREE.TextureLoader().load(
            "./static/images/大连全景HD.jpg"
        );

        // document.addEventListener("mousedown", this.onPointerStart, false);
        // document.addEventListener("mousemove", this.onPointerMove, false);
        // document.addEventListener("mouseup", this.onPointerUp, false);
    }
    onPointerStart(event) {
        this.isUserInteracting = true;

        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;

        this.onMouseDownMouseX = clientX;
        this.onMouseDownMouseY = clientY;

        this.onMouseDownLon = this.lon;
        this.onMouseDownLat = this.lat;
    }
    onPointerMove(event) {
        if (this.isUserInteracting === true) {
            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;

            this.lon =
                (this.onMouseDownMouseX - clientX) * 0.1 + this.onMouseDownLon;
            this.lat =
                (clientY - this.onMouseDownMouseY) * 0.1 + this.onMouseDownLat;
        }
    }
    onPointerUp() {
        this.isUserInteracting = false;
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    // 初始化场景
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000); // 场景背景色
    }
    update() {
        if (this.isUserInteracting === false) {
            this.lon += 0.1;
        }

        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = THREE.Math.degToRad(90 - this.lat);
        this.theta = THREE.Math.degToRad(this.lon);

        this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
        this.camera.target.y = 500 * Math.cos(this.phi);
        this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

        this.camera.lookAt(this.camera.target);
    }
    // 初始化相机
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.height,
            1,
            10000
        );
        this.camera.target = new THREE.Vector3(0, 0, 0);
        this.camera.position.set(100, 0, 0);
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
        this.renderer.setSize(this.width, this.height); // 设置渲染的尺寸
        this.renderer.sortObjects = false; // 定义渲染器是否应对对象进行排序。默认是true.
        this.container.appendChild(this.renderer.domElement);
    }
    // 初始化灯光
    initLight() {
        this.AmbientLight = new THREE.AmbientLight(0xffffff, 5);
        this.scene.add(this.AmbientLight);
    }
    // 初始化鼠标
    initControls() {
        this.controls = new OrbitControls(this.camera, this.container);
        this.controls.screenSpacePanning = true;
        this.controls.autoRotate = true; // 是否自动旋转
        this.controls.autoRotateSpeed = -0.5; // 旋转速度
        this.controls.maxDistance = 450 //最大缩放
        this.controls.minDistance = 150 //最小缩放
        this.controls.saveState(); // 保存当前控制器状态
        this.controls.addEventListener("change", () => {});
    }
    // 初始化辅助线
    initHelper() {
        this.gridHelper = new THREE.GridHelper(4000, 100, 0x000a52, 0x000a52);
        // this.scene.add(this.gridHelper)
        this.axisHelper = new THREE.AxisHelper(250);
        // this.scene.add(this.axisHelper);
    }
}

var world = new World();
world.init();
world.animate();
document.getElementById('high').onclick = function () {
    world.HD = true
    world.changeTexture()
}