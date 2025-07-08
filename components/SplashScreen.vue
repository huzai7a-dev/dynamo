<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-1000"
    :class="{ 'opacity-0 pointer-events-none': !show }"
  >
    <!-- Background with gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary"></div>
    
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div class="absolute -bottom-4 -left-4 w-40 h-40 bg-secondary/20 rounded-full blur-xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg animate-float"></div>
    </div>

    <!-- Main content container -->
    <div class="relative z-10 flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <!-- Logo with enhanced animation -->
      <div class="relative">
        <div class="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
        <img 
          src="/images/logo.png" 
          alt="Dynamo Stitches" 
          class="relative w-32 h-32 animate-float drop-shadow-2xl"
          style="animation-duration: 3s; animation-delay: 0.5s;"
        />
      </div>

      <!-- Company name -->
      <div class="text-center space-y-2">
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-lg animate-fade-in" style="animation-delay: 0.8s;">
          Dynamo Stitches
        </h1>
        <p class="text-lg md:text-xl text-white/80 font-medium animate-fade-in" style="animation-delay: 1.2s;">
          Professional Embroidery Services
        </p>
      </div>

      <!-- Custom loading spinner -->
      <div class="relative w-16 h-16 animate-fade-in" style="animation-delay: 1.5s;">
        <div class="absolute inset-0 border-4 border-white/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
        <div class="absolute inset-2 border-4 border-white/10 rounded-full"></div>
        <div class="absolute inset-2 border-4 border-transparent border-t-white/60 rounded-full animate-spin" style="animation-duration: 1.5s; animation-direction: reverse;"></div>
      </div>

      <!-- Loading text -->
      <p class="text-white/70 text-sm font-medium animate-fade-in" style="animation-delay: 1.8s;">
        Loading your experience...
      </p>

      <!-- Decorative stitching pattern -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-20">
        <svg width="200" height="40" viewBox="0 0 200 40" class="animate-fade-in" style="animation-delay: 2s;">
          <path 
            d="M20 20 L60 10 L100 20 L140 10 L180 20" 
            stroke="white" 
            stroke-width="2" 
            fill="none" 
            stroke-linecap="round"
            stroke-dasharray="200"
            stroke-dashoffset="200"
          >
            <animate 
              attributeName="stroke-dashoffset" 
              from="200" 
              to="0" 
              dur="2s" 
              begin="2.5s" 
              fill="freeze"
            />
          </path>
          <circle cx="20" cy="20" r="2" fill="white">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="2.5s"/>
          </circle>
          <circle cx="60" cy="10" r="2" fill="white">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="2.7s"/>
          </circle>
          <circle cx="100" cy="20" r="2" fill="white">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="2.9s"/>
          </circle>
          <circle cx="140" cy="10" r="2" fill="white">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="3.1s"/>
          </circle>
          <circle cx="180" cy="20" r="2" fill="white">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="3.3s"/>
          </circle>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const show = ref(true)

onMounted(() => {
  // Wait for the page to fully load, then hide splash
    setTimeout(() => {
      show.value = false
    }, 1200) // Increased delay for better effect
})
</script>

<style scoped>
/* Custom animations for enhanced visual appeal */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  background-size: 200px 100%;
  animation: shimmer 2s infinite;
}
</style>