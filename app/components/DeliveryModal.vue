<template>
  <UiModal
    v-model="isOpen"
    class="max-w-8xl min-w-6xl max-h-[90vh] overflow-y-auto"
  >
    <div
      class="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-500">Order #</span>
        <span class="text-base font-semibold text-gray-900">{{ orderId }}</span>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <Icon name="Calendar" class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-700">{{
            new Date(orderDate).toDateString()
          }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="Clock" class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-700">{{
            new Date(orderDate).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
          }}</span>
        </div>
      </div>
    </div>
    <div class="space-y-8">
      <!-- Header -->
      <div class="text-center space-y-3">
        <div
          class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
        >
          <Icon name="Package" class="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Deliver Order</h2>
        </div>
      </div>

      <!-- Client Price Category Info -->
      <div class="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 space-y-3">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-1.5">
            <Icon name="Tag" class="w-3.5 h-3.5 text-blue-600" />
            <h3 class="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Client Price Category
            </h3>
          </div>
          <UiButton variant="secondary" size="sm" class="!py-1 !px-2.5 !text-xs" @click="showPriceCategoryModal = true">
            <Icon name="Tag" class="w-3 h-3" />
            Set Price Category
          </UiButton>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2.5">
          <div v-for="field in priceCategoryFields" :key="field.key">
            <p class="text-[10px] font-medium text-blue-900/60 uppercase tracking-wide leading-tight">
              {{ field.label }}
            </p>
            <p class="text-xs font-semibold text-gray-900">
              {{ (priceCategoryData as any)?.[field.key] || "Not set" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Pricing Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
            <Icon name="DollarSign" class="w-5 h-5 text-green-600" />
            <h3 class="text-lg font-semibold text-gray-900">Pricing Details</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput
              v-model="formData.stitches"
              label="Stitches"
              placeholder="Enter stitch count"
              type="number"
            />
            <UiInput
              v-model="formData.price"
              label="Price"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              :disabled="formData.order_category === 'free'"
              required
            />
            <UiInput
              v-model="formData.discount"
              label="Discount(%)"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              :disabled="formData.order_category === 'free'"
            />
            <UiInput
              v-model="formData.total_price"
              label="Total Price"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              readonly
            />
          </div>
          <!-- 
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="formData.minimum_price" label="Minimum Price" placeholder="0.00" type="number" step="0.01" min="0" />
            <UiInput v-model="formData.maximum_price" label="Maximum Price" placeholder="0.00" type="number" step="0.01" min="0" />
            <UiInput v-model="formData.thousand_stitches" label="1000 Stitches" placeholder="0.00" type="number" step="0.01" min="0" />
            <UiInput v-model="formData.assign_percentage" label="Assign Percentage" placeholder="0" type="number" min="0" max="100" />
          </div> -->

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex">
              <div class="flex flex-col gap-2">
                <p>Order Category</p>
                <div class="flex gap-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="formData.order_category === 'free'"
                      @change="formData.order_category = 'free'"
                      class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5"
                    />
                    <span class="text-sm font-medium text-gray-700">Free</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="formData.order_category === 'paid'"
                      @change="formData.order_category = 'paid'"
                      class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5"
                    />
                    <span class="text-sm font-medium text-gray-700">Paid</span>
                  </label>
                </div>
              </div>
            </div>
            <UiInput
              v-model="formData.designer_level"
              label="Designer Level"
              placeholder="Enter designer level"
            />
          </div>
        </div>

        <!-- Dimensions Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
            <Icon name="Ruler" class="w-5 h-5 text-blue-600" />
            <h3 class="text-lg font-semibold text-gray-900">Dimensions</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput
              v-model="formData.height"
              label="Height"
              placeholder="Enter height"
              type="number"
              step="0.01"
              min="0"
            />
            <UiInput
              v-model="formData.width"
              label="Width"
              placeholder="Enter width"
              type="number"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <!-- Delivery Options Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
            <Icon name="Truck" class="w-5 h-5 text-purple-600" />
            <h3 class="text-lg font-semibold text-gray-900">
              Delivery Options
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput
              v-model="formData.normal_delivery"
              label="Normal Delivery"
              placeholder="Enter delivery time"
            />
            <UiInput
              v-model="formData.edit_or_change"
              label="Edit or Change"
              placeholder="Enter edit policy"
            />
            <UiInput
              v-model="formData.edit_in_stitch_file"
              label="Edit in Stitch File"
              placeholder="Enter edit policy"
            />
          </div>
        </div>

        <!-- Comments Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
            <Icon name="MessageSquare" class="w-5 h-5 text-orange-600" />
            <h3 class="text-lg font-semibold text-gray-900">
              Comments & Notes
            </h3>
          </div>

          <div class="space-y-4">
            <UiTextarea
              v-model="formData.comments"
              placeholder="Enter comments"
              :rows="3"
            />
          </div>
        </div>

        <!-- File Upload Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
            <Icon name="File" class="w-5 h-5 text-indigo-600" />
            <h3 class="text-lg font-semibold text-gray-900">Attachments</h3>
          </div>

          <div class="space-y-3">
            <p class="text-sm text-gray-600">
              Upload the final deliverables (designs, proofs, vector files,
              etc.)
            </p>
            <div
              class="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/50"
            >
              <UiFileUploader
                v-model:files="formData.attachments"
                :multiple="true"
                :max-files="10"
                accept="'*/*'"
              />
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <div class="flex gap-3 w-full">
        <UiButton
          variant="danger"
          size="lg"
          @click="handleCancel"
          :disabled="loading"
          class="flex-1"
          rounded
        >
          <Icon name="X" class="w-4 h-4" />
          Cancel
        </UiButton>
        <UiButton
          variant="primary"
          size="lg"
          :loading="loading"
          :disabled="!isFormValid"
          @click="handleSubmit"
          class="flex-1"
          rounded
        >
          <Icon name="File" class="w-4 h-4" />
          Complete Delivery
        </UiButton>
      </div>
    </template>
  </UiModal>

  <PriceCategoryModal
    v-model="showPriceCategoryModal"
    :userId="userId"
    :initialValues="priceCategoryData ?? undefined"
    @saved="handlePriceCategorySaved"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { IPriceCategory } from "#shared/types";

export interface DeliveryFormData {
  stitches: string;
  price: string;
  discount: string;
  total_price: string;
  order_category: "free" | "paid";
  height: string;
  width: string;
  comments: string;
  designer_level: string;
  assign_percentage: string;
  minimum_price: string;
  maximum_price: string;
  thousand_stitches: string;
  normal_delivery: string;
  edit_or_change: string;
  edit_in_stitch_file: string;
  attachments: File[];
}

interface Props {
  modelValue: boolean;
  orderId: string;
  orderDate: string;
  userId: string | number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "on:deliver": [data: DeliveryFormData];
}>();

const initialFormData: DeliveryFormData = {
  stitches: "",
  price: "",
  discount: "",
  total_price: "",
  order_category: "free",
  height: "",
  width: "",
  comments: "",
  designer_level: "",
  assign_percentage: "",
  minimum_price: "",
  maximum_price: "",
  thousand_stitches: "",
  normal_delivery: "",
  edit_or_change: "",
  edit_in_stitch_file: "",
  attachments: [],
};

const formData = ref<DeliveryFormData>(initialFormData);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Computed property for total price calculation
const calculatedTotalPrice = computed(() => {
  const price = parseFloat(formData.value.price) || 0;
  const discount = parseFloat(formData.value.discount) || 0;
  return (price - discount).toFixed(2);
});

// Watch for price and discount changes to update total price
watch(
  [() => formData.value.price, () => formData.value.discount],
  () => {
    formData.value.total_price = calculatedTotalPrice.value;
  },
  { immediate: true },
);

// Clear price/discount when order is marked free (fields are disabled in that case)
watch(
  () => formData.value.order_category,
  (category) => {
    if (category === "free") {
      formData.value.price = "";
      formData.value.discount = "";
    }
  },
);

const isFormValid = computed(() => {
  if (formData.value.attachments.length === 0) return false;
  if (formData.value.order_category === "free") return true;
  return parseFloat(formData.value.price) > 0;
});

// The actual delivery request happens in the parent (so the loading prop can
// reflect the real in-flight request). The parent closes the modal by
// setting v-model to false once delivery succeeds.
watch(
  () => props.modelValue,
  (open) => {
    if (!open) formData.value = initialFormData;
  },
);

const handleSubmit = () => {
  if (!isFormValid.value || props.loading) return;
  emit("on:deliver", formData.value);
};

const handleCancel = () => {
  isOpen.value = false;
};

// ─── Client price category ─────────────────────────────────────────────────
const priceCategoryFields = [
  { key: "price", label: "Price" },
  { key: "left_chest_hat", label: "Left-Chest / Hat" },
  { key: "simple_jacket_back", label: "Simple Jacket-Back" },
  { key: "complex_jacket_back", label: "Complex Jacket-Back" },
  { key: "applique_jacket_back", label: "Applique Jacket-Back" },
  { key: "simple_vector", label: "Simple Vector" },
  { key: "complex_vector", label: "Complex Vector" },
] as const;

const priceCategoryData = ref<IPriceCategory | null>(null);
const showPriceCategoryModal = ref(false);

const fetchPriceCategory = async () => {
  if (!props.userId) return;
  try {
    const res = await $fetch<{ data: IPriceCategory | null }>(
      `/api/price-categories/${props.userId}`,
    );
    priceCategoryData.value = res.data;
  } catch (e) {
    console.error("Failed to load price category", e);
  }
};

watch(
  () => props.modelValue,
  (open) => {
    if (open) fetchPriceCategory();
  },
);

const handlePriceCategorySaved = (values: Partial<IPriceCategory>) => {
  priceCategoryData.value = { ...priceCategoryData.value, ...values } as IPriceCategory;
};
</script>
