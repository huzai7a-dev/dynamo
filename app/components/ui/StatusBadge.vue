<script setup lang="ts">
defineProps<{
  status: OrderStatus
}>()


</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium"
    :class="getOrderStatusBadgeClass(status)"
  >
    <span class="h-1.5 w-1.5 rounded-full"/>
    {{ formatOrderStatus(status) }}
  </span>
</template>
