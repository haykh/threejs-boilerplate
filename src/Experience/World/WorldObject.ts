import { Scene } from "three";
import type Resources from "../Utils/Resources";
import type { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import type Debug from "../Utils/Debug";

export interface WorldObjectOptions {
  scene: Scene;
  resources: Resources;
  debug: Debug;
}

export default class WorldObject {
  public readonly label: string;

  protected scene: Scene;
  protected resources: Resources;
  public debugFolder: GUI | null = null;

  constructor(label: string, opts: WorldObjectOptions) {
    this.label = label;
    this.scene = opts.scene;
    this.resources = opts.resources;

    if (opts.debug.active) {
      this.debugFolder = opts.debug.getUI().addFolder(this.label);
    }
  }
}
