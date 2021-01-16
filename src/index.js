import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { AmmoPhysics } from '@enable3d/ammo-physics';

const {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  Color,
  Vector3,
  Raycaster,
  TextureLoader,
  MeshBasicMaterial,
  BackSide,
  Mesh,
  CubeGeometry,
  MeshFaceMaterial,
  DoubleSide,
  JSONLoader,
  Group,
  Geometry,
  PointsMaterial,
  AddEquation,
  Points,
  Vector2,
  MeshLambertMaterial,
  LensFlare,
  AdditiveBlending,
  ShaderMaterial,
} = THREE

export default class GameDemo {
  constructor(options) {
    const defaultOptions = {
      width: window.innerWidth,
      height: window.innerHeight,
      element: document.body,
      pixelRatio: window.devicePixelRatio,
      debugMode: false
    }
    this.options = Object.assign({}, defaultOptions, options);
    // 场景（scene）、相机（camera）、渲染器（renderer）
    this.initRender() // 初始化渲染器
    this.initSence() // 初始化场景
    this.initPhysics()
    this.initCamera() // 初始化照相机
    this.initLight() // 初始化光源
    this.addBoxes()
    this.addMesh()
    // this.initSeat()
    this.initControl()
    // window.onresize = this.onWindowResize.bind(this);
    this.initClock();
    this.render();
  }

  initRender() {
    const renderer = this.renderer = new WebGLRenderer({alpha: true, antialias: true})
    renderer.setSize(this.options.width, this.options.height)
    // 兼容高清屏幕
    renderer.setPixelRatio(this.options.pixelRatio)
    // 在某个位置插入canvas
    this.options.element.appendChild && this.options.element.appendChild(renderer.domElement)
  }

  initSence() {
    const scene = this.scene = new Scene()
    scene.background = new Color(0x00FFFF)
  }

  initCamera() {
    // 透视摄像机
    const camera = this.camera = new PerspectiveCamera(70, this.options.width/this.options.height, 1, 10000)
    camera.position.set(-20, 120, 150);
    camera.lookAt(new Vector3(0, 0, 0));
    this.scene.add(camera)
  }

  initLight() {
    // 平行光
    const light = this.light = new DirectionalLight()
    light.position.set(0, 20, 20)
    light.castShadow = true;
    // 要把光添加到相机中(重点)
    this.camera.add(light);
  }

  initPhysics() {
    const physics = this.physics = new AmmoPhysics(this.scene);
    physics.debug.enable(true)
  }

  addBoxes() {
    const texture = new THREE.TextureLoader().load("assets/tuji.jpg"); // 加载纹理贴图
    const boxWidth = 96;
    const geometry = new THREE.BoxGeometry(boxWidth, 25, 56); // 创建一个立方体
    const matArray = [];
    matArray.push(new THREE.MeshBasicMaterial({color: 0xFF7F50}));
    matArray.push(new THREE.MeshBasicMaterial({color: 0x9B30FF}));
    matArray.push(new THREE.MeshBasicMaterial({map: texture,}));
    matArray.push(new THREE.MeshBasicMaterial({color: 0x63B8FF}));
    matArray.push(new THREE.MeshBasicMaterial({color: 0xc41e3a}));
    matArray.push(new THREE.MeshBasicMaterial({color: 0xffffff}));

    const material = new THREE.MeshFaceMaterial(matArray); // 材质对象Material
    const meshOne = new THREE.Mesh(geometry, material); // 网格模型对象Mesh
    const group = this.detkgroup = new THREE.Group();
    const startX = -300;
    meshOne.position.set(startX, 0, 0);
    meshOne.name = `box-1`;
    group.add(meshOne);
    const boxNum = 20;
    for (let index = 0; index < boxNum - 1; index++) {
      const meshNew = meshOne.clone();
      meshNew.position.x = meshOne.position.x + (index + 1) * boxWidth;
      meshNew.name = `box-${index + 2}`;
      group.add(meshNew);
    }
    this.scene.add(group);
    this.physics.add.existing(group);
    group.body.setCollisionFlags(2); // kinematic
  }

  addMesh() {
    const texture = new THREE.TextureLoader().load("assets/tuji.jpg"); // 加载纹理贴图
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x39b54a,
      side:THREE.DoubleSide,//两面可见
    })
    const sphereGeometry = this.sphereGeometry = new THREE.SphereGeometry(20, 32, 32); // 球体
    const sphere = this.tuJisphere = new THREE.Mesh(sphereGeometry, meshMaterial);
    sphere.position.set(-80, 55, 0);

    this.scene.add(sphere);
    this.physics.add.existing(sphere);
    sphere.body.setCollisionFlags(0);
  }

  //窗口变动触发的函数
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.render();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initControl() {
    const controls = this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true; // 启用阻尼（惯性），这将给控制器带来重量感
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false; // 摄像机平移
    controls.enableKeys = false; // 禁止键盘
    controls.zoomSpeed = 5
    controls.maxPolarAngle = Math.PI; // 垂直旋转的角度的上限
    controls.minDistance = 10;
    controls.maxDistance = 900;
  }

  initClock() {
    this.clock = new THREE.Clock()
  }

  render() {
    // 自转
    this.tuJisphere.rotation.y -= Math.PI * 0.005;
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    this.physics.update(this.clock.getDelta() * 1000);
    this.physics.updateDebugger()
    // 将this的指向用bind方法强制给指向到这个class
    window.requestAnimationFrame(this.render.bind(this))
  }
}
