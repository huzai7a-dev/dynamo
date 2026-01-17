<script setup lang="ts">

interface Props {
  isAdmin?: boolean
  status: OrderStatus
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false
})

const emit = defineEmits<{
  (e:'approve'): void
  (e:'reject'): void
  (e:'deliver'): void
  (e:'cancel'): void
  (e:'edit'): void
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <!-- Admin Actions -->
    <template v-if="isAdmin">
      <button
        v-if="status === OrderStatus.PENDING || status === OrderStatus.REJECTED"
        class="rounded-2xl bg-primary px-4 py-2 font-medium text-white shadow hover:bg-primary-dark transition"
        @click="emit('approve')"
      >
        Approve
      </button>

      <button
        v-if="status === OrderStatus.PENDING || status === OrderStatus.IN_PROGRESS"
        class="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 font-medium text-rose-700 hover:bg-rose-100 transition"
        @click="emit('reject')"
      >
        Reject
      </button>

      <button
        v-if="status === OrderStatus.IN_PROGRESS"
        class="rounded-2xl border border-green-300 bg-green-50 px-4 py-2 font-medium text-green-700 hover:bg-green-100 transition"
        @click="emit('deliver')"
      >
        Deliver
      </button>
    </template>

    <!-- Non-Admin Actions -->
    <template v-else>
      <button
      v-if="status === OrderStatus.PENDING"
        class="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 font-medium text-rose-700 hover:bg-rose-100 transition"
        @click="emit('cancel')"
      >
        Cancel Order
      </button>

      <button
        class="rounded-2xl border border-charcoal/20 bg-white px-4 py-2 font-medium text-secondary hover:bg-sold-light hover:bg-solid-light transition"
        @click="emit('edit')"
      >
        Edit Order
      </button>
    </template>

  </div>
</template>
