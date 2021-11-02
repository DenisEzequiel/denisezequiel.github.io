//solo tenemos listeners, no es recomendable tener funciones, variables, etc
// self es muy parecido a lo que venimos usando this
const CACHE_STATIC_NAME = 'static-v03';
const CACHE_INMUTABLE_NAME = 'inmutable-v03';
const CACHE_DYNAMIC_NAME = 'dynamic-v03';

self.addEventListener('install', e => {

    self.skipWaiting();

    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache => {
        //vamos a guardar todos los recursos estaticos de la app shell(necesaarios para que la web funcione offline)

        return cache.addAll(['/index.html',
            '/css/styles.css',
            '/js/index.js',
            '/js/api.js',
            '/plantilla-lista.hbs'
        ])
    });

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache => {
        return cache.addAll([
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://code.getmdl.io/1.3.0/material.amber-deep_purple.min.css',
            'https://code.getmdl.io/1.3.0/material.min.js',
            'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js',
            'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'
        ])
    });

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {
    const cacheWhiteList = [
        CACHE_STATIC_NAME,
        CACHE_INMUTABLE_NAME,
        CACHE_DYNAMIC_NAME
    ];

    e.waitUntil(caches.keys().then(keys => {
        return Promise.all(
            keys.map(cache => {
                if (!cacheWhiteList.includes(cache))
                    return caches.delete(cache);
            })
        )
    }))
});


self.addEventListener('fetch', e => {

    let {url,method} = e.request;
    if (method == 'GET' && !url.includes('mockapi.io')) {
        const respuesta = caches.match(e.request).then(
            res => {
                if (res) {
                    console.log('existe en el cache', res.url);
                    return res;
                }
                return fetch(e.request).then(
                    nuevarespuesta => {
                        caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                            cache.put(e.request, nuevarespuesta);
                        });
                        return nuevarespuesta.clone();
                    }
                )
            });

        e.respondWith(respuesta);
    }
    else{
        console.warn('Bypass: ',method,url);
    }
});

self.addEventListener('push',e =>{
    
    let datos = e.data.text();

    const title = "Super Lista";
    const option = {
        body: `Mensajes: ${datos}`,
        icon: 'images/icons/icon-72x72.png'
    }
    e.waitUntil(self.registration.showNotification(title,option));
});

self.addEventListener('notificationclick',e=>{
    console.log('click en notificacion recibida',e);

    e.notification.close();
    //e.waitUntil(clients.openWindow('https://www.instagram.com'));
})

self.addEventListener('sync',e=>{
    console.log('sincronizando',e);

 
})