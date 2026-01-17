<template>
  <div class="min-h-screen bg-light-gray">
    <div class="container py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-secondary mb-2">
          Edit Order
        </h1>
        <p class="text-gray-600">
          Update your order details below
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Error State -->
      <UiErrorState 
        v-else-if="error"
        title="Unable to Load Order"
        message="We couldn't load the order details. This might be due to a network issue or the order might not exist."
        :loading="pending"
        back-route="/orders"
        back-text="Back to Orders"
        @retry="() => refresh()"
      />

      <!-- Form -->
      <div v-else>
        <OrderForm
          v-if="order && !pending"
          :order-data="order"
          :is-edit-mode="true"
          @success="handleSuccess"
          @error="handleError"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface OrderResponse {
  message: string;
  data: IOrder;
}

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Fetch order data
const { data, pending, error, refresh } = useFetch<OrderResponse>(
  `/api/orders/${route.params.id}`
);

const order = computed(() => data.value?.data);

const handleSuccess = () => {
  toast.success('Order updated successfully!');
  // Redirect to order details page
  router.push(`/orders/${route.params.id}`);
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
