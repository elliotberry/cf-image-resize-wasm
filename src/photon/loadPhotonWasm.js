import wasm from "./photon.wasm";
import * as photon from "./photon_rs_bg.js";
const loadPhotonWasm = () => {
    const instance = new WebAssembly.Instance(wasm, {
        "./photon_rs_bg.js": photon,
    });
    photon.setWasm(instance.exports);
};
export default loadPhotonWasm;
