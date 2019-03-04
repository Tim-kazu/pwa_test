var CACHE_NAME = 'cash-v1';
var urlsToCache = [
  './',
  'manifest.json',
  'style.min.css',
  '/pwa_test/img/pwa.png'
];
//Install
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {  
      return cache.addAll(urlsToCache);
    })
  );
});

//Activate
self.addEventListener('activate', function(event) {  
  event.waitUntil(
    caches.keys().then(function(cache) {
      cache.map(function(name) {
        if(CACHE_NAME !== name) caches.delete(name);
      })
    })
  );
});

//Request
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(res) {
      if(res) return res;
      return fetch(event.request);
    })
  );
});

//Push
self.addEventListener("push", function (event) {
  event.waitUntil(
    self.registration.pushManager.getSubscription()
      .then(function (subscription) {
        if (subscription) {
          return subscription.endpoint
        }
        throw new Error('User not subscribed')
      })
      .then(function (res) {
        return fetch('notifications.json')
      })
      .then(function (res) {
        if (res.status === 200) {
          return res.json()
        }
        throw new Error('notification api response error')
      })
      .then(function (res) {
        return self.registration.showNotification(res.title, {
          icon: '/pwa_test/img/pwa.png',
          body: res.body
        })
      })
  );
});