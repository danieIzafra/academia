// sw.js - Service Worker Básico para permitir a instalação do PWA
const CACHE_NAME = 'gymapp-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Um fetch vazio é o suficiente para o navegador considerar o app "instalável"
    event.respondWith(fetch(event.request).catch(() => new Response('Offline')));
});