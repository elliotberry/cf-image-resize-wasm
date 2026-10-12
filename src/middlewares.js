const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Expose-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Thoughts': '',
};

const appendHeadersAndReturn = (response, headers) => {
  for (const [key, value] of Object.entries(headers)) {
    if (value) response.headers.set(key, value); // Use `set` to avoid duplicate headers
  }
  return response;
};

function parseUrlParams(url) {
  const params = new URL(url).searchParams;
  const paramObject = {};

  for (const [key, value] of params) {
    paramObject[key] = value.includes(',') ? value.split(',') : value; // Handle comma-separated values
  }

  return paramObject;
}

const before = async (request) => {
  if (request.method === 'OPTIONS') {
    // Return preflight response with appropriate headers
    return new Response(null, {
      status: 204,
      headers: {
        ...defaultHeaders,
        'Access-Control-Max-Age': '86400', // Cache preflight response for 24 hours
      },
    });
  }
  let obj = parseUrlParams(request.url);
  request.paramz = obj;
  if (request.url.includes("clear-cache")) {
    const cache = caches.default;
    await cache.delete(request.url);
    request.shouldCache = false;
  }

  if (!request.url.includes('nocache')) {
    const cache = caches.default;
    const cachedResponse = await cache.match(request.url);
    if (cachedResponse) {
      console.log('Serving from cache');
      return cachedResponse;
    } else {
      request.shouldCache = true;
    }
  } else {
    console.log('Cache bypassed');
  }
};

const authenticateRequest = (request) => {
  // Replace this with a proper authentication mechanism
  const clientIP = request.headers.get("CF-Connecting-IP");
  if (clientIP !== "130.44.182.125") {
    return new Response("Unauthorized access", { status: 401 }); // Changed to 401 for proper HTTP compliance
  }
}

const shouldCache = (response, request) => {
  return Boolean(
    response &&
    request?.shouldCache &&
    request.method === 'GET' &&
    !request.url.includes('nocache') &&
    response.status === 200
  );
};

const after = async (response, request) => {
  if (!response) {
    const path = new URL(request.url).pathname;
    response = new Response(
      `Not found: ${path}\n\nOpen / for usage, or /form to resize an image.`,
      {
        status: 404,
        headers: {'content-type': 'text/plain; charset=utf-8'},
      },
    );
  }

  if (shouldCache(response, request)) {
    try {
      const cache = caches.default;
      await cache.put(request.url, response.clone());
    } catch (err) {
      console.log('Cache write skipped:', err?.message || err);
    }
  }

  const respy = new Response(response.body, response)
  return appendHeadersAndReturn(respy, defaultHeaders)
};

export { before, after };