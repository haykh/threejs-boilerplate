import {
  BufferGeometry,
  BufferAttribute,
  Points,
  type Scene,
  type DataTexture,
} from "three";
import { type Variable } from "three/examples/jsm/misc/GPUComputationRenderer";
import type GPGPU from "./GPGPU";
import CustomShaderMaterial from "./CustomShaderMaterial";
import type Debug from "./Debug";
import type Sizes from "./Sizes";
import type Time from "./Time";
import { Capitalize } from "./Snippets";

interface ParticleSystemOptions {
  debug: Debug;
  sizes: Sizes;
  scene: Scene;

  count: number;
  gpgpu: GPGPU;
  particleVertexShader: string;
  particleFragmentShader: string;
}

export default class ParticleSystem {
  public readonly label: string;
  public readonly count: number;

  private gpgpu: GPGPU;

  public variables: { [Key: string]: Variable } = {};

  public geometry: BufferGeometry;
  public shaderMaterial: CustomShaderMaterial;
  public points: Points;

  constructor(label: string, opts: ParticleSystemOptions) {
    this.label = label;
    this.count = opts.count;
    this.gpgpu = opts.gpgpu;

    this.geometry = new BufferGeometry();

    this.shaderMaterial = new CustomShaderMaterial(this.label, {
      vertexShader: opts.particleVertexShader,
      fragmentShader: opts.particleFragmentShader,
      ...opts,
    });
    this.shaderMaterial.addUniform(
      `u${Capitalize(this.label)}Size`,
      0.03,
      true,
      "size",
      [0, 1, 0.01],
    );

    this.addAttribute("uv", 2, (x, y, _) => [
      (x + 0.5) / this.gpgpu.textureSize,
      (y + 0.5) / this.gpgpu.textureSize,
    ]);
    this.geometry.setDrawRange(0, this.count);

    this.points = new Points(this.geometry, this.shaderMaterial.instance);

    opts.scene.add(this.points);
  }

  addVariable(variable: string, initTexture: DataTexture, shader: string) {
    this.variables[variable] = this.gpgpu.instance.addVariable(
      `u${Capitalize(this.label)}${Capitalize(variable)}`,
      shader,
      initTexture,
    );
    this.shaderMaterial.addUniform(
      `u${Capitalize(this.label)}${Capitalize(variable)}Texture`,
      null,
      false,
    );
  }

  addAttribute(
    attribute: string,
    size: number,
    attributeBuilder: (x: number, y: number, i: number) => Array<number>,
  ) {
    const bufferArray = new Float32Array(this.count * size);
    for (let y = 0; y < this.gpgpu.textureSize; y++) {
      for (let x = 0; x < this.gpgpu.textureSize; x++) {
        const i = y * this.gpgpu.textureSize + x;
        const attr = attributeBuilder(x, y, i);
        if (attr.length !== size) {
          throw new Error(`attributeBuilder must return length ${size}`);
        }
        for (let k = 0; k < size; k++) {
          bufferArray[i * size + k] = attr[k];
        }
      }
    }
    this.geometry.setAttribute(
      `a${Capitalize(this.label)}${Capitalize(attribute)}`,
      new BufferAttribute(bufferArray, size),
    );
  }

  setVariableDependencies(varname: string, dependencies: Array<string>) {
    this.gpgpu.instance.setVariableDependencies(
      this.variables[varname],
      dependencies.map((depname: string) => this.variables[depname]),
    );
  }

  update(time: Time) {
    this.shaderMaterial.update(time);
  }

  syncFBO() {
    Object.entries(this.variables).forEach(([varlabel, variable]) => {
      this.shaderMaterial.instance.uniforms[
        `u${Capitalize(this.label)}${Capitalize(varlabel)}Texture`
      ].value = this.gpgpu.instance.getCurrentRenderTarget(variable).texture;
    });
  }

  destroy() {
    this.geometry.dispose();
    this.shaderMaterial.destroy();
  }
}
