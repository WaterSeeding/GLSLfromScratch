// 定义顶点着色器代码（目前为空）
const vshader = `

`;
// 定义片元着色器代码（目前为空）
const fshader = `

`;

// 创建一个新的Three.js场景
const scene = new THREE.Scene();
// 创建一个正交相机，视锥体范围为-1到1，近平面0.1，远平面10
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

// 创建WebGL渲染器，并设置渲染区域为窗口大小
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染器的canvas元素添加到页面body中
document.body.appendChild(renderer.domElement);

// 创建一个2x2的平面几何体
const geometry = new THREE.PlaneGeometry(2, 2);
// 创建一个着色器材质（目前未传入着色器代码）
const material = new THREE.ShaderMaterial({});

// 用几何体和材质创建一个网格，并添加到场景中
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// 设置相机位置，z轴为1，保证能看到平面
camera.position.z = 1;

// 初始化时根据窗口尺寸调整相机和渲染器
onWindowResize();

// 监听窗口尺寸变化，自动调整相机和渲染器
window.addEventListener("resize", onWindowResize, false);

// 启动动画循环
animate();

// 窗口尺寸变化时调用，动态调整正交相机的投影视锥体和渲染区域
function onWindowResize(event) {
  const aspectRatio = window.innerWidth / window.innerHeight;
  let width, height;
  if (aspectRatio >= 1) {
    width = 1;
    height = (window.innerHeight / window.innerWidth) * width;
  } else {
    width = aspectRatio;
    height = 1;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 动画循环函数，每帧渲染场景
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
