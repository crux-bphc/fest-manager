var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
	'/',
	'/dashboard',
	'/events',
	'/portals',
	'/scripts/jquery.min.js',
	'/static/scripts/deep-diff-0.3.8.min.js',
	'/static/stylesheets/index.style.css',
	'/static/scripts/index.js',
	'/static/fonts/icomoon/font.css',
	'/static/fonts/icomoon/fonts/icomoon.woff',
	'/static/fonts/Proxima Nova/font.css',
	'/static/fonts/Proxima Nova/ProximaNova-Bold.woff'
];
var restrictedRoutesToNotCache = [
	'/components/login',
	'/logout',
	'/auth/'
]

self.addEventListener('install', function (event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function (cache) {
			console.log('Opened cache');
			cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', function (event) {
	var response;
	event.respondWith(caches.match(event.request)
		.then(function (r) {
			if (!r) {
				return fetch(event.request);
			}
			return r;
		}).then(function (r) {
			response = r;
			console.log(event.request.url);
			for (var i = 0; i < restrictedRoutesToNotCache.length; i++) {
				if (event.request.url.indexOf(restrictedRoutesToNotCache[i]) != -1) {
					console.log("mathched", restrictedRoutesToNotCache[i]);
					return response.clone();
				}
			}
			caches.open(CACHE_NAME)
				.then(function (cache) {
					cache.put(event.request, response);
				});
			return response.clone();
		}));
});
