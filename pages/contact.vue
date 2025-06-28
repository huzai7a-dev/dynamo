<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <Banner
      backgroundImage="/images/contact-banner.webp"
      title="Contact Us"
      description="Let's Create Something Extraordinary Together"
    />
    
    <main class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <!-- Main Heading -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
          Connect with Dynamo Stitches
          <span class="absolute -bottom-2 left-0 w-full h-1 bg-teal-gradient rounded-full"></span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
          Have a Question or a Brilliant Idea? Let's bring it to life together! Reach out to us, and let's create something extraordinary.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Contact Information -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span class="w-8 h-8 bg-teal-gradient rounded-full flex items-center justify-center mr-3">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </span>
            Contact Information
          </h3>
          <div class="space-y-6">
            <div class="flex items-start space-x-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                  <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-medium text-gray-900">Location</h4>
                <p class="mt-1 text-gray-600">123 Fashion Street, Design District, City</p>
              </div>
            </div>

            <div class="flex items-start space-x-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-200">
                  <svg class="h-5 w-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-medium text-gray-900">Email</h4>
                <p class="mt-1 text-gray-600">contact@dynamostitches.com</p>
              </div>
            </div>

            <div class="flex items-start space-x-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                  <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-medium text-gray-900">Phone / WhatsApp</h4>
                <p class="mt-1 text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg class="h-5 w-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Working Hours
            </h4>
            <p class="text-gray-600">Monday - Friday, 09:00am - 05:00pm</p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span class="w-8 h-8 bg-teal-gradient rounded-full flex items-center justify-center mr-3">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </span>
            Get In Touch
          </h3>
          <p class="text-gray-600 mb-8">Drop us a line and let's start crafting your vision into reality.</p>
          
          <form class="space-y-6">
            <div class="group">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-primary transition-colors duration-200">Name</label>
              <div class="relative">
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-gray-400"
                  placeholder="Enter your name"
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="group">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-primary transition-colors duration-200">Email</label>
              <div class="relative">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-gray-400"
                  placeholder="Enter your email"
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="group">
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-primary transition-colors duration-200">Message</label>
              <div class="relative">
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4" 
                  class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-gray-400 resize-none"
                  placeholder="Type your message here..."
                ></textarea>
                <div class="absolute top-3 right-3 pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
            </div>

            <button type="submit" class="w-full bg-teal-gradient text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Contact Us - Dynamo Stitches'
})
</script>
