<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Our Pricing Plans</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your embroidery needs. All plans include premium quality and expert craftsmanship.
        </p>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <!-- Basic Plan -->
        <div class="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300" 
             data-aos="fade-up" 
             data-aos-duration="1000" 
             data-aos-delay="100">
          <div class="text-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Basic</h3>
            <div class="text-4xl font-bold text-primary mb-6">$99<span class="text-lg text-gray-600">/month</span></div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Up to 50 pieces/month
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Basic designs
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                3-day turnaround
              </li>
            </ul>
            <button class="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
              Get Started
            </button>
          </div>
        </div>

        <!-- Professional Plan -->
        <div class="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300 border-2 border-primary relative"
             data-aos="fade-up" 
             data-aos-duration="1000" 
             data-aos-delay="200">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </div>
          <div class="text-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Professional</h3>
            <div class="text-4xl font-bold text-primary mb-6">$199<span class="text-lg text-gray-600">/month</span></div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Up to 150 pieces/month
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Custom designs
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                2-day turnaround
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Priority support
              </li>
            </ul>
            <button class="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
              Get Started
            </button>
          </div>
        </div>

        <!-- Enterprise Plan -->
        <div class="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300"
             data-aos="fade-up" 
             data-aos-duration="1000" 
             data-aos-delay="300">
          <div class="text-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
            <div class="text-4xl font-bold text-primary mb-6">$399<span class="text-lg text-gray-600">/month</span></div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Unlimited pieces
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Premium designs
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                24-hour turnaround
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Dedicated support
              </li>
            </ul>
            <button class="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="text-center mt-16" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
        <p class="text-gray-600">
          Need a custom plan? <a href="#" class="text-primary hover:text-primary-dark font-semibold">Contact us</a> for a tailored solution.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Component logic can be added here if needed
</script> 