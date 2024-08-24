

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
    throw new Error('No target param!');
  }

  //let result = await tryURL(target);

  let decodedTarget = decodeURIComponent(target);
  let finalURL = tryURL(decodedTarget);
  if (finalURL === false) {
    let b64 = tryBase64(target);
    if (b64 !== false) {
      finalURL = tryURL(b64);
      if (finalURL === false) {
        throw new Error('Invalid base64 URL');
      }
    } else {
      throw new Error('no url param we recognize');
    }
  }

  const targetWidthStr = req.paramz.w || req.paramz.width;
  if (!targetWidthStr) {
    throw new Error('No width param!');
  }
  const targetWidth = targetWidthStr ? parseInt(targetWidthStr, 10) : null;
  if (isNaN(targetWidth) || targetWidth < 1) {
    throw new Error('width param is invalid');
  }
  return {finalURL, targetWidth};
};

const getVarsTiny = async req => {
  let target = req.paramz.url || req.paramz.u || req.paramz.target;
  if (!target) {
    throw new Error('No target param!');
  }

  //let result = await tryURL(target);

  let decodedTarget = decodeURIComponent(target);
  let finalURL = tryURL(decodedTarget);
  if (finalURL === false) {
    let b64 = tryBase64(target);
    if (b64 !== false) {
      finalURL = tryURL(b64);
      if (finalURL === false) {
        throw new Error('Invalid base64 URL');
      }
    } else {
      throw new Error('no url param we recognize');
    }
  }

  return {finalURL};
};
export {getVarsTiny, getVars};
