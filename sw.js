const CACHE_NAME = "calculadora-dialli-v5";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",
  "./icon-180.png",
  "./logo-dialli.png"
];

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
  );

  self.skipWaiting();

});

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>

      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )

    )

  );

  self.clients.claim();

});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(cached => {

        if(cached){
          return cached;
        }

        return fetch(event.request)
          .then(response => {

            if(
              !response ||
              response.status !== 200 ||
              response.type === "opaque"
            ){

              return response;

            }

            const copy=response.clone();

            caches.open(CACHE_NAME)
              .then(cache=>{
                cache.put(event.request,copy);
              });

            return response;

          })
          .catch(()=>{

            return caches.match("./index.html");

          });

      })

  );

});
