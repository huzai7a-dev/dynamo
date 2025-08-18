<script setup lang="ts">
const emit = defineEmits<{
  (e:'approve'): void
  (e:'request-changes'): void
  (e:'cancel'): void
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <button
      class="rounded-2xl bg-primary px-4 py-2 font-medium text-white shadow hover:bg-primary-dark transition"
      @click="emit('approve')"
    >
      Approve
    </button>

    <button
      class="rounded-2xl border border-charcoal/20 bg-white px-4 py-2 font-medium text-secondary hover:bg-sold-light hover:bg-solid-light transition"
      @click="emit('request-changes')"
    >
      Request Changes
    </button>

    <button
      class="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 font-medium text-rose-700 hover:bg-rose-100 transition"
      @click="emit('cancel')"
    >
      Cancel Order
    </button>
  </div>
</template>
