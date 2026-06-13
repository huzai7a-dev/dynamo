<template>
  <div
    class="google-translate-wrapper w-full flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/15"
    :class="{ 'opacity-0 pointer-events-none': !isLoaded, 'opacity-100': isLoaded }">
    <div class="flex items-center justify-center text-white/80 flex-shrink-0">
      <Icon name="Globe" class="w-4 h-4" />
    </div>
    <div id="google_translate_element" class="google-translate-container flex-1"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoaded = ref(false);

onMounted(() => {
  // Define callback for Google Translate initialization
  (window as any).googleTranslateElementInit = () => {
    if ((window as any).google && (window as any).google.translate) {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        'google_translate_element'
      );
      isLoaded.value = true;
    }
  };

  const loadScript = () => {
    // Check if the script already exists in the DOM to avoid duplication
    if (document.getElementById('google-translate-script')) {
      if ((window as any).google && (window as any).google.translate) {
        (window as any).googleTranslateElementInit();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.warn('Google Translate script failed to load.');
    };

    document.body.appendChild(script);
  };

  // Low priority load using requestIdleCallback or deferred setTimeout
  if (typeof window.requestIdleCallback !== 'undefined') {
    window.requestIdleCallback(() => {
      setTimeout(loadScript, 2000); // Wait 2 seconds during idle time
    });
  } else {
    setTimeout(loadScript, 3000); // Fallback to 3 seconds delay
  }
});

</script>

<style>
/* Hide legacy Google Translate elements */
.goog-te-banner-frame.skiptranslate,
.goog-te-banner-frame,
.goog-te-balloon-frame {
  display: none !important;
}

body {
  top: 0px !important;
}

/* Align the select wrapper vertically */
.google-translate-container,
.google-translate-container .skiptranslate,
.google-translate-container .goog-te-gadget,
.google-translate-container .goog-te-gadget>div {
  display: flex !important;
  align-items: center !important;
}

/* Hide the "Powered by" text node by setting font-size to 0 */
.google-translate-container .goog-te-gadget {
  font-size: 0 !important;
}

/* Restore font-size on the select itself so text remains visible */
.google-translate-container .goog-te-combo {
  font-size: 14px !important;
}

/* Hide Google branding logos and links */
.google-translate-container .goog-te-gadget>span,
.google-translate-container .goog-logo-link {
  display: none !important;
}
</style>
