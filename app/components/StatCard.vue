<template>
  <div class="relative flex flex-col justify-between rounded-lg p-5 min-w-[150px] h-[120px] overflow-hidden"
    :class="gradient">
    <!-- Top row: label + icon -->
    <div class="flex items-start justify-between">
      <span class="text-lg font-bold tracking-widest uppercase text-white/80 font-sans">{{ label }}</span>
      <div class="flex items-center justify-center w-9 h-9 rounded-icon bg-white/20 shrink-0">
        <Icon class="text-white text-lg" :name="icon" />
      </div>
    </div>

    <!-- Value -->
    <span class="text-4xl font-extrabold text-white font-sans leading-none">{{ value }}</span>

    <!-- Bottom divider -->
    <div class="absolute bottom-3 left-4 right-4 h-px bg-white/30 rounded-full" />
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';

interface Props {
  label: string;
  value: string | number;
  icon: string;
  gradient?: string;
}

withDefaults(defineProps<Props>(), {
  gradient: 'bg-gradient-card-dark',
});
</script>