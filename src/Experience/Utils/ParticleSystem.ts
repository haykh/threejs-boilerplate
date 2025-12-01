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

  gpgpu: GPGPU;
  particleVertexShader: string;
  particleFragmentShader: string;
  count: number;
}

export default class ParticleSystem {
  public readonly label: string;

  private gpgpu: GPGPU;

  public variables: { [Key: string]: Variable } = {};

  public geometry: BufferGeometry;
  public shaderMaterial: CustomShaderMaterial;
  public points: Points;

  constructor(label: string, opts: ParticleSystemOptions) {
    this.label = label;
    this.gpgpu = opts.gpgpu;

    this.geometry = new BufferGeometry();

    this.shaderMaterial = new CustomShaderMaterial(this.label, {
      vertexShader: opts.particleVertexShader,
      fragmentShader: opts.particleFragmentShader,
      ...opts,
    });
    this.shaderMaterial.addUniform(
      `u${Capitalize(this.label)}Size`,
      0.4,
      true,
      "size",
      [0, 1, 0.01],
    );

    const particlesUvArray = new Float32Array(opts.count * 2);

    for (let y = 0; y < this.gpgpu.textureSize; y++) {
      for (let x = 0; x < this.gpgpu.textureSize; x++) {
        const i = y * this.gpgpu.textureSize + x;
        particlesUvArray[i * 2 + 0] = (x + 0.5) / this.gpgpu.textureSize;
        particlesUvArray[i * 2 + 1] = (y + 0.5) / this.gpgpu.textureSize;
      }
    }
    this.geometry.setAttribute(
      `a${Capitalize(this.label)}Uv`,
      new BufferAttribute(particlesUvArray, 2),
    );
    this.geometry.setDrawRange(0, opts.count);

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
