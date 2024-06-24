import * as THREE from 'three'

const vertices = [];
const indices = [];
// const normals = [];

const radius = 10.0;
const half_resolution = 8;
const resolution = 2 * half_resolution;
const dr = 2 * radius / resolution;

const faces = [
  {axis: new THREE.Vector3(1, 0, 0), angle: 0},
  {axis: new THREE.Vector3(1, 0, 0), angle: Math.PI},
  {axis: new THREE.Vector3(1, 0, 0), angle: Math.PI / 2},
  {axis: new THREE.Vector3(1, 0, 0), angle: -Math.PI / 2},
  {axis: new THREE.Vector3(0, 1, 0), angle: Math.PI / 2},
  {axis: new THREE.Vector3(0, 1, 0), angle: -Math.PI / 2},
];

let offset = 0;
let counter = 0;
faces.forEach((face, f) => {
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const v = new THREE.Vector3(-radius + dr * i, -radius + dr * j, radius)
        .applyAxisAngle(face.axis, face.angle)
        .normalize()
        .multiplyScalar(radius);
      vertices.push(v.x, v.y, v.z);
      counter ++;
      if (i < resolution && j < resolution) {
        const a = i * (resolution + 1) + j;
        const b = a + 1;
        const c = a + resolution + 1;
        const d = c + 1;
        indices.push(a + offset, b + offset, c + offset);
        indices.push(b + offset, d + offset, c + offset);
      }
    }
  }
  offset += (resolution + 1) * (resolution + 1);
});

const geometry = new THREE.BufferGeometry();
geometry.setIndex(indices.reverse());
geometry.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3));
geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({ color: 0x049EF4 });

const mesh = new THREE.Mesh( geometry, material );

// const x = -5, y = -5;

// const heartShape = new THREE.Shape();

// heartShape.moveTo(x + 5, y + 5);
// heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
// heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
// heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
// heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
// heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
// heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

// const geometry = new THREE.ShapeGeometry(heartShape);
// const material = new THREE.MeshStandardMaterial({ color: 0x049EF4 });
// const mesh = new THREE.Mesh(geometry, material);

export { mesh as Heart };