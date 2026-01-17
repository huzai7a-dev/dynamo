<template>
    <div class="bg-white shadow-lg rounded-2xl p-5 flex items-center space-x-4 transition hover:shadow-xl">
      <!-- Icon -->
      <div class="bg-primary-light p-3 rounded-full">
        <Icon class=" text-primary" :name="icon"  />
      </div>
  
      <!-- Text content -->
      <div class="flex flex-col">
        <span class="text-sm text-gray-500 font-medium">{{ label }}</span>
        <span class="text-xl font-semibold text-gray-800">{{ value }}</span>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import Icon from './Icon.vue';

    interface Props {
        label: string,
        value: string | number,
        icon: string
    }

    defineProps<Props>()

</script>
  