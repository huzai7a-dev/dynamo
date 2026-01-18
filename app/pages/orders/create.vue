<template>
  <div class="min-h-screen bg-light-gray">
    <div class="container py-8">
      <!-- Header -->
      <div class="mb-8">
        <p class="text-gray-600">
          Fill in the details below to create a new order
        </p>
      </div>

      <!-- Form -->
      <OrderForm headerTitle="Send Order" @success="handleSuccess" @error="handleError" />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const toast = useToast();

const handleSuccess = () => {
  toast.success('Order placed successfully!');
  // Redirect to orders list
  router.push('/orders');
};

const handleError = () => {
  toast.error('Something went wrong. Please try again.');
};

definePageMeta({
  name: "Create Order",
  layout: "portal",
  middleware: ["auth"],
});
</script>
