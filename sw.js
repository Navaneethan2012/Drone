const C = "drone-v1";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (new URL(e.request.url).origin !== location.origin) return;   // camera/sensor traffic is never touched
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;                                              // open instantly from cache, refresh in background
  }));
});
