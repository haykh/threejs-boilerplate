import type { Scene } from "three";
import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Sizes from "./Utils/Sizes";

interface CameraOptions {
  sizes: Sizes;
  canvas: HTMLCanvasElement;
  scene: Scene;
}

export default class Camera {
  private canvas: HTMLCanvasElement;
  private sizes: Sizes;
  private scene: Scene;

  public instance: PerspectiveCamera;
  public controls: OrbitControls;

  constructor(opts: CameraOptions) {
    this.sizes = opts.sizes;
    this.scene = opts.scene;
    this.canvas = opts.canvas;

    // camera
    this.instance = new PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);

    // controls
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }

  destroy() {
    this.controls.dispose();
  }
}
