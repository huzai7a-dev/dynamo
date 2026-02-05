<script setup lang="ts">
import { computed } from "vue";
import { OrderStatus } from "~~/shared/types/enums";

interface Props {
  isAdmin?: boolean;
  status: OrderStatus;
  size?: "default" | "compact";
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false,
  size: "default",
});

const emit = defineEmits<{
  (e: "approve"): void;
  (e: "reject"): void;
  (e: "deliver"): void;
  (e: "cancel"): void;
  (e: "edit"): void;
}>();

const isCompact = computed(() => props.size === "compact");
</script>

<template>
  <div>
    <div v-if="isCompact" class="flex items-center gap-1">
      <!-- Compact Admin -->
      <template v-if="props.isAdmin">
        <button
          v-if="
            props.status === OrderStatus.PENDING ||
            props.status === OrderStatus.REJECTED
          "
          class="text-xs px-2 py-1 rounded bg-primary text-white"
          @click.stop="emit('approve')"
        >
          Approve
        </button>

        <button
          v-if="
            props.status === OrderStatus.PENDING ||
            props.status === OrderStatus.IN_PROGRESS
          "
          class="text-xs px-2 py-1 rounded border border-rose-300 text-rose-700 bg-rose-50"
          @click.stop="emit('reject')"
        >
          Reject
        </button>

        <button
          v-if="props.status === OrderStatus.IN_PROGRESS"
          class="text-xs px-2 py-1 rounded border border-green-300 text-green-700 bg-green-50"
          @click.stop="emit('deliver')"
        >
          Deliver
        </button>
      </template>

      <!-- Compact Non-admin -->
      <template v-else>
        <button
          v-if="props.status === OrderStatus.PENDING"
          class="text-xs px-2 py-1 rounded border border-rose-300 text-rose-700 bg-rose-50"
          @click.stop="emit('cancel')"
        >
          Cancel
        </button>

        <button
          class="text-xs px-2 py-1 rounded border border-charcoal/20 bg-white text-secondary"
          @click.stop="emit('edit')"
        >
          Edit
        </button>
      </template>
    </div>

    <div v-else class="flex flex-wrap items-center gap-3">
      <!-- Admin Actions -->
      <template v-if="props.isAdmin">
        <button
          v-if="
            props.status === OrderStatus.PENDING ||
            props.status === OrderStatus.REJECTED
          "
          class="rounded-2xl bg-primary px-4 py-2 font-medium text-white shadow hover:bg-primary-dark transition"
          @click="emit('approve')"
        >
          Approve
        </button>

        <button
          v-if="
            props.status === OrderStatus.PENDING ||
            props.status === OrderStatus.IN_PROGRESS
          "
          class="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 font-medium text-rose-700 hover:bg-rose-100 transition"
          @click="emit('reject')"
        >
          Reject
        </button>

        <button
          v-if="props.status === OrderStatus.IN_PROGRESS"
          class="rounded-2xl border border-green-300 bg-green-50 px-4 py-2 font-medium text-green-700 hover:bg-green-100 transition"
          @click="emit('deliver')"
        >
          Deliver
        </button>
      </template>

      <!-- Non-Admin Actions -->
      <template v-else>
        <button
          v-if="props.status === OrderStatus.PENDING"
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
  </div>
</template>
