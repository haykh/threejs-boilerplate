import { Scene, Mesh, Material } from "three";
import type { Object3D } from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Resources from "./Utils/Resources";
import Debug from "./Utils/Debug";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import DisposeScene from "./Utils/Dispose";

import sources from "./sources";

export default class Experience {
  public canvas: HTMLCanvasElement;
  public debug: Debug;
  public sizes: Sizes;
  public time: Time;
  public scene: Scene;
  public resources: Resources;
  public camera: Camera;
  public renderer: Renderer;
  public world: World;

  constructor(canvas: HTMLCanvasElement | null) {
    if (canvas === null) {
      throw new Error("Experience received a null for canvas");
    }
    this.canvas = canvas;

    window.experience = this;

    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera(this.opts());
    this.renderer = new Renderer(this.opts());
    this.world = new World(this.opts());

    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time.on("tick", () => {
      this.update();
    });
  }

  opts() {
    return {
      sizes: this.sizes,
      canvas: this.canvas,
      scene: this.scene,
      camera: this.camera,
      resources: this.resources,
      debug: this.debug,
    };
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
    this.world.update(this.time);
  }

  destroy() {
    this.debug.destroy();
    this.sizes.destroy();
    this.time.destroy();

    this.resources.destroy();
    this.camera.destroy();
    this.renderer.destroy();

    this.world.destroy();

    this.sizes.off("resize");
    this.time.off("tick");

    DisposeScene(this.scene);
    this.scene.clear();
  }
}
