import {AutoRouter, cors} from 'itty-router';
import resizeImage from './src/resize.js';
import {before, after} from './src/middlewares.js';
import {getVars, getVarsTiny} from './src/get-vars.js';



const router = AutoRouter({
  before: [before],
  finally: [after],
});





router.get('/tiny', async request => {
  const vars = await getVarsTiny(request);

  let {finalURL} = vars;

  const res = await fetch(finalURL);
  if (!res.ok || res.status !== 200) {
    throw new Error('Failed to fetch: ' + res.status + ' ' + res.statusText);
  }

  let mime = res.headers.get('Content-Type');

  const receivedBuffer = await res.arrayBuffer();
  let {imageBytes} = resizeImage(receivedBuffer, 20);

  return new Response(imageBytes, {
    headers: {'content-type': mime},
  });
});

router.get('/resize', async request => {
  const vars = await getVars(request);

  let {finalURL, targetWidth, targetHeight} = vars;

  const res = await fetch(finalURL);
  if (!res.ok || res.status !== 200) {
    throw new Error('Failed to fetch: ' + res.status + ' ' + res.statusText);
  }

  let mime = res.headers.get('Content-Type');

  const receivedBuffer = await res.arrayBuffer();
  if (targetWidth === null && targetHeight === null) {
    return new Response(receivedBuffer, {
      headers: {'content-type': mime},
    });
  }
  let {imageBytes} = resizeImage(receivedBuffer, targetWidth, targetHeight);

  return new Response(imageBytes, {
    headers: {'content-type': mime},
  });
});

export default router;
