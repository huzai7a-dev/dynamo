<template>
  <section 
    id="home" 
    class="min-h-screen flex items-center relative overflow-hidden"
  >
    <!-- Background Image with Gradient Overlay -->
    <div class="absolute inset-0">
      <img 
        src="/images/hero-3.jpeg" 
        alt="Background" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-secondary/90"></div>
    </div>
    
    <div class="container mx-auto relative z-10 py-16 px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-8 animate-fade-in">
          <div class="inline-block bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium mb-6 animate-float">
            Professional Embroidery Services
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Welcome to <br>
            <span class="text-secondary bg-white/10 px-4 py-2 rounded-lg inline-block mt-2">Dynamo Stitches</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-100 mb-8 max-w-lg leading-relaxed">
            At Dynamo Stitches, Welcome to the ultimate destination for unmatched creativity and precision! Our team of expert designers and artists is poised to transform your ideas into stunning realities across a spectrum of services.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink 
              to="#services"
              class="group bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span class="text-white font-bold">Get Started</span>
              <svg class="w-5 h-5 ml-2 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </NuxtLink>
            <NuxtLink 
              to="/contact"
              class="group border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span class="font-bold">Contact Us</span>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Right Content - Animated Embroidery SVG -->
        <div class="hidden lg:block relative">
          <div class="relative w-full h-[500px]">
            <svg class="w-full h-full" viewBox="0 0 400 400">
              <!-- Background Fabric -->
              <rect 
                x="50" 
                y="50" 
                width="300" 
                height="300" 
                class="fill-white/10 stroke-white/20 stroke-2"
                rx="10"
              />

              <!-- Animated Stitching Pattern -->
              <g class="embroidery-pattern">
                <!-- First Stitch Pattern -->
                <path 
                  d="M100 150 L150 100 L200 150 L250 100 L300 150" 
                  class="stitch-path"
                  stroke-dasharray="1000"
                  stroke-dashoffset="1000"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="1000" 
                    to="0" 
                    dur="3s" 
                    begin="0s" 
                    fill="freeze"
                  />
                </path>

                <!-- Second Stitch Pattern -->
                <path 
                  d="M100 200 L150 250 L200 200 L250 250 L300 200" 
                  class="stitch-path"
                  stroke-dasharray="1000"
                  stroke-dashoffset="1000"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="1000" 
                    to="0" 
                    dur="3s" 
                    begin="1s" 
                    fill="freeze"
                  />
                </path>

                <!-- Third Stitch Pattern -->
                <path 
                  d="M100 250 L150 200 L200 250 L250 200 L300 250" 
                  class="stitch-path"
                  stroke-dasharray="1000"
                  stroke-dashoffset="1000"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="1000" 
                    to="0" 
                    dur="3s" 
                    begin="2s" 
                    fill="freeze"
                  />
                </path>

                <!-- Animated Needle -->
                <g class="needle-group">
                  <line 
                    x1="200" 
                    y1="50" 
                    x2="200" 
                    y2="350" 
                    class="needle-thread"
                  />
                  <circle 
                    cx="200" 
                    cy="200" 
                    r="5" 
                    class="needle-eye"
                  >
                    <animate 
                      attributeName="cy" 
                      values="50;350;50" 
                      dur="6s" 
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                <!-- Decorative Stitch Points -->
                <g class="stitch-points">
                  <circle cx="100" cy="150" r="3" class="stitch-point" />
                  <circle cx="150" cy="100" r="3" class="stitch-point" />
                  <circle cx="200" cy="150" r="3" class="stitch-point" />
                  <circle cx="250" cy="100" r="3" class="stitch-point" />
                  <circle cx="300" cy="150" r="3" class="stitch-point" />
                </g>
              </g>

              <!-- Animated Text -->
              <text 
                x="200" 
                y="380" 
                class="fill-white text-xl font-bold"
                text-anchor="middle"
              >
                <tspan class="animate-fade-in" style="animation-delay: 0.5s">Professional Embroidery</tspan>
              </text>
            </svg>

            <!-- Decorative Blur Elements -->
            <div class="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
            <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
// Component logic here if needed
</script>

<style scoped>
.stitch-path {
  fill: none;
  stroke: #1C1C1C;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.needle-thread {
  stroke: #1C1C1C;
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.needle-eye {
  fill: #1C1C1C;
}

.stitch-point {
  fill: #1C1C1C;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.embroidery-pattern {
  transform-origin: center;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
