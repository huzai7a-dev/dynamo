import TawkMessengerVue from '@tawk.to/tawk-messenger-vue-3';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(TawkMessengerVue, {
        propertyId : '6865966a729474190ca0d22f',
        widgetId : '1iv6d74s3'
    });
});