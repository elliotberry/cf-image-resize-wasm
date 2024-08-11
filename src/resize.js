
import {PhotonImage, resize} from './photon/photon_rs_bg.js';
import loadPhotonWasm from './photon/loadPhotonWasm.js';

loadPhotonWasm();

function b64ToArrayBuffer(base64) {
  return new Uint8Array([...atob(base64)].map(c => c.charCodeAt(0)));
}

function resizeImage(imageBuffer, newWidth) {
  const img = PhotonImage.new_from_byteslice(new Uint8Array(imageBuffer));
  const newHeight = Math.round(img.get_height() * (newWidth / img.get_width()));
  const converted = resize(img, newWidth, newHeight, 1);
  const base64 = converted.get_base64();
  const mime = base64.split(';')[0].replace('data:', '');
  const base64Img = base64.split(',')[1];
  const imageBytes = b64ToArrayBuffer(base64Img);
  return {imageBytes, mime};
}

export default resizeImage;