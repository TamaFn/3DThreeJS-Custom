import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//TEXTURE
const width = 32, height = 32;
const size = width * height;
const data = new Uint8Array(4 * size);

for (let i = 0; i < size; i++) {
    const stride = i * 4;
    data[stride] = Math.floor(new THREE.Color(0xffffff).r * 255);
    data[stride + 1] = Math.floor(new THREE.Color(0xffffff).g * 100);
    data[stride + 2] = Math.floor(new THREE.Color(0xffffff).b * 155);
    data[stride + 3] = 255;
}

// const texture = new THREE.TextureLoader().load("./asset/cliff.jpg");
const texture = new THREE.DataTexture(data, width, height);
texture.needsUpdate = true;

const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 7;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    renderer.render(scene, camera);
}
// renderer.render(scene, camera);
animate();