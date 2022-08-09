import { Scene, PerspectiveCamera, AmbientLight,PointLight,Vector2, WebGLRenderer, Color, Object3D, ReinhardToneMapping, AxesHelper, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export let width = 0; // 渲染dom的宽度
export let height = 0; // 渲染dom的高度
let tDom = null;
export let scene = null;
export let renderer = null
export let camera = null
export let controls = null

export const create = (dom,color) => {
    tDom = dom
    width = dom.offsetWidth
    height = dom.offsetHeight
    createScene(color)
    createCamera()
    createRender()
    createAxesHelper()
    createControls()
    createLight()
    animate()
}

const createScene = (color) => {
    scene = new Scene()
    scene.background = new Color(color||'#ffefb9')
}
const createCamera = () => {
    camera = new PerspectiveCamera(45, width / height, 1, 10000)
    camera.position.z = 400;
    camera.position.y = -300;
    // camera.position.y = 0;
    if (scene) scene.add(camera)
}
const createRender = () => {
    const render = new WebGLRenderer();
    render.setSize(width, height);
    render.toneMapping = ReinhardToneMapping;
    if (tDom) {
        tDom.appendChild(render.domElement);
        renderer = render
    }
}
const createAxesHelper = () => {
    const axesHelper = new AxesHelper(500);

    if (scene) {
        scene.add(axesHelper);
    }
}
// 控制器
const createControls = () => {
    if (camera && renderer && renderer?.domElement)
        controls = new OrbitControls(camera, renderer?.domElement);
    if (controls) {
        controls.addEventListener('change', (e) => {
            console.log(camera?.position);

        })
    }
}
const createLight = () => {
    var ambientLight = new AmbientLight(0xcccccc, 0.4);
    scene&&scene.add(ambientLight);
    var pointLight = new PointLight(0xffffff, 0.8);
    camera.add(pointLight);
}
export const animate = () => {
    requestAnimationFrame(render);
    if (controls) {
        controls.update();
    }
}

const render = () => {
    animate();
    renderer.render(scene, camera);
}