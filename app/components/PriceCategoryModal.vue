<template>
  <UiModal v-model="isOpen" class="max-w-2xl">
    <div class="space-y-6">
      <div class="text-center space-y-3">
        <div
          class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <Icon name="Tag" class="w-8 h-8 text-primary" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Set Price Category</h2>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput
            v-model="left_chest_hat"
            name="left_chest_hat"
            label="Left-Chest / Hat"
            placeholder="Enter price"
            :error="errors.left_chest_hat"
          />
          <UiInput
            v-model="simple_jacket_back"
            name="simple_jacket_back"
            label="Simple Jacket-Back"
            placeholder="Enter price"
            :error="errors.simple_jacket_back"
          />
          <UiInput
            v-model="complex_jacket_back"
            name="complex_jacket_back"
            label="Complex Jacket-Back"
            placeholder="Enter price"
            :error="errors.complex_jacket_back"
          />
          <UiInput
            v-model="applique_jacket_back"
            name="applique_jacket_back"
            label="Applique Jacket-Back"
            placeholder="Enter price"
            :error="errors.applique_jacket_back"
          />
          <UiInput
            v-model="simple_vector"
            name="simple_vector"
            label="Simple Vector"
            placeholder="Enter price"
            :error="errors.simple_vector"
          />
          <UiInput
            v-model="complex_vector"
            name="complex_vector"
            label="Complex Vector"
            placeholder="Enter price"
            :error="errors.complex_vector"
          />
        </div>
      </form>
    </div>

    <template #footer>
      <div class="flex gap-3 w-full">
        <UiButton
          variant="danger"
          size="lg"
          :disabled="isSubmitting"
          class="flex-1"
          rounded
          @click="isOpen = false"
        >
          Cancel
        </UiButton>
        <UiButton
          variant="primary"
          size="lg"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          class="flex-1"
          rounded
          @click="onSubmit"
        >
          Save
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { PriceCategorySchema } from "~~/shared/validationSchema";
import type { PriceCategoryRequest } from "#shared/types";

interface Props {
  modelValue: boolean;
  userId: string | number;
  initialValues?: Partial<PriceCategoryRequest>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  saved: [values: PriceCategoryRequest];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const defaultValues: PriceCategoryRequest = {
  left_chest_hat: "",
  simple_jacket_back: "",
  complex_jacket_back: "",
  applique_jacket_back: "",
  simple_vector: "",
  complex_vector: "",
};

const { handleSubmit, defineField, errors, isSubmitting, setValues } =
  useForm({
    initialValues: { ...defaultValues, ...(props.initialValues || {}) },
    validationSchema: toTypedSchema(PriceCategorySchema),
  });

const [left_chest_hat] = defineField("left_chest_hat");
const [simple_jacket_back] = defineField("simple_jacket_back");
const [complex_jacket_back] = defineField("complex_jacket_back");
const [applique_jacket_back] = defineField("applique_jacket_back");
const [simple_vector] = defineField("simple_vector");
const [complex_vector] = defineField("complex_vector");

watch(
  () => props.initialValues,
  (v) => {
    setValues({ ...defaultValues, ...(v || {}) });
  },
);

watch(
  () => props.modelValue,
  (open) => {
    if (open) setValues({ ...defaultValues, ...(props.initialValues || {}) });
  },
);

const toast = useToast();

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch("/api/price-categories", {
      method: "POST",
      body: { userId: props.userId, ...values },
    });
    toast.success("Price category saved successfully");
    emit("saved", values);
    isOpen.value = false;
  } catch (err: any) {
    const msg =
      err?.data?.message ||
      err?.data?.statusMessage ||
      err?.message ||
      "Failed to save price category";
    toast.error(msg);
  }
});
</script>
