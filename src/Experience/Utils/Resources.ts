import { TextureLoader, CubeTextureLoader } from "three";
import { Texture, CubeTexture } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter";
import type { Source, SourceList } from "../sources";

interface Loaders {
  gltfLoader: GLTFLoader;
  textureLoader: TextureLoader;
  cubeTextureLoader: CubeTextureLoader;
}
type Asset = CubeTexture | Texture | GLTF;
interface AssetList {
  [Key: string]: Asset;
}

export default class Resources extends EventEmitter {
  public readonly sources: SourceList;
  private loaders: Loaders;

  public readonly toLoad: number;
  public loaded: number;
  public items: AssetList;

  constructor(sources: SourceList) {
    super();

    this.sources = sources;

    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new TextureLoader(),
      cubeTextureLoader: new CubeTextureLoader(),
    };

    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.items = {};
    this.startLoading();
  }

  startLoading() {
    const onProgress = (_: ProgressEvent) => {};
    const onError = (err: unknown) => {
      console.error(`Error loading asset: ${err}`);
    };
    this.sources.forEach((source) => {
      const type = source.type;
      const name = source.name;
      const paths = source.paths;
      if (type === "gltfModel") {
        if (paths.length === 0) {
          throw new Error(`No path provided for the ${name} source`);
        }
        this.loaders.gltfLoader.load(
          paths[0],
          (file) => {
            this.sourceLoaded(source, file);
          },
          onProgress,
          onError
        );
      } else if (type === "texture") {
        if (paths.length === 0) {
          throw new Error(`No path provided for the ${name} source`);
        }
        this.loaders.textureLoader.load(
          paths[0],
          (file) => {
            this.sourceLoaded(source, file);
          },
          onProgress,
          onError
        );
      } else if (type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(
          paths,
          (file) => {
            this.sourceLoaded(source, file);
          },
          onProgress,
          onError
        );
      }
    });
  }

  sourceLoaded(source: Source, file: Asset) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
    console.log(`${source.name} loaded`);
  }

  destroy() {
    this.off("ready");
    for (const key in this.items) {
      const item = this.items[key];
      if (item instanceof Texture) {
        item.dispose();
      } else if (item instanceof CubeTexture) {
        item.dispose();
      } else if ((item as GLTF).scene) {
        (item as GLTF).scene.traverse((child) => {
          if ((child as any).geometry) {
            (child as any).geometry.dispose();
          }
          if ((child as any).material) {
            const material = (child as any).material;
            if (Array.isArray(material)) {
              material.forEach((mat) => mat.dispose());
            } else {
              material.dispose();
            }
          }
        });
      }
    }
  }
}
