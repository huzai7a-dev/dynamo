<script setup lang="ts">
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    label?: string;
    value?: string | null;
    emptyText?: string;
    compact?: boolean;
  }>(),
  {
    label: 'Additional Requirement',
    emptyText: 'No additional requirements provided.',
    compact: false,
  },
)
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-2 flex items-center gap-2">
      <span
        class="flex shrink-0 items-center justify-center rounded-lg bg-primary text-white"
        :class="compact ? 'h-6 w-6' : 'h-7 w-7'"
      >
        <Icon name="FileText" :size="compact ? 12 : 14" />
      </span>
      <span class="text-xs uppercase tracking-wide text-charcoal/70">{{ label }}</span>
    </div>
    <div
      class="rounded-xl border border-slate-100 bg-white"
      :class="compact ? 'min-h-20 p-3' : 'min-h-40 p-4'"
    >
      <p class="whitespace-pre-wrap text-sm text-secondary">
        {{ value || emptyText }}
      </p>
    </div>
  </div>
</template>
