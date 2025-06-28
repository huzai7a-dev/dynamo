<template>
  <footer class="bg-primary text-white pt-16 pb-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Company Info -->
        <div>
          <h3 class="text-xl font-bold mb-6">
            <span class="text-secondary">Dynamo</span>Stitches
          </h3>
          <p class="mb-6 text-gray-300">
            Professional embroidery services for businesses, organizations, and individuals. 
            Delivering quality craftsmanship since 2010.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-white hover:text-secondary transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="text-white hover:text-secondary transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.163-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.729-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.989C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </a>
            <a href="#" class="text-white hover:text-secondary transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Services -->
        <div>
          <h3 class="text-lg font-bold mb-6">Services</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-gray-300 hover:text-secondary transition-colors">Custom Embroidery</a></li>
            <li><a href="#" class="text-gray-300 hover:text-secondary transition-colors">Corporate Apparel</a></li>
            <li><a href="#" class="text-gray-300 hover:text-secondary transition-colors">Team Uniforms</a></li>
            <li><a href="#" class="text-gray-300 hover:text-secondary transition-colors">Personal Items</a></li>
            <li><a href="#" class="text-gray-300 hover:text-secondary transition-colors">Logo Digitizing</a></li>
          </ul>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-bold mb-6">Quick Links</h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/" class="text-gray-300 hover:text-secondary transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-300 hover:text-secondary transition-colors">About Us</NuxtLink></li>
            <li><NuxtLink to="/gallery" class="text-gray-300 hover:text-secondary transition-colors">Gallery</NuxtLink></li>
            <li><NuxtLink to="/testimonials" class="text-gray-300 hover:text-secondary transition-colors">Testimonials</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-300 hover:text-secondary transition-colors">Contact</NuxtLink></li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-bold mb-6">Contact Us</h3>
          <ul class="space-y-4">
            <li class="flex items-start">
              <svg class="w-5 h-5 mr-2 mt-1 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="text-gray-300">123 Embroidery Lane<br />Craft City, CA 90210</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <a href="tel:+15551234567" class="text-gray-300 hover:text-secondary transition-colors">(555) 123-4567</a>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"></path>
              </svg>
              <a href="mailto:info@dynamostitches.com" class="text-gray-300 hover:text-secondary transition-colors">info@dynamostitches.com</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm mb-4 md:mb-0">
          © {{ currentYear }} Dynamo Stitches. All rights reserved.
        </p>
        <div class="flex space-x-6">
          <a href="#" class="text-gray-400 hover:text-secondary text-sm transition-colors">Privacy Policy</a>
          <a href="#" class="text-gray-400 hover:text-secondary text-sm transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
