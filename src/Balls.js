import * as THREE from "three";
import C from "cannon";
import gsap from "gsap";

const colors = [0x1affc1];

export default class Balls {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.count = 1200;
    this.size = 3;
    this.W = window.innerWidth * 2;
    this.H = window.innerHeight   * 2;
    this.target = new THREE.Vector3();

    this.setup();
  }

  setup() {
    const color = gsap.utils.random(colors);
    this.mesh = new THREE.InstancedMesh(
      new THREE.SphereBufferGeometry(this.size, 16, 16),
      new THREE.MeshPhongMaterial({ color: color }),
      this.count
    );

    this.scene.add(this.mesh);

    this.bodies = [];

    for (let i = 0; i < this.count; i++) {
      const x = THREE.Math.randFloatSpread(this.W);
      const y = THREE.Math.randFloatSpread(this.H);
      const z = THREE.Math.randFloatSpread(500);
      const scl = THREE.Math.randFloatSpread(0.5) + 1;

      const body = new C.Body({
        mass: 0.4,
        linearDamping: 0.3,
        position: new C.Vec3(x, y, z),
        shape: new C.Sphere(this.size * scl),
        material: new C.Material({
          restitution: 0.5,
          friction: 0.9
        })
      });
      body.scale = new THREE.Vector3(scl, scl, scl);

      this.bodies.push(body);
      this.world.addBody(body);
    }

    this.setPosition();
  }

  setPosition() {
    for (let i = 0; i < this.count; i++) {
      const body = this.bodies[i];
      const dummy = new THREE.Matrix4();
      dummy.compose(
        new THREE.Vector3().copy(body.position),
        new THREE.Quaternion(),
        new THREE.Vector3().copy(body.scale)
      );

      this.mesh.setMatrixAt(i, dummy);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  update() {
    this.setPosition();
  }

  attract(target) {
    //this.target.copy(target);
    this.bodies.forEach((body, i) => {
      const bodyPos = this.target.copy(body.position);
      const f = new THREE.Vector3().subVectors(target, bodyPos);

      body.applyForce(new C.Vec3(f.x, f.y, f.z), new C.Vec3());
    });
  }
}
