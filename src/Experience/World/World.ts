import type { Scene, WebGLRenderer, Camera } from "three";
import { type GUI } from "three/addons/libs/lil-gui.module.min.js";

import type Resources from "../Utils/Resources";

export interface WorldOptions {
  time: { elapsedSec: number };
  scene: Scene;
  renderer: { instance: WebGLRenderer };
  camera: { instance: Camera };
  sizes: {
    width: number;
    height: number;
    pixelRatio: number;
    pixelResolution: { x: number; y: number };
  };
  resources: Resources;
  debug: { active: boolean; getUI: () => GUI };
}

export class World {
  protected time: { elapsedSec: number };
  protected sizes: {
    width: number;
    height: number;
    pixelRatio: number;
    pixelResolution: { x: number; y: number };
  };
  protected scene: Scene;
  protected renderer: WebGLRenderer;
  protected camera: Camera;
  protected resources: Resources;
  protected debug: { active: boolean; getUI: () => GUI };

  public debugFolder: GUI | null = null;

  constructor(opts: WorldOptions) {
    this.time = opts.time;
    this.sizes = opts.sizes;
    this.scene = opts.scene;
    this.renderer = opts.renderer.instance;
    this.camera = opts.camera.instance;
    this.resources = opts.resources;
    this.debug = opts.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.getUI().addFolder("world");
    }

    if (this.resources.isReady) {
      this.initialize();
    } else {
      this.resources.on("ready", () => {
        this.initialize();
      });
    }
  }

  initialize() {}

  update() {}

  opts() {
    return {
      time: this.time,
      sizes: this.sizes,
      scene: this.scene,
      renderer: this.renderer,
      camera: this.camera,
      resources: this.resources,
      debug: this.debug,
    };
  }

  destroy() {
    this.debugFolder?.destroy();
  }
}
