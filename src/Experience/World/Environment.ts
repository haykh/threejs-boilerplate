import { DirectionalLight } from "three";
import type { Texture, Scene } from "three";
import type { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import type Debug from "../Utils/Debug";
import type Resources from "../Utils/Resources";

interface EnvironmentOptions {
  scene: Scene;
  resources: Resources;
  debug: Debug;
}

export default class Environment {
  private scene: Scene;
  private resources: Resources;
  public debugFolder: GUI | null = null;
  public directionalLight: DirectionalLight | null = null;

  constructor(opts: EnvironmentOptions) {
    this.scene = opts.scene;
    this.resources = opts.resources;

    if (opts.debug.active) {
      this.debugFolder = opts.debug.getUI().addFolder("environment");
    }

    // this.directionalLight = new DirectionalLight("#ffffff", 2);
    // this.directionalLight.castShadow = true;
    // this.directionalLight.shadow.camera.far = 15;
    // this.directionalLight.shadow.mapSize.set(1 << 10, 1 << 10);
    // this.directionalLight.shadow.normalBias = 0.05;
    // this.directionalLight.position.set(3.5, 2, -1.24);
    // this.scene.add(this.directionalLight);

    if (this.resources.items.environmentMapTexture !== null) {
      this.scene.environment = this.resources.items
        .environmentMapTexture as Texture;
      this.scene.environmentIntensity = 0.5;
    }

    if (this.debugFolder !== null) {
      if (this.scene.environment !== null) {
        this.debugFolder
          .add(this.scene, "environmentIntensity")
          .name("envMapIntensity")
          .min(0)
          .max(4)
          .step(0.001);
        // .onChange(() => {
        //   this.scene.environment!.needsUpdate = true;
        // });
      }
    }
  }

  destroy() {
    if (this.debugFolder !== null) {
      this.debugFolder.destroy();
    }
    if (this.scene.environment !== null) {
      (this.scene.environment as Texture).dispose();
    }
    if (
      this.directionalLight !== null &&
      this.directionalLight.shadow.map !== null
    ) {
      this.directionalLight.shadow.map.dispose();
    }
  }
}
