const SourceTypes = [
  "cubeTexture",
  "gltfModel",
  "texture",
  "hdrTexture",
] as const;

export type Source = {
  name: string;
  type: (typeof SourceTypes)[number];
  paths: string[];
};

export type SourceList = ReadonlyArray<Source>;

export default [] as Array<Source>;
