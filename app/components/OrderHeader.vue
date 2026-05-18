<script setup lang="ts">
import { UiStatusBadge } from '#components';
import Icon from './Icon.vue';
import { OrderStatus } from '~~/shared/types/enums';

defineProps<{
  order_name: string
  po_number: string | number
  status: OrderStatus
  updated_at?: string
}>()
</script>

<template>
  <div class="px-8 py-6 flex items-start gap-4 border-b border-slate-100 bg-white">
    <!-- Icon Badge -->
    <div
      class="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
      <Icon name="Box" :size="28" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3 flex-wrap">
        <h1 class="text-2xl font-bold text-secondary tracking-tight">{{ order_name }}</h1>
        <UiStatusBadge :status="status" />
      </div>
      <div class="flex items-center gap-2 mt-1.5 text-charcoal/60 font-medium text-sm">
        <span>PO #{{ po_number }}</span>
        <span v-if="updated_at" class="flex items-center gap-2">
          <span class="text-charcoal/30">·</span>
          <span>Last updated {{ new Date(updated_at).toLocaleDateString() }}</span>
        </span>
      </div>
    </div>

    <div class="shrink-0 flex items-center">
      <slot name="actions" />
    </div>
  </div>
</template>
