<script setup lang="ts">
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    label?: string;
    value?: string | null;
    emptyText?: string;
  }>(),
  {
    label: 'Additional Requirement',
    emptyText: 'No additional requirements provided.',
  },
)
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-2 flex items-center gap-2">
      <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
        <Icon name="FileText" :size="14" />
      </span>
      <span class="text-xs uppercase tracking-wide text-charcoal/70">{{ label }}</span>
    </div>
    <div class="min-h-40 rounded-xl border border-slate-100 bg-white p-4">
      <p class="whitespace-pre-wrap text-sm text-secondary">
        {{ value || emptyText }}
      </p>
    </div>
  </div>
</template>
