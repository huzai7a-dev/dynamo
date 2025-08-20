<template>
  <Teleport to="body">
    <Transition name="fade">
              <div
          v-if="modelValue"
          class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click="$emit('update:modelValue', false)"
        >
        <div
          class="relative w-full max-w-2xl max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-xl transition-all flex flex-col"
          @click.stop
        >
          <!-- Close Icon -->
          <button
            class="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition z-10"
            @click="$emit('update:modelValue', false)"
          >
            <Icon name="X" class="w-8 h-8" />
          </button>

          <!-- Modal Content - Scrollable -->
          <div class="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <slot />
          </div>

          <!-- Footer Buttons - Fixed at bottom -->
          <div v-if="$slots.footer" class="flex justify-end gap-3 p-4 border-t border-gray-200 bg-white rounded-b-2xl">
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

/* Hide scrollbar for modal content */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
</style>
  