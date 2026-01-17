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
  (e: 'accept'): void
  (e: 'reject'): void
  (e: 'proceed'): void
  (e: 'moveToOrder'): void
  (e: 'edit'): void
  (e: 'deliver'): void
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <!-- Admin Actions -->
    <template v-if="isAdmin">
      <!-- For Pending Status - Show only Deliver Order button -->
      <button v-if="status === QuoteStatus.PENDING || status === QuoteStatus.REJECTED"
        class="rounded-2xl bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700 transition"
        @click="emit('deliver')">
        Deliver Order
      </button>
    </template>

    <!-- Non-Admin Actions -->
    <template v-else>
      <!-- Actions for Quoted Status -->
      <template v-if="status === QuoteStatus.QUOTED">
        <button class="rounded-2xl bg-green-600 px-4 py-2 font-medium text-white shadow hover:bg-green-700 transition"
          @click="emit('accept')">
          Accept
        </button>
        <button
          class="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 font-medium text-red-700 hover:bg-red-100 transition"
          @click="emit('reject')">
          Reject
        </button>
      </template>

    </template>

  </div>
</template>
