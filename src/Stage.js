import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import C from 'cannon';
import Balls from './Balls';
import Menu from './Menu';
import gsap from 'gsap';
import { map } from './utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CannonDebugRenderer from './utils/CannonDebugRenderer';

// CONSTANTS
const perspective = 3000;
const colors = [0xcc8017];

export default class Scene {
  constructor() {
    this.$container = document.getElementById('stage');

    this.W = window.innerWidth;
    this.H = window.innerHeight;

    this.world = new C.World();
    this.world.gravity.set(-1, 1, -1);

    this.mouse = new THREE.Vector3();
    this.targets = [];

    this.clock = new THREE.Clock();

    this.setup();
    this.bindEvents();
    
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.onResize();
    });
    window.addEventListener('mousemove', e => {
      this.onMouseMove(e);
    });

    document.addEventListener('enter', ({ detail }) => {
      this.onEnter(detail.target);
    });
    document.addEventListener('leave', ({ detail }) => {
      this.onLeave(detail.target);
    });
  }

  // Setups

  setup() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x202533, 1, 6000);

    this.setCamera();
    this.setLights();
    this.setRender();

    this.setControls();

    //this.dbr = new CannonDebugRenderer(this.scene, this.world);

    this.addObjects();

    this.setupControls();
    
  }

  setRender() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.$container
    });
    this.renderer.setClearColor('#F0E68C');
    this.renderer.setSize(this.W, this.H);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.shadowMap.enabled = true;

    this.renderer.setAnimationLoop(() => {
      this.draw();
    });
  }

  setCamera() {
    const fov = (90 * (2 * Math.atan(this.H / 1 / perspective))) / Math.PI;
    console.log('fov: ', fov);

    this.camera = new THREE.PerspectiveCamera(fov, this.W / this.H, 10, 6000);
    this.camera.position.set(-2200, -200, 2000);
  }

  setLights() {
    const ambient = new THREE.AmbientLight(0xeeeeee);
    this.scene.add(ambient);

    this.light = new THREE.PointLight(0xffffff, 0.5);
    this.light.position.set(200, 200, 400);
    this.light.castShadow = true;
    this.scene.add(this.light);
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableKeys = false;
    this.controls.update();
  }

  // Actions
  addObjects() {
    this.balls = new Balls(this.scene, this.world);
    this.menu = new Menu(this.scene, this.world);
    //this.egg = new Egg(this.scene, this.world);

    this.mouseBody = new C.Body({
      mass: 0,
      position: new C.Vec3(),
      shape: new C.Sphere(150)
    });

    this.world.addBody(this.mouseBody);
  }

  setupControls() {}

  // Loop
  draw() {
    this.balls.update();

    gsap.to([this.mouseBody.position, this.light.position], 0.5, {
      x: this.mouse.x,
      y: this.mouse.y
    });

    if (this.targets.length > 0) {
      this.targets.forEach(target =>
        this.balls.attract(
          new THREE.Vector3(
            target.body.position.x,
            target.body.position.y,
            target.body.position.z
          )
        )
      );
    }

    this.updatePhysics();
    this.renderer.render(this.scene, this.camera);
  }

  updatePhysics() {
    //this.dbr.update();
    this.world.step(1 / 60, this.clock.getDelta(), 1000);
  }

  // Handlers
  onResize() {
    this.W = window.innerWidth;
    this.H = window.innerHeight;

    this.camera.aspect = this.W / this.H;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.W, this.H);
  }

  onMouseMove(event) {
    gsap.to(this.mouse, 0.5, {
      x: map(event.clientX, 0, this.W, -this.W * 0.5, this.W * 0.5),
      y: map(event.clientY, this.H, 0, -this.H * 0.5, this.H * 0.5)
    });
  }

  onEnter(mesh) {
    this.targets.push(mesh);
  }

  onLeave(mesh) {
    const idx = this.targets.findIndex(el => el === mesh);
    this.targets.splice(idx, 1);
  }
}
