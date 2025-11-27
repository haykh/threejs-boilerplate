import { glsl as _glsl } from "./glsl";
(globalThis as any).glsl = _glsl;
import Experience from "./Experience/Experience";

new Experience(document.querySelector("canvas.webgl"));
