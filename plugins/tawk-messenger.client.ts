// import TawkMessengerVue from '@tawk.to/tawk-messenger-vue-3';

// export default defineNuxtPlugin((nuxtApp) => {
//     // Only load Tawk Messenger after user interaction or significant delay
//     let isLoaded = false;
    
//     const loadTawk = () => {
//         if (isLoaded) return;
//         isLoaded = true;
        
//         nuxtApp.vueApp.use(TawkMessengerVue, {
//             propertyId : '6865966a729474190ca0d22f',
//             widgetId : '1iv6d74s3'
//         });
//     };

//     // Load after 10 seconds if no user interaction
//     const timeoutId = setTimeout(loadTawk, 10000);

//     // Load on first user interaction (scroll, click, etc.)
//     const handleUserInteraction = () => {
//         clearTimeout(timeoutId);
//         loadTawk();
//         // Remove event listeners after loading
//         document.removeEventListener('scroll', handleUserInteraction);
//         document.removeEventListener('click', handleUserInteraction);
//         document.removeEventListener('touchstart', handleUserInteraction);
//     };

//     // Add event listeners for user interaction
//     document.addEventListener('scroll', handleUserInteraction, { passive: true });
//     document.addEventListener('click', handleUserInteraction, { passive: true });
//     document.addEventListener('touchstart', handleUserInteraction, { passive: true });
// });