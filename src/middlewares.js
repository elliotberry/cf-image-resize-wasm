const defaultHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true',
  'access-control-expose-headers': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

const appendHeadersAndReturn = (response, headers) => {
  for (const [key, value] of Object.entries(headers)) {
    if (value) response.headers.append(key, value);
  }
  return response;
};

function parseUrlParams(url) {
  const params = new URL(url).searchParams;
  const paramObject = {};

  for (const [key, value] of params) {
    // Split values by comma if they're comma-separated
    paramObject[key] = value.includes(',') ? value.split(',') : value;
  }

  return paramObject;
}

const before = async request => {
  let obj = parseUrlParams(request.url);
  request.paramz = obj;

  //preflight options request for corsc
  if (request.method == 'OPTIONS') {
    const response = new Response(null, {status: 204});

    return appendHeadersAndReturn(response, defaultHeaders);
  }
  const cache = caches.default;
  const resp = await cache.match(request.url);
  if (resp) {
    return resp;
  } else {
    //after the request, we cache result on cf
    request.shouldCache = true;
  }
};

const after = async (response, request) => {
  if (response?.headers?.get('access-control-allow-origin') || response.status == 101 || response.status === 206 || !response.ok) {
    return response;
  }

  if (request.shouldCache) {
    const cache = caches.default;
    await cache.put(request.url, response.clone());
  }
  const respy = new Response(response.body, response);
  return appendHeadersAndReturn(respy, defaultHeaders);
};

export {before, after};
