<script setup lang="ts">
import { computed } from 'vue';
import { QuoteStatus } from '~~/shared/types/enums';

interface Props {
  isAdmin?: boolean
  status: QuoteStatus
  size?: "default" | "compact"
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false,
  status: QuoteStatus.PENDING,
  size: "default"
})

const emit = defineEmits<{
  (e: 'accept'): void
  (e: 'reject'): void
  (e: 'proceed'): void
  (e: 'moveToOrder'): void
  (e: 'edit'): void
  (e: 'deliver'): void
}>()

const isCompact = computed(() => props.size === "compact");
</script>

<template>
  <div>
    <div v-if="isCompact" class="flex items-center gap-1">
      <!-- Compact Admin Actions -->
      <template v-if="props.isAdmin">
        <button v-if="props.status === QuoteStatus.PENDING || props.status === QuoteStatus.REJECTED"
          class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          @click.stop="emit('deliver')">
          Deliver
        </button>
      </template>

      <!-- Compact Non-Admin Actions -->
      <template v-else>
        <button class="text-xs px-2 py-1 rounded bg-white border border-gray-200 transition" @click="emit('edit')">
          Edit
        </button>
        <template v-if="props.status === QuoteStatus.QUOTED">
          <button class="text-xs px-2 py-1 rounded bg-primary text-white transition" @click="emit('accept')">
            Convert
          </button>


          <!-- <button
            class="text-xs px-2 py-1 rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition"
            @click.stop="emit('reject')">
            Reject
          </button> -->
        </template>

      </template>
    </div>

    <div v-else class="flex flex-wrap items-center gap-3">
      <!-- Default Admin Actions -->
      <template v-if="props.isAdmin">
        <button v-if="props.status === QuoteStatus.PENDING || props.status === QuoteStatus.REJECTED"
          class="rounded-2xl bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700 transition"
          @click="emit('deliver')">
          Deliver Order
        </button>
      </template>

      <!-- Default Non-Admin Actions -->
      <template v-else>
        <button class="rounded-2xl bg-green-600 px-4 py-2 font-medium text-white shadow transition"
          @click="emit('edit')">
          Edit
        </button>
        <template v-if="props.status === QuoteStatus.QUOTED">
          <button class="rounded-2xl bg-primary px-4 py-2 font-medium text-white shadow transition"
            @click="emit('accept')">
            Convert
          </button>


          <!-- <button
            class="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 font-medium text-red-700 hover:bg-red-100 transition"
            @click="emit('reject')">
            Reject
          </button> -->
        </template>

      </template>
    </div>
  </div>
</template>
