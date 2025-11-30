import { Mesh, SphereGeometry } from "three";
import type Debug from "../Utils/Debug";
import type Time from "../Utils/Time";
import Environment from "./Environment";
import WorldObject, { type WorldObjectOptions } from "./WorldObject";
import CustomShaderMaterial from "../Utils/CustomShaderMaterial";

import vertexShader from "../shaders/shader.vert";
import fragmentShader from "../shaders/shader.frag";

interface WorldOptions extends WorldObjectOptions {}

export default class World extends WorldObject {
  private debug: Debug;
  public environment: Environment | null = null;
  public shader_material: CustomShaderMaterial | null = null;

  constructor(opts: WorldOptions) {
    super("world", opts);
    this.debug = opts.debug;

    if (this.resources.isReady) {
      this.initialize();
    } else {
      this.resources.on("ready", () => {
        this.initialize();
      });
    }
  }

  initialize() {
    this.environment = new Environment(this.opts());

    this.shader_material = new CustomShaderMaterial("shader material", {
      vertexShader,
      fragmentShader,
      ...this.opts(),
    });
    const sphere = new Mesh(
      new SphereGeometry(1, 32, 32),
      this.shader_material.instance,
    );
    this.scene.add(sphere);
  }

  update(time: Time) {
    this.shader_material?.update(time);
  }

  opts() {
    return {
      scene: this.scene,
      resources: this.resources,
      debug: this.debug,
      renderer: this.renderer,
      sizes: this.sizes,
    };
  }

  destroy() {
    super.destroy();
    this.environment?.destroy();
    this.shader_material?.destroy();
  }
}
