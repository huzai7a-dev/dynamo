<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-start justify-center p-6"
    >
      <div class="fixed inset-0 bg-black/40" @click="close"></div>

      <div
        class="relative w-full max-w-4xl max-h-[85vh] overflow-auto rounded-2xl bg-white shadow-lg"
      >
        <div class="flex items-center justify-between border-b px-4 py-3">
          <h3 class="text-base font-semibold text-secondary">{{ title }}</h3>
          <button class="p-1.5 rounded hover:bg-slate-100" @click="close">
            <Icon name="X" :size="18" />
          </button>
        </div>

        <div class="p-4">
          <EntityDetailBody
            ref="bodyRef"
            :type="type"
            :entityId="entityId"
            :immediate="false"
            :compact="true"
            @refresh="emit('refresh')"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import Icon from "./Icon.vue";
import EntityDetailBody from "./EntityDetailBody.vue";

type EntityType = "order" | "vector" | "quote";

const TITLES: Record<EntityType, string> = {
  order: "Order Details",
  vector: "Vector Details",
  quote: "Quote Details",
};

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    type: EntityType;
    entityId?: string | number;
  }>(),
  {
    modelValue: false,
    entityId: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "refresh"): void;
}>();

const title = computed(() => TITLES[props.type]);
const modelValue = computed(() => props.modelValue);
const bodyRef = ref<InstanceType<typeof EntityDetailBody> | null>(null);

// Trigger data fetch when modal opens
watch(modelValue, async (isOpen) => {
  if (isOpen && props.entityId) {
    await nextTick(); // wait for v-if to mount EntityDetailBody before calling refresh
    bodyRef.value?.refresh();
  }
});

const close = () => emit("update:modelValue", false);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
