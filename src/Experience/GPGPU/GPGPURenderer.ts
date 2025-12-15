import type { Scene } from "three";
import {
  Uniform,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  DoubleSide,
} from "three";
import { type GUI } from "three/addons/libs/lil-gui.module.min.js";
import type GPUComputationRenderer from "./GPGPU";

export interface GPGPURendererOptions {
  scene: Scene;
  gpgpu: GPUComputationRenderer;
  debug: { active: boolean; getUI: () => GUI };

  displayVertexShader: string;
  displayFragmentShader: string;

  pixelResolution: { x: number; y: number };
  uniforms?: { [key: string]: Uniform };
}

export default class GPGPURenderer {
  public readonly label: string;

  protected readonly scene: Scene;
  protected readonly gpgpu: GPUComputationRenderer;

  public readonly debugFolder: GUI | null = null;
  public readonly displayShaderMaterial: ShaderMaterial;
  public readonly displayVariables: Array<string> = [];

  constructor(label: string, opts: GPGPURendererOptions) {
    this.label = label;
    this.scene = opts.scene;
    this.gpgpu = opts.gpgpu;

    if (opts.debug.active) {
      this.debugFolder = opts.debug.getUI().addFolder(this.label);
    }

    this.displayShaderMaterial = new ShaderMaterial({
      vertexShader: opts.displayVertexShader,
      fragmentShader: opts.displayFragmentShader,
      uniforms: {
        uTime: new Uniform(0),
        uResolution: new Uniform(opts.pixelResolution),
        ...opts.uniforms,
      },
      side: DoubleSide,
    });
  }

  addDisplayVariable(variable: string) {
    console.log(`RENDERER: uniform u${variable} added`);
    this.displayVariables.push(variable);
    this.displayShaderMaterial.uniforms[`u${variable}`] = new Uniform(null);
  }

  render() {
    this.displayVariables.forEach((varlabel) => {
      const gpgpuVariable = this.gpgpu.variables[varlabel];
      if (gpgpuVariable === undefined) {
        throw new Error(
          `GPGPU variable u${varlabel} not found when rendering textures`,
        );
      }
      this.displayShaderMaterial.uniforms[`u${varlabel}`].value =
        this.gpgpu.getCurrentRenderTarget(gpgpuVariable).texture;
    });
  }

  destroy() {
    this.debugFolder?.destroy();
    this.displayShaderMaterial.dispose();
  }
}

interface GridSystem2DOptions extends GPGPURendererOptions {
  gridSize: { x: number; y: number };
}

export class GPGPUGridRenderer2D extends GPGPURenderer {
  public readonly gridSize: { x: number; y: number };

  public readonly mesh: Mesh;

  constructor(label: string, opts: GridSystem2DOptions) {
    super(label, opts);
    this.gridSize = opts.gridSize;

    this.mesh = new Mesh(
      new PlaneGeometry((2 * this.gridSize.x) / this.gridSize.y, 2, 1, 1),
      this.displayShaderMaterial,
    );
    this.scene.add(this.mesh);
  }

  destroy() {
    this.mesh.geometry.dispose();
    super.destroy();
  }
}
