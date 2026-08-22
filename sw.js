const CACHE="calculadora-dialli-v5";

self.addEventListener("install",e=>
  e.waitUntil(
    caches.open(CACHE)
    .then(c=>c.addAll([
      "./",
      "./index.html",
      "./manifest.json"
    ]))
    .then(()=>self.skipWaiting())
  )
);

self.addEventListener("activate",e=>
  e.waitUntil(
    caches.keys()
    .then(keys=>
      Promise.all(
        keys
        .filter(x=>x!==CACHE)
        .map(x=>caches.delete(x))
      )
    )
    .then(()=>self.clients.claim())
  )
);

self.addEventListener("fetch",e=>{

  if(e.request.method!=="GET") return;

  e.respondWith(

    fetch(e.request)
    .then(r=>{

      if(r.ok){

        const copia=r.clone();

        caches.open(CACHE)
        .then(c=>c.put(e.request,copia));

      }

      return r;

    })
    .catch(()=>
      caches.match(e.request)
    )

  );

});
