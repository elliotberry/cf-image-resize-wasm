const hash = async string => {
  const myText = new TextEncoder().encode(string);

  const digest = await crypto.subtle.digest(
    {
      name: 'SHA-256',
    },
    myText,
  );
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
};

const checkKVCache = async (kv, key) => {
  let value = await kv.get(key);
  if (value) {
    return value;
  }
  return null;
};

const setKVCache = async (kv, key, value) => {
  await kv.put(key, value);
};

const KVCache = kv => {
  return {
    get: async request => {
      let key = await hash(request.url);
      return await checkKVCache(kv, key);
    },
    put: async (request, response) => {
      let key = await hash(request.url);
      let value = await response.text();
      await setKVCache(kv, key, value);
    },
  };
};

export default KVCache;
