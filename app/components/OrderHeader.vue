<script setup lang="ts">
import { UiStatusBadge } from '#components';


defineProps<{
  order_name: string
  po_number: string | number
  status: OrderStatus
}>()
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold text-secondary">{{ order_name }}</h1>
      <p class="text-sm text-charcoal/70">PO #{{ po_number }}</p>
    </div>
    <UiStatusBadge :status="status" />
  </div>
</template>
