var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/dashboard',
    '/scripts/jquery.min.js',
    '/scripts/deep-diff-0.3.8.min.js',
    '/stylesheets/index.style.css',
    '/scripts/index.js',
    '/fonts/icomoon/font.css',
    '/fonts/icomoon/fonts/icomoon.woff',
    '/fonts/Proxima Nova/font.css',
    '/fonts/Proxima Nova/ProximaNova-Bold.woff'
];
var restrictedRoutesToCache = [
    '/components/dashboard'
]

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    var response;
    var clone;
    caches.match(event.request)
        .then(function(r) {
        	if(!r) {
            	return fetch(event.request);
        	}
        	return r;
        }).then(function(r) {
        	console.log('fetching', event.request, r);
            response = r;
            // clone = response.clone();
            if (event.request.mode != 'navigate') {
                caches.open(CACHE_NAME)
                    .then(function(cache) {
                        cache.put(event.request, response);
                    });
            }
            event.respondWith(response.clone());
            return response.clone();
        })
});
