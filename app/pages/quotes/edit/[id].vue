<template>
  <div class="min-h-screen bg-light-gray">
    <div class="container py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-secondary mb-2">
          Edit Quote
        </h1>
        <p class="text-gray-600">
          Update your quote details below
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Error State -->
      <UiErrorState v-else-if="error" title="Unable to Load Quote"
        message="We couldn't load the quote details. This might be due to a network issue or the quote might not exist."
        :loading="pending" back-route="/quotes" back-text="Back to Quotes" @retry="() => refresh()" />

      <!-- Form -->
      <div v-else>
        <OrderForm headerTitle="Edit Quote" v-if="quote && !pending && dataSourceType === DataSource.ORDER"
          :orderData="formData as any" :is-edit-mode="true" endpoint="quotes" @success="() => handleSuccess(DataSource.ORDER)"
          @error="handleError" />

        <VectorForm headerTitle="Edit Quote" v-if="quote && !pending && dataSourceType === DataSource.VECTOR"
          :vectorData="formData as any" :isEditMode="true" endpoint="quotes" @success="() => handleSuccess(DataSource.VECTOR)"
          @error="handleError" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IOrder, IVector } from '~~/shared/types';
import { DataSource, QuoteStatus } from '~~/shared/types/enums';

interface QuoteResponse {
  message: string;
  data: IOrder | IVector;
}

const route = useRoute();
const router = useRouter();
const toast = useToast();

const dataSourceType = computed(() => route.query.type as DataSource);

// Fetch order data
const { data, pending, error, refresh } = useFetch<QuoteResponse>(
  `/api/quotes/${route.params.id}?type=${dataSourceType.value}`
);

const quote = computed(() => data.value?.data);

watch(
  quote,
  (q) => {
    if (q && (q as any).status === QuoteStatus.PROCEED) {
      toast.error("This quote has already been converted and cannot be edited.");
      router.replace(`/quotes/${route.params.id}?type=${dataSourceType.value}`);
    }
  },
  { immediate: true },
);

// The stored quote row (title/po_number/instructions/estimated_price + a
// quote_data JSON blob of type-specific fields) doesn't match the column
// names OrderForm/VectorForm expect from a real order/vector row — adapt it
// so the edit forms pre-fill correctly.
const formData = computed(() => {
  const q = quote.value as any;
  if (!q) return undefined;
  const qd = q.quote_data || {};

  if (dataSourceType.value === DataSource.ORDER) {
    return {
      id: q.id,
      order_name: q.title,
      po_number: q.po_number,
      required_format: qd.requiredFormat,
      required_stitch: qd.requiredStitch,
      width_in: qd.width,
      height_in: qd.height,
      fabric: qd.fabric,
      placement: qd.placement,
      num_colors: qd.numColors,
      blending: qd.blending,
      rush: qd.rush,
      faceless: qd.faceless,
      instructions: q.instructions,
      order_attachments: q.quote_attachments,
    };
  }

  return {
    id: q.id,
    vector_name: q.title,
    po_number: q.po_number,
    required_format: qd.requiredFormat,
    num_colors: qd.numColors,
    blending: qd.blending,
    rush: qd.rush,
    vector_type: qd.vectorType,
    instructions: q.instructions,
    vector_attachments: q.quote_attachments,
  };
});

const handleSuccess = (dataSourceType: DataSource) => {
  toast.success('Quote updated successfully!');
  // Redirect to order details page
  router.push(`/quotes/${route.params.id}?type=${dataSourceType}`);
};

const handleError = () => {
  toast.error('Something went wrong. Please try again.');
};

definePageMeta({
  name: "Edit Quote",
  layout: "portal",
  middleware: ["auth", "block-admin"],
});
</script>