import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";

export default class Debug {
  public readonly active: boolean;
  public readonly ui: GUI | null;

  constructor() {
    this.active = window.location.hash === "#debug";
    this.ui = null;

    if (this.active) {
      this.ui = new GUI();
    }
  }

  getUI(): GUI {
    return this.ui as GUI;
  }

  destroy() {
    this.ui?.destroy();
  }
}
