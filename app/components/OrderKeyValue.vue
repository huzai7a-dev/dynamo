<script setup lang="ts">
import Icon, { type IconName } from './Icon.vue'

withDefaults(
  defineProps<{ label: string; value?: string | number | null; icon?: IconName; compact?: boolean }>(),
  { compact: false },
)
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white"
    :class="compact ? 'p-2 gap-2' : 'p-3'"
  >
    <span
      v-if="icon"
      class="flex shrink-0 items-center justify-center rounded-lg bg-primary text-white"
      :class="compact ? 'h-7 w-7' : 'h-9 w-9'"
    >
      <Icon :name="icon" :size="compact ? 14 : 16" />
    </span>
    <div class="flex min-w-0 flex-col">
      <span class="text-xs uppercase tracking-wide text-charcoal/70">{{ label }}</span>
      <span class="mt-0.5 truncate text-sm font-bold text-secondary">{{ value ?? '—' }}</span>
    </div>
  </div>
</template>
