<script setup lang="ts">
import { QuoteStatus } from '~~/shared/types/enums';


interface Props {
  isAdmin?: boolean
  status: QuoteStatus
}

withDefaults(defineProps<Props>(), {
  isAdmin: false,
  status: QuoteStatus.PENDING
})

const emit = defineEmits<{
  (e:'accept'): void
  (e:'reject'): void
  (e:'proceed'): void
  (e:'moveToOrder'): void
  (e:'edit'): void
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <!-- Admin Actions -->
    <template v-if="isAdmin">
      <button
        v-if="status === QuoteStatus.PENDING || status === QuoteStatus.REJECTED"
        class="rounded-2xl bg-green-600 px-4 py-2 font-medium text-white shadow hover:bg-green-700 transition"
        @click="emit('accept')"
      >
        Accept
      </button>

      <button
        v-if="status === QuoteStatus.PENDING || status === QuoteStatus.ACCEPTED"
        class="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 font-medium text-red-700 hover:bg-red-100 transition"
        @click="emit('reject')"
      >
        Reject
      </button>
      <button
        v-if="status === QuoteStatus.ACCEPTED"
        class="rounded-2xl border border-purple-300 bg-purple-50 px-4 py-2 font-medium text-purple-700 hover:bg-purple-100 transition"
        @click="emit('moveToOrder')"
      >
        Move to Order
      </button>
    </template>

    <!-- Non-Admin Actions -->
    <template v-else>
        <button
        v-if="status === QuoteStatus.ACCEPTED"
        class="rounded-2xl border border-blue-300 bg-blue-50 px-4 py-2 font-medium text-blue-700 hover:bg-blue-100 transition"
        @click="emit('proceed')"
      >
        Proceed
      </button>
      <button
        class="rounded-2xl border border-charcoal/20 bg-white px-4 py-2 font-medium text-secondary hover:bg-sold-light hover:bg-solid-light transition"
        @click="emit('edit')"
      >
        Edit Quote
      </button>
    </template>

  </div>
</template>
