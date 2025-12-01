import { CanvasTexture } from "three";
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

export class DebugCanvas {
  public instance: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public texture: CanvasTexture;

  constructor(
    textureSize: { width: number; height: number } = {
      width: 128,
      height: 128,
    },
    displaySize: { width: number; height: number } = {
      width: 380,
      height: 380,
    },
  ) {
    this.instance = document.createElement("canvas");
    this.instance.width = textureSize.width;
    this.instance.height = textureSize.height;
    this.instance.style.width = `${displaySize.width}px`;
    this.instance.style.height = `${displaySize.height}px`;
    this.instance.style.position = "fixed";
    this.instance.style.top = "0";
    this.instance.style.left = "0";
    this.instance.style.zIndex = "10";
    document.body.append(this.instance);

    this.context = this.instance.getContext("2d")!;
    this.texture = new CanvasTexture(this.instance);
  }

  update() {
    this.texture.needsUpdate = true;
  }
}
