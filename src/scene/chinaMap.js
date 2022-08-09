const THREE = require("three");

import { create, scene } from './utils/createThree'

import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
// 定义svgloader
var loader = new SVGLoader();
// 渲染3d的dom
const chinaMap = document.querySelector('#chinaMap')
// 各种颜色
const color = {
    gbc: '#2c1852',
    city: '#2e34ad',
    active: '#ff97a5',
    line: '#d990e4'
}
// 初始化3d场景
create(chinaMap,color.gbc)
// 地图组
const mapGroup = new THREE.Group()
// 线组
const lineGroup = new THREE.Group()

scene && scene.add(mapGroup)
scene && scene.add(lineGroup)


function getsvg() {
    loader.load("./static/svg/chinamap.svg", loadSvg);
}

const loadSvg = (data) => {
    // console.log(data);
    console.log(data.paths);
    for (let i = 0; i < data.paths.length; i++) {
        let path = data.paths[i];
        var shapes = path.toShapes(true);
        shapes.forEach(shape => {
            let geoPlane = new THREE.ShapeBufferGeometry(shape);
            var mesh = new THREE.Mesh(geoPlane, material);
            var geometry = new THREE.ExtrudeGeometry( //拉伸造型
                shape, //二维轮廓
                //拉伸参数
                {
                    amount: 10, //拉伸长度
                    curveSegments: 40, //圆周方向细分数
                    bevelEnabled: false //无倒角
                }
            );
            var material = new THREE.MeshPhongMaterial({
                color: color.city,
                // side: THREE.DoubleSide, //两面可见
                transparent: true,   // 是否透明
                opacity: 0.2,         //透明度
            }); //材质对象

            var mesh = new THREE.Mesh(geometry, material); //网格模型对象
            mapGroup.add(mesh); //网格模型添加到场景中

        });
    }
    mapGroup.rotateZ(Math.PI);
    mapGroup.rotateY(Math.PI);
    lineGroup.rotateZ(Math.PI);
    lineGroup.rotateY(Math.PI);
    let b = new THREE.Box3();
    b.expandByObject(mapGroup);
    let center = new THREE.Vector3();
    b.getCenter(center).negate();
    mapGroup.position.copy(center);
    lineGroup.position.copy(center);
    drawLine()

}

const drawLine = () => {
    mapGroup.traverse((mesh) => {
        console.log('mesh', mesh);
        if (mesh && !mesh.isGroup) {
            let line = DrawLine(mesh, 1, color.line);
            lineGroup.add(line);
            mesh.material = Building(0.2, color.city);
        }
    })
}

const DrawLine = (dom, opacity, color, count) => {
    if (dom.isMesh) {
        var edges = new THREE.EdgesGeometry(dom.geometry, count ? count : 2);
        var line = new THREE.LineSegments(edges);
        line.material.color = new THREE.Color(color);
        // line.material.depthTest = true;
        line.material.opacity = opacity;
        line.material.transparent = true;
        line.side = THREE.DoubleSide
        return line;
    }
}
const Building = (opcity, color) => {
    return new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        opacity: opcity,
        color: color
    });
}
getsvg()

