import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import Stats from './jsm/libs/stats.module.js'
import { GUI } from './jsm/libs/lil-gui.module.min.js'
import { Heart } from './heart.js'
import { addLights } from './lights.js'

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 25;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const scene = new THREE.Scene();
addLights(scene);

// adding geometries
scene.add(Heart);

window.addEventListener(
  'resize',
  function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
  },
  false,
);

const stats = Stats();
document.body.appendChild(stats.dom);

const gui = new GUI()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 100)
cameraFolder.open()

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
