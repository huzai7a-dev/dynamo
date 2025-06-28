
<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-secondary font-medium">Our Portfolio</span>
        <h2 class="text-3xl md:text-4xl font-bold mt-2 mb-6 text-primary">Our Exceptional Work</h2>
        <p class="text-gray-600">
          Browse through our collection of custom embroidery projects. Each piece represents our commitment to quality, 
          precision, and customer satisfaction.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(item, index) in galleryItems" 
          :key="index"
          class="group relative overflow-hidden rounded-lg shadow-lg bg-white transition-transform hover:scale-105"
        >
          <div class="aspect-square overflow-hidden">
            <img 
              :src="item.imageSrc" 
              :alt="item.title"
              class="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
            <h3 class="text-white font-bold text-lg mb-1">{{ item.title }}</h3>
            <p class="text-secondary text-sm">{{ item.category }}</p>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-12">
        <NuxtLink 
          to="/gallery"
          class="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-md font-medium transition-colors inline-block"
        >
          View All Projects
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const galleryItems = [
  {
    imageSrc: "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=1965&auto=format&fit=crop",
    title: "Corporate Uniforms",
    category: "Business Apparel"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop",
    title: "Team Jerseys",
    category: "Athletic Wear"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=2070&auto=format&fit=crop",
    title: "Custom Hats",
    category: "Accessories"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1552642986-ccb41e7059e7?q=80&w=1974&auto=format&fit=crop",
    title: "Logo Embroidery",
    category: "Corporate Branding"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1618354691551-44de113f0164?q=80&w=1915&auto=format&fit=crop",
    title: "Personal Gifts",
    category: "Special Occasions"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?q=80&w=1935&auto=format&fit=crop",
    title: "School Uniforms",
    category: "Educational Institutions"
  }
]
</script>
