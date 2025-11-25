const SourceTypes = ["cubeTexture", "gltfModel", "texture"];

export type Source = {
  name: string;
  type: (typeof SourceTypes)[number];
  paths: string[];
};

export type SourceList = ReadonlyArray<Source>;

export default [];
