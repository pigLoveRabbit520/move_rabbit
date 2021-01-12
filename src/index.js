import * as THREE from 'three'

import initOrbitControls from 'three-orbit-controls';
const OrbitControls = initOrbitControls(THREE)

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
    this.options = Object.assign({}, defaultOptions, options)
    // 场景（scene）、相机（camera）、渲染器（renderer）
    this.initRender() // 初始化渲染器
    this.initSence() // 初始化场景
    this.initCamera() // 初始化照相机
    this.initLight() // 初始化光源
    this.addMesh() // 初始化光源
    // this.initSeat()
    this.initControl()
    // window.onresize = this.onWindowResize.bind(this);
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
    camera.position.set(-10, 80, 200)
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

  addMesh() {
    const texture = new THREE.TextureLoader().load("assets/tuji.jpg"); // 加载纹理贴图
    const meshMaterial = new THREE.MeshPhongMaterial({
      // color: 0x0000ff,
      map: texture,
      side:THREE.DoubleSide,//两面可见
    })
    const sphereGeometry = this.sphereGeometry = new THREE.SphereGeometry(40, 32, 32); // 球体
    const sphere = this.tuJisphere = new THREE.Mesh(sphereGeometry, meshMaterial);
    sphere.position.set(-80, 55, 0);

    // 创建桌子
    const geometry2 = new THREE.BoxGeometry(300, 30, 100); // 创建一个立方体几何对象Geometry
    const material2 = new THREE.MeshLambertMaterial({
        color: 0x1cbbb4,
    }); //材质对象Material
    const meshDesk = new THREE.Mesh(geometry2, material2); // 网格模型对象Mesh

    meshDesk.position.set(-100, 0, 0);

    const group = this.group = new THREE.Group();
    group.add(sphere);
    group.add(meshDesk);
    this.scene.add(group);
  }

  //窗口变动触发的函数
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.render();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initControl() {
    const controls = this.controls = new OrbitControls(this.camera);
    controls.enableDamping = true; // 启用阻尼（惯性），这将给控制器带来重量感
    controls.enableZoom = true;
    controls.enablePan = false; // 摄像机平移
    controls.enableKeys = false; // 禁止键盘
    controls.zoomSpeed = 5
    controls.maxPolarAngle = 1.5
    controls.minDistance = 10
    controls.maxDistance = 800
  }


  render() {
    // 自转
    this.tuJisphere.rotation.y -= Math.PI * 0.005;
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    // 将this的指向用bind方法强制给指向到这个class
    window.requestAnimationFrame(this.render.bind(this))
  }
}
