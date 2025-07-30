<template>
  <section id="our-approach" class="py-16 bg-gradient-to-b from-white to-gray-50">
    <h2></h2>
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        <div class="relative group">
          <div class="relative z-10 transform transition-transform duration-300 group-hover:scale-[1.02]">
            <NuxtImg
               
              src="/images/about-us.jpeg" 
              alt="About Our Embroidery Business" 
              class="rounded-lg shadow-xl w-full h-[500px] object-cover"
            />
          </div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
            <div class="absolute -right-5 -bottom-5 w-64 h-64 rounded-lg border-8 border-secondary/20 transition-transform duration-300 group-hover:scale-105"></div>
          </div>
          <div class="absolute -bottom-10 -right-10 max-w-sm z-10 hidden md:block">
            <div class="bg-teal-gradient text-white p-6 rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105">
              <p class="font-serif italic">
                "Quality embroidery isn't just about threads and needles; it's about bringing your vision to life with precision and care."
              </p>
              <p class="mt-4 font-medium">— Sarah Johnson, Lead Designer</p>
            </div>
          </div>
        </div>

        <div class="animate-fade-in" style="animation-delay: 200ms">
          <h2 class="text-3xl font-bold mb-6 text-primary font-display">
            Our Unique Approach
          </h2>
          <p class="text-gray-600 mb-6">
            Our unique blend of creativity, precision, and marketing savvy sets us apart, allowing us to deliver unparalleled digitizing and vector art services.
          </p>
          
          <div class="space-y-4">
            <div v-for="(feature, index) in features" :key="index" 
                 class="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-md">
              <div class="flex-shrink-0 mt-1">
                <div class="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-primary">
                  <svg class="w-5 h-5 text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ feature.title }}</h3>
                <p class="text-gray-600">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    title: "Creative Excellence",
    description: "Every design is meticulously crafted to perfection."
  },
  {
    title: "Timely Delivery",
    description: "We understand deadlines and strive to deliver on time, every time."
  },
  {
    title: "Client-Centric Approach",
    description: "Your vision is our priority, and we work closely with you to ensure your satisfaction."
  },
  {
    title: "Industry Expertise",
    description: "With decades of experience, we bring a wealth of knowledge to every project."
  },
  {
    title: "Innovative Solutions",
    description: "We're constantly pushing boundaries to bring you the latest in digitizing and vectoring technology."
  }
]
</script>
