import { type Scene } from "three";
import type Resources from "../Utils/Resources";
import { type GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import type Debug from "../Utils/Debug";
import type Renderer from "../Renderer";
import type Sizes from "../Utils/Sizes";

export interface WorldObjectOptions {
  scene: Scene;
  renderer: Renderer;
  sizes: Sizes;
  resources: Resources;
  debug: Debug;
}

export default class WorldObject {
  public readonly label: string;

  protected scene: Scene;
  protected renderer: Renderer;
  protected sizes: Sizes;
  protected resources: Resources;

  public debugFolder: GUI | null = null;

  constructor(label: string, opts: WorldObjectOptions) {
    this.label = label;
    this.scene = opts.scene;
    this.renderer = opts.renderer;
    this.sizes = opts.sizes;
    this.resources = opts.resources;

    if (opts.debug.active) {
      this.debugFolder = opts.debug.getUI().addFolder(this.label);
    }
  }

  destroy() {
    this.debugFolder?.destroy();
  }
}
