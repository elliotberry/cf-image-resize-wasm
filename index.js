import {Router} from 'itty-router';
import resizeImage from './src/resize.js';
import {before, after} from './src/middlewares.js';
import {getVars, getVarsTiny} from './src/get-vars.js';
import form from './src/form.html';

const router = Router({
  before: [before],
  finally: [after],
});


router.get('/', async request => {
  return new Response(form, {
    headers: {'content-type': 'text/html'},
  });
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
