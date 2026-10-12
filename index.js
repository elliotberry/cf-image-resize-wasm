import {Router, text} from 'itty-router';
import resizeImage from './src/resize.js';
import {before, after} from './src/middlewares.js';
import {getVars, getVarsTiny} from './src/get-vars.js';
import fetchImage from './src/fetch-image.js';
import form from './src/form.html';
import routesText from './src/routes.txt';

const router = Router({
  before: [before],
  finally: [after],
  catch: error => {
    const status = Number.isInteger(error?.status) ? error.status : 500;
    const message = error?.message || 'Something went wrong.';
    return text(message, {status});
  },
});

router.get('/', async () => {
  return new Response(routesText, {
    headers: {'content-type': 'text/plain; charset=utf-8'},
  });
});

router.get('/form', async () => {
  return new Response(form, {
    headers: {'content-type': 'text/html'},
  });
});

router.get('/favicon.ico', () => new Response(null, {status: 204}));

router.get('/tiny', async request => {
  const vars = await getVarsTiny(request);

  let {finalURL} = vars;

  const res = await fetchImage(finalURL);

  let mime = res.headers.get('Content-Type');

  const receivedBuffer = await res.arrayBuffer();
  let {imageBytes} = resizeImage(receivedBuffer, 20, null);

  return new Response(imageBytes, {
    headers: {'content-type': mime},
  });
});

router.get('/resize', async request => {
  const vars = await getVars(request);

  let {finalURL, targetWidth, targetHeight} = vars;

  const res = await fetchImage(finalURL);

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

router.all('*', request => {
  const path = new URL(request.url).pathname;
  return text(
    `Not found: ${path}\n\nOpen / for usage, or /form to resize an image.`,
    {status: 404},
  );
});

export default router;
