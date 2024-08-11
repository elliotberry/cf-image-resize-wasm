const withCacheBefore = async (req, env) => {
  req.cached = false;
  let cache = caches.default;
  let cacheKey = req.url;
  let cacheValue = await cache.match(cacheKey);
  if (cacheValue) {
    req.cached = true;
    return new Response(cacheValue);
  }
};

const withCacheAfter = async (resp, req) => {
  if (req.cached === false) {
    if (resp.ok) {
      let cache = caches.default;
      let cacheKey = req.url;

      await cache.put(cacheKey, resp.clone());
    }
  }
};

export {withCacheBefore, withCacheAfter};
