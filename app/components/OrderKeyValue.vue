<script setup lang="ts">
import Icon, { type IconName } from './Icon.vue'

defineProps<{ label: string; value?: string | number | null; icon?: IconName }>()
</script>

<template>
  <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">
    <span
      v-if="icon"
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white"
    >
      <Icon :name="icon" :size="16" />
    </span>
    <div class="flex min-w-0 flex-col">
      <span class="text-xs uppercase tracking-wide text-charcoal/70">{{ label }}</span>
      <span class="mt-0.5 truncate text-sm font-bold text-secondary">{{ value ?? '—' }}</span>
    </div>
  </div>
</template>
