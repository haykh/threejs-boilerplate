import type Debug from "../Utils/Debug";
import type Time from "../Utils/Time";
import Environment from "./Environment";
import WorldObject, { type WorldObjectOptions } from "./WorldObject";

interface WorldOptions extends WorldObjectOptions {}

export default class World extends WorldObject {
  private debug: Debug;
  public environment: Environment | null = null;

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
  }

  update(time: Time) {}

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
    if (this.environment !== null) {
      this.environment.destroy();
    }
  }
}
