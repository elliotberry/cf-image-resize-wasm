import wasm from "./photon.wasm";
import { initSync } from "./photon_rs_bg.js";

const loadPhotonWasm = () => {
  // Cloudflare Workers CompiledWasm imports are WebAssembly.Module instances.
  initSync({ module: wasm });
};

export default loadPhotonWasm;
