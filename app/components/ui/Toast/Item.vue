<!-- components/ToastItem.vue -->
<template>
    <div
      :class="[
        'rounded-md px-4 py-3 text-white shadow-md transition-all',
        typeClasses[toast.type]
      ]"
    >
      <div class="flex justify-between items-center">
        <p>{{ toast.message }}</p>
        <button @click="$emit('dismiss')" class="ml-4 text-white/80 hover:text-white">×</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    toast: {
      id: string
      message: string
      type: 'success' | 'error' | 'info' | 'warning'
    }
  }>()
  
  const typeClasses = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600 text-black'
  }
  </script>
  