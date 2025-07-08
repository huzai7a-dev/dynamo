<script setup>
import { ref } from 'vue'

const form = ref({
  firstName: '',
  lastName: '',
  contact: '',
  email: '',
  message: ''
})

const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

function validateForm() {
  if (!form.value.firstName.trim() || !form.value.lastName.trim() || !form.value.contact.trim() || !form.value.email.trim() || !form.value.message.trim()) {
    errorMessage.value = 'Please fill in all fields.'
    return false
  }
  // Simple email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(form.value.email)) {
    errorMessage.value = 'Please enter a valid email address.'
    return false
  }
  errorMessage.value = ''
  return true
}

const handleSubmit = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  if (!validateForm()) return
  isLoading.value = true
  const payload = {
    service_id: 'service_cr9z37p',
    template_id: 'template_lg2he5p',
    user_id: 'Kn6u7tXfYFZlVjOwp',
    template_params: {
      name: `${form.value.firstName} ${form.value.lastName}`,
      email: form.value.email,
      message: form.value.message,
      phone: form.value.contact
    }
  }
  try {
    const response = await $fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    })
    successMessage.value = 'Your message has been sent successfully!'
    form.value = { firstName: '', lastName: '', contact: '', email: '', message: '' }
  } catch (error) {
    errorMessage.value = 'Failed to send your message. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// useHead({
//   title: 'Contact Us - Dynamo Stitches',
// })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <Banner
      backgroundImage="/images/contact-banner.jpeg"
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
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-black-100 w-full h-full flex flex-col">
          <div class="flex items-center mb-8">
            <span class="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center mr-4">
              <Icon name="Mail" class="h-6 w-6 text-white" />
            </span>
            <h3 class="text-2xl font-bold text-gray-900">Contact Information</h3>
          </div>

          <div class="space-y-7 flex-1">
            <div class="flex items-start gap-4">
              <span class="w-10 h-10 rounded-full flex items-center justify-center bg-pink-100">
                <Icon name="Mail" class="h-6 w-6 text-pink-500" />
              </span>
              <div>
                <div class="font-semibold text-lg text-gray-900">Email</div>
                <div class="text-gray-500">order@dynamostitches.com</div>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <span class="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100">
                <Icon name="Phone" class="h-6 w-6 text-purple-500" />
              </span>
              <div>
                <div class="font-semibold text-lg text-gray-900">Phone</div>
                <div class="text-gray-500">+1 (303)-800-6078</div>
              </div>
            </div>
            <div class="border-t border-gray-200 my-4"></div>
            <div class="flex items-start gap-4">
              <span class="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100">
                <Icon name="Clock" class="h-6 w-6 text-indigo-500" />
              </span>
              <div>
                <div class="font-semibold text-lg text-gray-900">Working Hours</div>
                <div class="text-gray-500">Monday - Friday, 09:00am - 05:00pm</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-black-100 w-full h-full flex flex-col">
          <h3 class="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <span class="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center mr-4">
              <Icon name="MessageSquare" class="h-6 w-6 text-white" />
            </span>
            Get In Touch
          </h3>
          <p class="text-gray-600 mb-8">Drop us a line and let's start crafting your vision into reality.</p>
          
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div v-if="successMessage" class="mb-4 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">{{ successMessage }}</div>
            <div v-if="errorMessage" class="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center">{{ errorMessage }}</div>
            <div class="group">
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-primary transition-colors duration-200">First Name</label>
              <div class="relative">
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  v-model="form.firstName"
                  class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-gray-400"
                  placeholder="Enter your first name"
                >
              </div>
            </div>
            <div class="group">
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-primary transition-colors duration-200">Last Name</label>
              <div class="relative">
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  v-model="form.lastName"
                  class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-gray-400"
                  placeholder="Enter your last name"
                >
              </div>
            </div>
            <div class="group">
              <label for="contact" class="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-primary transition-colors duration-200">Contact</label>
              <div class="relative">
                <input 
                  type="text" 
                  id="contact" 
                  name="contact" 
                  v-model="form.contact"
                  class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-gray-400"
                  placeholder="Enter your contact number"
                >
              </div>
            </div>
            <div class="group">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-primary transition-colors duration-200">Email</label>
              <div class="relative">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  v-model="form.email"
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
                  v-model="form.message"
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
            <button type="submit" :disabled="isLoading" class="w-full bg-teal-gradient text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center">
              <svg v-if="isLoading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>{{ isLoading ? 'Sending...' : 'Send Message' }}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

