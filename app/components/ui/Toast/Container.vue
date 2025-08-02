<!-- components/ToastContainer.vue -->
<template>
    <div class="fixed top-4 right-4 z-50 space-y-3">
      <Item
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        @dismiss="onDismiss(toast.id)"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useToast } from '~/composables/useToast'
import Item from './Item.vue'
  
  const { toasts } = useToast()
  
  const onDismiss = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }
  </script>
  