import { ShaderMaterial, Uniform, Color } from "three";
import type { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import type Debug from "./Debug";
import type Time from "./Time";
import type Sizes from "./Sizes";

interface CustomShaderMaterialOptions {
  vertexShader: string;
  fragmentShader: string;
  debug: Debug;
  sizes: Sizes;
}

export default class CustomShaderMaterial {
  private sizes: Sizes;
  public debugFolder: GUI | null = null;
  public instance: ShaderMaterial;

  constructor(opts: CustomShaderMaterialOptions) {
    this.sizes = opts.sizes;
    if (opts.debug.active) {
      this.debugFolder = opts.debug.getUI().addFolder("Shader material");
    }

    this.instance = new ShaderMaterial({
      vertexShader: opts.vertexShader,
      fragmentShader: opts.fragmentShader,
      uniforms: {
        uTime: new Uniform(0),
        uResolution: new Uniform(this.sizes.pixelResolution),
      },
    });
  }

  addUniform(
    name: string,
    value: any,
    label: string | undefined = undefined,
    addUI: boolean = true,
    options: Array<number> = [],
  ) {
    this.instance.uniforms[name] = new Uniform(value);
    if (!addUI) return;
    this.debugFolder
      ?.add(this.instance.uniforms[name], "value", ...options)
      .name(label || name);
  }

  addColorUniform(
    name: string,
    value: string,
    label: string | undefined = undefined,
    addUI: boolean = true,
  ) {
    const colorParam = { value: value };
    this.instance.uniforms[name] = new Uniform(new Color(value));
    if (!addUI) return;
    this.debugFolder
      ?.addColor(colorParam, "value")
      .name(label || name)
      .onChange(() => {
        this.instance.uniforms[name].value.set(new Color(colorParam.value));
      });
  }

  update(time: Time) {
    this.instance.uniforms.uTime.value = time.elapsedSec;
  }

  destroy() {
    this.instance.dispose();
  }
}
