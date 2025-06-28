
<template>
  <section class="py-16 bg-primary text-white">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <span class="text-secondary font-medium">Get In Touch</span>
          <h2 class="text-3xl md:text-4xl font-bold mt-2 mb-6">Ready to Start Your Project?</h2>
          <p class="text-gray-300 mb-8">
            Contact us today for a free quote on your embroidery project. Our team is ready to bring your vision to life with professional quality and exceptional service.
          </p>
          
          <div class="space-y-6">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-secondary mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>123 Embroidery Lane, Craft City, CA 90210</span>
            </div>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-secondary mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <a href="tel:+15551234567" class="hover:text-secondary transition-colors">(555) 123-4567</a>
            </div>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-secondary mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <a href="mailto:info@dynamostitches.com" class="hover:text-secondary transition-colors">info@dynamostitches.com</a>
            </div>
          </div>
        </div>
        
        <div class="bg-white/10 p-8 rounded-lg">
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">First Name</label>
                <input type="text" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-secondary">
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Last Name</label>
                <input type="text" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-secondary">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input type="email" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-secondary">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Project Details</label>
              <textarea rows="4" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-secondary"></textarea>
            </div>
            <button type="submit" class="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-md font-medium transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Component logic here if needed
</script>
