const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import 'imports-loader?THREE=three!threebsp'
var scene,
  camera,
  width,
  height,
  controls,
  spotLight,
  container,
  textureLoader,
  dlsImg,
  group = new THREE.Group(),
  cubeCamera1,
  renderer,
  hemiLight,
  verMaterial;
init();
animate();
function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  width = window.innerWidth;
  height = window.innerHeight;
  textureLoader = new THREE.TextureLoader();
  setScene();
  setCamera();
  setRenderer();
  setLight();
  setControals();
  setHelper();
  setBottom();
  setSix();
  setHelfObj();
  setVertical();
  setVarBox();
  setToru();
}
function setToru() {
  var geometry = new THREE.TorusGeometry(40, 2, 16, 100);
  var material = new THREE.MeshPhongMaterial({
    color: 0x4b2ee8,
    transparent: true, // 是否透明
    opacity: 0.8,
    envMap: cubeCamera1.renderTarget.texture
  });
  // material.blendDst = THREE.DstAlphaFactor
  var torus = new THREE.Mesh(geometry, material);
  torus.receiveShadow = true;
  torus.castShadow = true;
  torus.matrixAutoUpdate = false;
  scene.add(torus);
}
function setVarBox() {
  var cubeGeometry = new THREE.BoxGeometry(20, 80, 25);
  var material = new THREE.MeshPhongMaterial({
    transparent: true, // 是否透明
    opacity: 0.8,
    envMap: cubeCamera1.renderTarget.texture
  });
  var box = new THREE.Mesh(cubeGeometry, material);
  box.position.set(24.5, 100.5, -20);
  box.rotation.z = -0.1 * Math.PI;
  box.receiveShadow = true;
  box.castShadow = true;
  group.add(box);
}
function setVertical() {
  cubeCamera1 = new THREE.CubeCamera(1, 1000, 256);
  cubeCamera1.renderTarget.texture.generateMipmaps = true;
  cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;

  var geometry = new THREE.CylinderGeometry(5, 5, 55, 32);
  verMaterial = new THREE.MeshLambertMaterial({
    transparent: true, // 是否透明
    opacity: 0.8,
    envMap: cubeCamera1.renderTarget.texture
  });

  var cylinder = new THREE.Mesh(geometry, verMaterial);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  cylinder.rotation.z = -0.1 * Math.PI;
  cylinder.position.set(50, 50, -25);
  group.add(cylinder);
}
function setHelfObj() {
  let mw = setMwMap(54, 30, 0.04, "mw", 30);
  mw.rotation.z = -0.54 * Math.PI;
  mw.position.set(52, 52.5, -35);
  group.add(mw);

  let zp = setMwMap(54, 30, 0.12, "zp", 34);
  zp.rotation.z = 0.26 * Math.PI;
  zp.position.set(49.5, 47, -37);
  group.add(zp);
}
// 大半径，小半径,角度，贴图，厚度
function setMwMap(dr, sr, d, m, dep) {
  let bigSix = setCircle(dr, 50, d, 0x00ffff, dep);
  let simSix = setCircle(sr, 50, d, 0x00ffff, dep);
  let mw = initSubtract(bigSix, simSix, "subtract", "", 0xffc8c4);
  textureLoader.load(`./static/images/${m}.jpg`, function(map) {
    map.offset = new THREE.Vector2(0.5, 0.5);
    map.repeat = new THREE.Vector2(0.01, 0.01);
    var material = new THREE.MeshPhongMaterial({
      map: map
    });
    mw.material = material;
  });
  return mw;
}
function setSix() {
  let bigSix = setCircle(50, 168, 0.8, 0x00ffff, 25);
  let simSix = setCircle(30, 168, 0.8, 0x00ffff, 25);
  let six = initSubtract(bigSix, simSix, "subtract", "", 0xffaba8);
  six.receiveShadow = true;
  six.castShadow = true;
  six.position.set(50, 50, -32.5);
  six.rotation.z = 0.9 * Math.PI;
  group.add(six);
}

