import {AutoRouter, cors} from 'itty-router';
import resizeImage from './resize.js';
import {withCacheBefore, withCacheAfter} from './with-cache.js';
import getVars from './get-vars.js';
import withParams from './with-url-params.js';


const {corsify, preflight} = cors();

const router = AutoRouter({
  before: [preflight],
  finally: [corsify],
});


router.all('*', withParams);

router.get('/resize', async request => {
  const vars = await getVars(request);

  let {finalURL, targetWidth} = vars;

  const res = await fetch(finalURL);
  if (!res.ok || res.status !== 200) {
    throw new Error('Failed to fetch: ' + res.status + ' ' + res.statusText);
  }

  let mime = res.headers.get('Content-Type');

  const receivedBuffer = await res.arrayBuffer();
  let {imageBytes} = resizeImage(receivedBuffer, targetWidth);

  return new Response(imageBytes, {
    headers: {'content-type': mime},
  });
});

export default router;
