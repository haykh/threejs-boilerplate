import type { Scene } from "three";
import type Resources from "../Utils/Resources";
import type Debug from "../Utils/Debug";
import type Time from "../Utils/Time";
import Environment from "./Environment";

interface WorldOptions {
  scene: Scene;
  resources: Resources;
  debug: Debug;
}

export default class World {
  private scene: Scene;
  private resources: Resources;
  private debug: Debug;
  public environment: Environment | null;

  constructor(opts: WorldOptions) {
    this.scene = opts.scene;
    this.resources = opts.resources;
    this.debug = opts.debug;

    this.environment = null;

    if (this.resources.isReady) {
      this.environment = new Environment(this.opts());
    } else {
      this.resources.on("ready", () => {
        this.environment = new Environment(this.opts());
      });
    }
  }

  update(time: Time) {}

  opts() {
    return {
      scene: this.scene,
      resources: this.resources,
      debug: this.debug,
    };
  }

  destroy() {
    if (this.environment !== null) {
      this.environment.destroy();
    }
  }
}
