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
          :orderData="quote" :is-edit-mode="true" @success="() => handleSuccess(DataSource.ORDER)"
          @error="handleError" />

        <VectorForm headerTitle="Edit Quote" v-if="quote && !pending && dataSourceType === DataSource.VECTOR"
          :vectorData="quote" :isEditMode="true" @success="() => handleSuccess(DataSource.VECTOR)"
          @error="handleError" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const handleSuccess = (dataSourceType: DataSource) => {
  toast.success('Quote updated successfully!');
  // Redirect to order details page
  router.push(`/quotes/${route.params.id}?type=${dataSourceType}`);
};

const handleError = () => {
  toast.error('Something went wrong. Please try again.');
};

definePageMeta({
  name: "Edit Order",
  layout: "portal",
  middleware: ["auth"],
});
</script>