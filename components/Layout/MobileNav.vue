<template>
  <div 
    :class="[
      'fixed inset-0 bg-secondary z-40 flex flex-col pt-8 px-6 md:hidden transition-all duration-300 ease-in-out',
      isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
    ]"
  >
    <div class="flex justify-end items-center">
      <button @click="$emit('close')">
        <X class="text-white" />
      </button>
    </div>
    <template v-for="item in navItems" :key="item.label">
      <div v-if="item.subNav">
        <button @click="isServicesOpen = !isServicesOpen" class="w-full text-left py-4 text-lg font-medium text-light-gray hover:text-white border-b border-gray-700 flex items-center justify-between">
          {{ item.label }}
          <svg :class="{'transform rotate-180': isServicesOpen}" class="w-4 h-4 ml-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div v-if="isServicesOpen" class="pl-4">
          <NuxtLink v-for="sub in item.subNav" :key="sub.label" :to="sub.url" class="block py-2 text-light-gray hover:text-white" @click="$emit('close')">{{ sub.label }}</NuxtLink>
        </div>
      </div>
      <NuxtLink v-else :to="item.url" class="py-4 text-lg font-medium text-light-gray hover:text-white border-b border-gray-700" @click="$emit('close')">{{ item.label }}</NuxtLink>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

defineProps({
  navItems: {
    type: Array,
    required: true
  },
  isMenuOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close'])

const isServicesOpen = ref(false)
</script> 