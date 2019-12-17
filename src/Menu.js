import * as THREE from 'three';
import C from 'cannon';
import j from './fonts/lato_black.json';
import { ev } from './utils';

export default class Menu {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.$els = document.querySelectorAll('.mainNav__link');
    this.W = window.innerWidth - window.innerWidth / 2;
    this.H = window.innerHeight - window.innerHeight / 2;
    this.menu = new THREE.Group();
    this.baseColor = '#70C5B2';

    this.matbox = new C.Material({
      restitution: 0.1,
      friction: 0.2
    });
    const loader = new THREE.FontLoader();
    const font = loader.parse(j);

    this.createMenu(font);

    this.bindEvents();
  }

  bindEvents() {
    [...this.$els].forEach($el => {
      $el.addEventListener('click', e => {
        this.onClick(e);
      });
      $el.addEventListener('mouseenter', e => {
        this.onMouseEnter(e);
      });
      $el.addEventListener('mouseleave', e => {
        this.onMouseLeave(e);
      });
    });
  }

  createMenu(f) {
    [...this.$els].forEach($el => {
      console.log('$e: ', $el);
      let { left, top, width, height } = $el.getBoundingClientRect();
      console.log('left, top, width, height: ', left, top, width, height);
      let geo;
      if ($el.id === 'sub') {
        top = top + 75;
        //left = left - 3;
        geo = new THREE.TextBufferGeometry($el.innerText, {
          font: f,
          size: 30,
          height: 1
        });
      } else {
        geo = new THREE.TextBufferGeometry($el.innerText, {
          font: f,
          size: 80,
          height: 1
        });
      }

      const mat = new THREE.MeshPhongMaterial({ color: this.baseColor });

      const mesh = new THREE.Mesh(geo, mat);
      const x = left - this.W * 0.5;
      const y = this.H * 0.5 - top - height;

      mesh.position.set(x, y, 0);
      mesh.geometry.computeBoundingBox();

      this.menu.add(mesh);

      mesh.$el = $el;

      const body = new C.Body({
        mass: 0,
        position: new C.Vec3(x + width / 2, y + height / 2, 0),
        shape: new C.Box(new C.Vec3(width / 2, height / 2, 300)),
        material: this.matbox
      });

      mesh.body = body;
    });

    this.scene.add(this.menu);
  }

  onClick(e) {
    e.preventDefault();
  }

  onMouseEnter(e) {
    const menuEl = this.menu.children.find(
      menu => menu.$el === e.currentTarget
    );

    ev('enter', { target: menuEl });

    this.world.addBody(menuEl.body);
  }

  onMouseLeave(e) {
    const menuEl = this.menu.children.find(
      menu => menu.$el === e.currentTarget
    );

    ev('leave', { target: menuEl });

    this.world.removeBody(menuEl.body);
  }
}
