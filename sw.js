const C='vf-1788296457';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png','./peer.min.js'];
self.addEventListener('install',e=>{ self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));});
self.addEventListener('activate',e=>{ e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const isDoc = e.request.mode==='navigate' ||
    (e.request.destination==='document') ||
    /\/(index\.html)?(\?.*)?$/.test(new URL(e.request.url).pathname);
  if(isDoc){
    // network-first: players always get the newest build when online
    e.respondWith(fetch(e.request).then(res=>{
      const cp=res.clone(); caches.open(C).then(c=>c.put('./index.html',cp)); return res;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||
    fetch(e.request).then(res=>{ const cp=res.clone();
      caches.open(C).then(c=>c.put(e.request,cp)); return res; })
    .catch(()=>caches.match('./index.html'))));
});
