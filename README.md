# cf-image-resize-proxy-wasm

- Image Resize Proxy for [Cloudflare Workers](https://workers.cloudflare.com/)
- Use WebAssembly library for image resizing ([photon](https://silvia-odwyer.github.io/photon/))


https://codepen.io/DADDY-CAT/pen/wvLjwyd


## Usage

```
https://<your-worker-url>/?url=<image_url>&w=<resized_width_in_pixel>
```

**Example**

```
https://resizr.daddy.workers.dev/resize/?url=https://c7.alamy.com/comp/H74MCK/woman-humans-human-beings-people-folk-persons-human-human-being-present-H74MCK.jpg&w=100
```