function setBottom() {
  let box = setBox(50, 50, 40, 0xff00ff);
  // 创建圆柱
  let cylinder = setCylinder(50, 50, 50, 48, 0x00ffff);
  let cylinder2 = setCylinder(25, 25, 80, 48, 0x00ffff);
  cylinder.rotation.x = 0.5 * Math.PI;
  cylinder.position.x = 25;
  cylinder.position.y = 25;

  textureLoader.load(`./static/images/mw.jpg`, function(map) {
    var material = new THREE.MeshPhongMaterial({
      map: dlsImg
    });
    cylinder.material = material;
    // scene.add(cylinder)
  });
  textureLoader.load(`./static/images/mw.jpg`, function(map) {
    var material = new THREE.MeshPhongMaterial({
      map: dlsImg
    });
    cylinder2.material = material;
    // scene.add(cylinder2)
  });
  // cylinder.position.set(10,10,10)
  let helfBox = initSubtract(box, cylinder, "subtract");
  let box2 = setBox(10, 20, 52, 0x00ff00);
  let box3 = setBox(20, 10, 52, 0x00ff00);
  box2.position.set(-25, 18, 0);
  box3.position.set(18, -25, 0);
  let box4 = initSubtract(box2, box3, "union");
  let bottomLeft = initSubtract(helfBox, box4, "subtract", "dls");
  bottomLeft.position.set(25, 25, -20);
  var bottomRight = initSubtract(helfBox, box4, "subtract", "dls");
  bottomRight.rotation.z = 0.5 * Math.PI;
  bottomRight.position.set(75, 25, -20);
  bottomLeft.receiveShadow = true;
  bottomLeft.castShadow = true;
  bottomRight.receiveShadow = true;
  bottomRight.castShadow = true;
  group.add(bottomLeft);
  group.add(bottomRight);
}

//  subtract元素相减 被减数，减数  intersect相交 union相加
function initSubtract(a, b, type, texture, c) {
  var boxBsp = new ThreeBSP(a);
  var cylinderBSP = new ThreeBSP(b);
  var resultBSP;
  if (type == "subtract") {
    resultBSP = boxBsp.subtract(cylinderBSP);
  } else if (type == "intersect") {
    resultBSP = boxBsp.intersect(cylinderBSP);
  } else if (type == "union") {
    resultBSP = boxBsp.union(cylinderBSP);
  }
  var result = resultBSP.toMesh();
  result.geometry.computeFaceNormals();
  result.geometry.computeVertexNormals();
  if (texture) {
    textureLoader.load(`./static/images/${texture}.jpg`, function(map) {
      // console.log(map)
      map.center.x = 20;
      map.center.y = 20;
      dlsImg = map;
      result.material = new THREE.MeshStandardMaterial({
        map: dlsImg,
        metalness: 0.0,
        roughness: 0.0,
        envMapIntensity: 1.0
      });
      // result.material = material
    });
  } else {
    result.material = new THREE.MeshPhongMaterial({
      color: c || 0x0000ff
    });
    // result.material = material
  }
  return result;
}

function setCircle(r, s, d, c, dep) {
  var geometry = new THREE.CircleGeometry(r, s, 0, 2 * Math.PI * d);
  var material = new THREE.MeshBasicMaterial({
    color: c,
    side: THREE.DoubleSide
  });
  var circle = new THREE.Mesh(geometry, material);
  var newCircle = getExtrude(circle.geometry.vertices, dep, c);
  return newCircle;
}
// 积压
function getExtrude(points, dep, c) {
  var shape = new THREE.Shape(points);
  var geometry = new THREE.ExtrudeGeometry( //拉伸造型
    shape, //二维轮廓
    //拉伸参数
    {
      amount: dep, //拉伸长度
      curveSegments: 12, //拉伸轮廓细分数
      steps: 12, //拉伸方向的细分数
      bevelEnabled: false, //无倒角
      bevelSegments: 0.1, //倒直角：设置为1  倒圆角：越大越光滑
      bevelThickness: 40 //拉伸方向尺寸
      // bevelSize: 4,//径向尺寸
    }
  );
  var material = new THREE.MeshPhongMaterial({
    color: c || 0x00ffff,
    // wireframe: true,
    side: THREE.DoubleSide //两面可见
  }); //材质对象
  var mesh = new THREE.Mesh(geometry, material); //网格模型对象
  return mesh;
}

