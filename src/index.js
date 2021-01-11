import * as THREE from 'three'

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
    // this.initControl()
    // this.animate()
    this.render()
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
    scene.background = new Color(0x1E90FF)
  }

  initCamera() {
    // 透视摄像机
    const camera = this.camera = new PerspectiveCamera(70, this.options.width/this.options.height, 1, 10000)
    camera.position.set(0, 100, 100)
    camera.lookAt(new Vector3(0, 0, 0))
    this.scene.add(camera)
  }

  initLight() {
    // 平行光
    const light = this.light = new DirectionalLight()
    light.position.set(0, 20, 20)
    // 要把光添加到相机中(重点)
    this.camera.add(light)
  }

  addMesh() {
    const meshMaterial = new THREE.MeshPhongMaterial({color: 0x7777ff})
    // radius — 球体半径，默认为1。
    // widthSegments — 水平分段数（沿着经线分段），最小值为3，默认值为8
    // heightSegments — 垂直分段数（沿着纬线分段），最小值为2，默认值为6
    const sphereGeometry = new THREE.SphereGeometry(40, 32, 32)
    const sphere = new THREE.Mesh(sphereGeometry, meshMaterial)
    this.scene.add(sphere)
  }

  initSeat() {
    const loader = new THREE.OBJLoader()
    loader.load('assets/chair.obj', obj => {
      obj.traverse(child=> {
        if (child instanceof Mesh) {
          child.material.side = THREE.DoubleSide
          this.scene.add(obj)
        }
      })
    })
  }

  initControl() {
    const controls = this.controls = new OrbitControls(this.camera)
    controls.maxPolarAngle = 1.5
    controls.minPolarAngle = 0.5
    controls.rotateSpeed = 5.0
    controls.zoomSpeed = 5
    controls.panSpeed = 2
    controls.onZoom = false
    controls.noPan = false
    controls.staticMoving = true
    controls.dynamicDampingFactor = 0.3
    controls.minDistance = 10
    controls.maxDistance = 800
  }

  animate() {
    window.requestAnimationFrame(this.animate)
    this.controls.update()
    this.render()
  }


  render() {
    this.renderer.render(this.scene, this.camera)
    // 将this的指向用bind方法强制给指向到这个class
    window.requestAnimationFrame(this.render.bind(this))
  }
}
