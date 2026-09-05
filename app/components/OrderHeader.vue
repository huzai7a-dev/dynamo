<script setup lang="ts">
import { UiStatusBadge } from '#components';
import Icon from './Icon.vue';
import { OrderStatus } from '~~/shared/types/enums';

withDefaults(
  defineProps<{
    order_name: string
    po_number: string | number
    status: OrderStatus
    updated_at?: string
    compact?: boolean
  }>(),
  { compact: false },
)
</script>

<template>
  <div
    class="flex items-start border-b border-slate-100 bg-white"
    :class="compact ? 'px-4 py-3 gap-3' : 'px-8 py-6 gap-4'"
  >
    <!-- Icon Badge -->
    <div
      class="rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20"
      :class="compact ? 'h-9 w-9' : 'h-14 w-14'"
    >
      <Icon name="Box" :size="compact ? 18 : 28" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3 flex-wrap">
        <h1
          class="font-bold text-secondary tracking-tight"
          :class="compact ? 'text-base' : 'text-2xl'"
        >{{ order_name }}</h1>
        <UiStatusBadge :status="status" />
      </div>
      <div
        class="flex items-center gap-2 text-charcoal/60 font-medium"
        :class="compact ? 'mt-1 text-xs' : 'mt-1.5 text-sm'"
      >
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
