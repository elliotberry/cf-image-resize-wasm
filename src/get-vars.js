
import {StatusError} from 'itty-router';

const fail = message => {
  throw new StatusError(400, message);
};

const tryURL = url => {
  try {
    let theurl = new URL(url);
    return theurl;
  } catch (e) {
    return false;
  }
};

const tryBase64 = str => {
  try {
    let decoded = atob(str);
    return decoded;
  } catch (e) {
    return false;
  }
};


const getVars = async req => {
  let target = req.paramz.url || req.paramz.u || req.paramz.target;
  if (!target) {
    fail('No target param!');
  }

 let targetHeight = null;

  let decodedTarget = decodeURIComponent(target);
  let finalURL = tryURL(decodedTarget);
  if (finalURL === false) {
    let b64 = tryBase64(target);
    if (b64 !== false) {
      finalURL = tryURL(b64);
      if (finalURL === false) {
        fail('Invalid base64 URL');
      }
    } else {
      fail('no url param we recognize');
    }
  }

  const targetWidthStr = req.paramz.w || req.paramz.width;
  
  const targetWidth = targetWidthStr ? parseInt(targetWidthStr, 10) : null;
  if (isNaN(targetWidth) || targetWidth < 1) {
    fail('width param is invalid');
  }
const targetHeightStr = req.paramz.h || req.paramz.height;
if (targetHeightStr) {
  targetHeight = parseInt(targetHeightStr, 10);
  if (isNaN(targetHeight) || targetHeight < 1) {
    fail('height param is invalid');
  }
}

  return {finalURL, targetWidth, targetHeight};
};

const getVarsTiny = async req => {
  let target = req.paramz.url || req.paramz.u || req.paramz.target;
  if (!target) {
    fail('No target param!');
  }

  //let result = await tryURL(target);

  let decodedTarget = decodeURIComponent(target);
  let finalURL = tryURL(decodedTarget);
  if (finalURL === false) {
    let b64 = tryBase64(target);
    if (b64 !== false) {
      finalURL = tryURL(b64);
      if (finalURL === false) {
        fail('Invalid base64 URL');
      }
    } else {
      fail('no url param we recognize');
    }
  }

  return {finalURL};
};
export {getVarsTiny, getVars};
