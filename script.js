import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, mapControls, orbitControls, scene, renderer;

// Tambahkan variabel untuk mengontrol gerakan maju dan mundur
const moveState = {
    forward: false,
    backward: false,
};

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 200, -400);

    // MapControls
    mapControls = new MapControls(camera, renderer.domElement);
    mapControls.enableDamping = true;
    mapControls.dampingFactor = 0.05;
    mapControls.screenSpacePanning = false;
    mapControls.minDistance = 100;
    mapControls.maxDistance = 500;
    mapControls.maxPolarAngle = Math.PI / 2;

    // OrbitControls
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;

    const geometry = new THREE.BoxGeometry();
    geometry.translate(0, 0.5, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0xeeeeee, flatShading: true });

    for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 1600 - 800;
        mesh.position.y = 0;
        mesh.position.z = Math.random() * 1600 - 800;
        mesh.scale.x = 20;
        mesh.scale.y = Math.random() * 80 + 10;
        mesh.scale.z = 20;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add(mesh);
    }

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);

    // Tambahkan event listener untuk mengendalikan gerakan maju dan mundur
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const gui = new GUI();
    gui.add(mapControls, 'zoomToCursor');
    gui.add(mapControls, 'screenSpacePanning');
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Fungsi untuk mengendalikan gerakan maju dan mundur saat tombol ditekan
function onKeyDown(event) {
    switch (event.key) {
        case 'S':
        case 's':
            moveState.forward = true;
            break;
        case 'W':
        case 'w':
            moveState.backward = true;
            break;
    }
}

// Fungsi untuk menghentikan gerakan saat tombol dilepas
function onKeyUp(event) {
    switch (event.key) {
        case 'S':
        case 's':
            moveState.forward = false;
            break;
        case 'W':
        case 'w':
            moveState.backward = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);
    mapControls.update();
    orbitControls.update();
    moveCamera(); // Panggil fungsi untuk menggerakkan kamera
    render();
}

// Fungsi untuk menggerakkan kamera maju atau mundur
function moveCamera() {
    const speed = 1; // Kecepatan gerakan kamera
    const moveDirection = new THREE.Vector3();
    if (moveState.forward) {
        moveDirection.z = -1;
    }
    if (moveState.backward) {
        moveDirection.z = 1;
    }
    moveDirection.multiplyScalar(speed);
    camera.position.add(moveDirection);
}

function render() {
    renderer.render(scene, camera);
}
