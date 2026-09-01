const VERSION='video-fight-2026.09.01.5';
const CORE=['./','./index.html','./peer.min.js','./manifest.webmanifest','./icon.svg',
  './assets/studio-arena-v1.png','./assets/space-arena-v1.png','./assets/barbie-arena-v1.png',
  './assets/nina-charge-v1.png','./assets/fighters/guy-idle-v1.png','./assets/fighters/tomer-idle-v1.png'];
self.addEventListener('install', event=>event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate', event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('video-fight-')&&key!==VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin) return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone(); caches.open(VERSION).then(cache=>cache.put('./index.html',copy)); return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request,{ignoreSearch:true}).then(hit=>hit||fetch(event.request).then(response=>{
    const copy=response.clone(); caches.open(VERSION).then(cache=>cache.put(event.request,copy)); return response;
  }).catch(()=>caches.match('./index.html'))));
});
