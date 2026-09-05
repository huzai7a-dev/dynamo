<script setup lang="ts">
import { computed } from "vue";
import { QuoteStatus } from "~~/shared/types/enums";

interface Props {
  isAdmin?: boolean;
  status: QuoteStatus;
  size?: "default" | "compact";
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false,
  status: QuoteStatus.PENDING,
  size: "default",
});

const emit = defineEmits<{
  (e: "accept"): void;
  (e: "edit"): void;
}>();

const isCompact = computed(() => props.size === "compact");
</script>

<template>
  <div>
    <div v-if="isCompact" class="flex items-center gap-1">
      <!-- Compact Non-Admin Actions -->
      <template v-if="!props.isAdmin">
        <button
          v-if="props.status !== QuoteStatus.PROCEED"
          class="text-xs px-2 py-1 rounded bg-primary text-white transition"
          @click="emit('edit')"
        >
          Edit Quote
        </button>
        <!-- <template v-if="props.status !== QuoteStatus.PROCEED">
          <button class="text-xs px-2 py-1 rounded bg-primary text-white transition" @click="emit('accept')">
            Convert
          </button>
        </template> -->
      </template>
    </div>

    <div v-else class="flex flex-wrap items-center gap-3">
      <!-- Default Non-Admin Actions -->
      <template v-if="!props.isAdmin">
        <button
          v-if="props.status !== QuoteStatus.PROCEED"
          class="rounded-2xl bg-primary px-4 py-2 font-medium text-white shadow transition"
          @click="emit('edit')"
        >
          Edit Quote
        </button>
        <!-- <template v-if="props.status !== QuoteStatus.PROCEED">
          <button class="rounded-2xl bg-primary px-4 py-2 font-medium text-white shadow transition"
            @click="emit('accept')">
            Convert
          </button>
        </template> -->
      </template>
    </div>
  </div>
</template>
