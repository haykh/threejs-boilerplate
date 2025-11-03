import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  width: number;
  height: number;
  pixelRatio: number;

  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(2, window.devicePixelRatio);

    window.addEventListener("resize", () => {
      this.resize();
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(2, window.devicePixelRatio);

    this.trigger("resize");
  }

  destroy() {
    window.removeEventListener("resize", () => {
      this.resize();
    });
  }
}
