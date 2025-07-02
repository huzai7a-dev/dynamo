<template>
  <nav class="hidden md:flex items-center space-x-8 relative">
    <template v-for="item in navItems" :key="item.label">
      <div v-if="item.subNav" class="relative group"
        @mouseenter="openDropdown(item.label)"
        @mouseleave="delayedCloseDropdown(item.label)">
        <button :class="navLinkClass" class="flex items-center focus:outline-none">
          {{ item.label }}
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div v-if="openDropdownLabel === item.label" class="absolute left-0 top-full mt-2 w-60 bg-secondary border border-gray-700 rounded-xl shadow-xl z-50 py-2 transition-all duration-200">
          <div class="absolute -top-2 left-6 w-4 h-4 bg-secondary border-l border-t border-gray-700 rotate-45 z-10"></div>
          <NuxtLink v-for="sub in item.subNav" :key="sub.label" :to="sub.url" class="block px-5 py-2 text-light-gray hover:bg-charcoal hover:text-white rounded-lg transition-colors duration-150 whitespace-nowrap font-medium">
            {{ sub.label }}
          </NuxtLink>
        </div>
      </div>
      <NuxtLink v-else :to="item.url" :class="[navLinkClass, { 'text-primary-light font-semibold': $route.path === item.url }]">{{ item.label }}</NuxtLink>
    </template>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  navItems: {
    type: Array,
    required: true
  },
})

const navLinkClass = computed(() => [
  'transition-colors font-medium text-light-gray hover:text-white'
])

const openDropdownLabel = ref(null)
let closeTimer = null

function openDropdown(label) {
  openDropdownLabel.value = label
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}
function delayedCloseDropdown(label) {
  closeTimer = setTimeout(() => {
    if (openDropdownLabel.value === label) {
      openDropdownLabel.value = null
    }
  }, 500)
}
</script> 