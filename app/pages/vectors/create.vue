<template>
  <div class="min-h-screen bg-light-gray">
    <div class="container py-8">
      <!-- Header -->
      <div class="mb-8">
        <p class="text-gray-600">
          Fill in the details below to create a new vector
        </p>
      </div>

      <!-- Form -->
      <VectorForm
        @success="handleSuccess"
        @error="handleError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const toast = useToast();

const handleSuccess = () => {
  toast.success('Order created successfully!');
  // Redirect to orders list
  router.push('/vectors');
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
