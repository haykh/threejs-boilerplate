import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Camera from "./Camera";

interface RendererOptions {
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  camera: Camera;
}

export default class Renderer {
  private sizes: Sizes;
  private scene: THREE.Scene;
  private canvas: HTMLCanvasElement;
  private camera: Camera;

  public instance: THREE.WebGLRenderer;

  constructor(opts: RendererOptions) {
    this.sizes = opts.sizes;
    this.scene = opts.scene;
    this.canvas = opts.canvas;
    this.camera = opts.camera;

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    // this.instance.toneMapping = THREE.CineonToneMapping;
    // this.instance.toneMappingExposure = 1.75;
    // this.instance.shadowMap.enabled = true;
    // this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    // this.instance.setClearColor("#211d20");
    this.resize();
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }

  destroy() {
    this.instance.dispose();
  }
}
