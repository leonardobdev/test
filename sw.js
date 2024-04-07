
var CACHE_NAME = "App";
var URLS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/src/js/main.js",
    "/src/css/main.css",
    "/src/img/animated_favicon1.gif",
    "/src/img/favicon.ico",
    "/src/img/logo.jpg",
    "/src/img/logo.svg",
    "/src/img/x48.png",
    "/src/img/x72.png",
    "/src/img/x96.png",
    "/src/img/x128.png",
    "/src/img/x192.png",
    "/src/img/x384.png",
    "/src/img/x512.png",
    "/src/img/x1024.png",
];

self.oninstall = async event => {
    event.waitUntil(async () => {

        let cache = await caches.open(CACHE_NAME);

        console.log('[sw] installing cache: ' + CACHE_NAME);
        await cache.addAll(URLS);

        return;

    });
};

URLS = URLS.map((v) => "/" + CACHE_NAME + v);

self.onfetch = async event => {
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {

            let request = event.request;
            let cachedResponse = await cache.match(request);
            let updatedResponse = await fetch(request);
            let response = '';

            if (cachedResponse) {

                if (updatedResponse.status === 200) {

                    let cachedEtag = cachedResponse.headers.get('etag');
                    let updatedEtag = updatedResponse.headers.get('etag');

                    if (cachedEtag === updatedEtag) {

                        console.log('[sw] fetching from cache: ' + request.url);
                        response = cachedResponse

                    } else {

                        console.log('[sw] fetching from network: ' + request.url);
                        response = updatedResponse;

                        console.log('[sw] deleting from cache: ' + request.url);
                        await cache.delete(request);

                        console.log('[sw] adding on cache: ' + request.url);
                        await cache.add(request, updatedResponse);

                    }

                }

            } else {

                response = updatedResponse;

            }

            return response;

        })
    );
};