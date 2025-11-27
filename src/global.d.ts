import Experience from "./Experience/Experience";

export {};
declare global {
  interface Window {
    experience?: Experience;
  }
}
