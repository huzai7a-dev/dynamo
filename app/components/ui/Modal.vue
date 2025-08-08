<template>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modelValue"
          class="fixed inset-0 max-h-svh overflow-auto z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div
            class="relative w-auto mx-auto bg-white rounded-2xl shadow-xl transition-all"
            @click.stop
          >
            <!-- Close Icon -->
            <button
              class="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
              @click="$emit('update:modelValue', false)"
            >
              <Icon name="X" class="w-8 h-8" />
            </button>
  
            <!-- Modal Content -->
            <div class="p-6 space-y-4">
              <slot />
            </div>
  
            <!-- Footer Buttons -->
            <div v-if="$slots.footer" class="flex justify-end gap-3 p-4 border-t border-gray-200">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue: boolean
  }>()
  
  defineEmits(['update:modelValue'])
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  