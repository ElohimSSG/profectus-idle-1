if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let a={};const o=e=>i(e,l),u={module:{uri:l},exports:a,require:o};s[l]=Promise.all(n.map((e=>u[e]||o(e)))).then((e=>(r(...e),a)))}}define(["./workbox-7369c0e1"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"26e53bb981d06c8069ffd9d2a14fce0e"},{url:"assets/@fontsource.f66d05e7.css",revision:null},{url:"assets/@vue.6b211d3c.js",revision:null},{url:"assets/gameLoop.c4ab3aaf.js",revision:null},{url:"assets/index.8fb51589.js",revision:null},{url:"assets/index.b9465c3a.css",revision:null},{url:"assets/lz-string.bfbf8ec3.js",revision:null},{url:"assets/nanoevents.1080beb7.js",revision:null},{url:"assets/sortablejs.37357d89.js",revision:null},{url:"assets/vue-next-select.59b4c8de.js",revision:null},{url:"assets/vue-next-select.9e6f4164.css",revision:null},{url:"assets/vue-textarea-autosize.35804eaf.js",revision:null},{url:"assets/vue-toastification.1441705b.js",revision:null},{url:"assets/vue-toastification.4b5f8ac8.css",revision:null},{url:"assets/vue.9bea85b8.js",revision:null},{url:"assets/vuedraggable.dbc38f8e.js",revision:null},{url:"assets/workbox-window.4a8794bb.js",revision:null},{url:"favicon.ico",revision:"eead31eb5b19fa3bdc34af83d898c0b7"},{url:"favicon.svg",revision:"c8dd2748f1fedd25449164d7dda6aecb"},{url:"index.html",revision:"0e18ff96ba4d3c5304a393764a06417d"},{url:"pwa-192x192.png",revision:"a16785d9e890858c5b508e0ef6954aaf"},{url:"pwa-512x512.png",revision:"b84004b93fd62ef6599ff179372861a1"},{url:"favicon.ico",revision:"eead31eb5b19fa3bdc34af83d898c0b7"},{url:"robots.txt",revision:"5e0bd1c281a62a380d7a948085bfe2d1"},{url:"apple-touch-icon.png",revision:"26e53bb981d06c8069ffd9d2a14fce0e"},{url:"pwa-192x192.png",revision:"a16785d9e890858c5b508e0ef6954aaf"},{url:"pwa-512x512.png",revision:"b84004b93fd62ef6599ff179372861a1"},{url:"manifest.webmanifest",revision:"a443b59134eb5ee54dd5a1afefe6bb4e"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