// 创建圆柱 上半径，下半径，厚度，细分数，颜色
function setCylinder(xr, yr, d, f, c) {
  var geometry = new THREE.CylinderGeometry(xr, yr, d, f);
  var material = new THREE.MeshLambertMaterial({ color: c });
  var cylinder = new THREE.Mesh(geometry, material);
  return cylinder;
}

function setShape(r, d, s, c, map) {
  var geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
  var R = r; //圆弧半径
  // 可以通过分段数量的多少  绘制多边形
  var N = 360; //分段数量
  var points = 360;
  // 批量生成圆弧上的顶点数据
  let a = 0;
  var shape = new THREE.Shape();
  for (var i = 0; i < points; i++) {
    var angle = ((2 * Math.PI * d) / N) * i;
    var x = R * Math.sin(angle);
    var y = R * Math.cos(angle);
    if (i === 0) {
      shape.moveTo(0, 0, 0); //起点
    } else {
      shape.lineTo(x, y, 0);
    }
  }

  var geometry = new THREE.ExtrudeGeometry( //拉伸造型
    shape, //二维轮廓
    //拉伸参数
    {
      amount: s, //拉伸长度
      curveSegments: 12, //拉伸轮廓细分数
      steps: 12, //拉伸方向的细分数
      bevelEnabled: false, //无倒角
      bevelSegments: 0.1, //倒直角：设置为1  倒圆角：越大越光滑
      bevelThickness: 40 //拉伸方向尺寸
      // bevelSize: 4,//径向尺寸
    }
  );
  var material = new THREE.MeshPhongMaterial({
    color: c || 0x00ffff,
    side: THREE.DoubleSide //两面可见
    // wireframe: true,
  }); //材质对象
  var mesh = new THREE.Mesh(geometry, material); //网格模型对象
  return mesh;
  // scene.add(mesh) //网格模型添加到场景中
}
// 创建立方体  宽高厚度颜色
function setBox(w, h, d, c) {
  var cubeGeometry = new THREE.BoxGeometry(w, h, d);
  var material = new THREE.MeshLambertMaterial({ color: c });
  var box = new THREE.Mesh(cubeGeometry, material);
  // scene.add(box)
  return box;
}

function setScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x74f5eb);
  group.position.set(-50, -50, 25);
  group.castShadow = true;
  group.receiveShadow = true;
  scene.add(group);
}

function setCamera() {
  camera = new THREE.OrthographicCamera(
    width / -8,
    width / 8,
    height / 8,
    height / -8,
    1,
    1000
  );
  camera.position.set(0, 0, 200);
  camera.lookAt(scene.position);
  scene.add(camera);
}

function setRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement); //body元素中插入canvas对象
  renderer.shadowMap.enabled = true;
}

function setHelper() {
  var axisHelper = new THREE.AxisHelper(250);
  // scene.add(axisHelper);

  var spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(spotLightHelper);

  // var cameraHelper = new THREE.CameraHelper(camera)
  // scene.add(cameraHelper)
}

function setLight() {
  var ambient = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambient);

  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(1, 1, 1);
  // hemiLight.groundColor.setHSL(0.095, 1, 0.75)
  hemiLight.castShadow = true;
  hemiLight.position.set(-100, 100, 0);
  scene.add(hemiLight);

  // hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  // scene.add(hemiLightHelper);

  //
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 200, 100);
  spotLight.castShadow = true;
  scene.add(spotLight);

  var dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(0, 200, 100);
  dirLight.position.multiplyScalar(30);
  // scene.add( dirLight );

  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  var d = 50;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;
}

function setControals() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function render() {
  controls.update();
  if (cubeCamera1 && verMaterial && group) {
    // verMaterial.envMap = cubeCamera1.renderTarget.texture;
    cubeCamera1.update(renderer, scene);
  }
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}
