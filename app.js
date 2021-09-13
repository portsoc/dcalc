// if the browser supports service workers
// install one.
if (navigator.serviceWorker) {
  console.log('ServiceWorker: support detected.');
  window.addEventListener('load', registerServiceWorker);
}

async function registerServiceWorker() {
  console.log('ServiceWorker: registering.');
  try {
    const reg = await navigator.serviceWorker.register('./app_worker.js');
    console.log('ServiceWorker: registered', reg);
  } catch (e) {
    console.error('Service Worker failed.  Falling back to online-only.', e);
  }
}
