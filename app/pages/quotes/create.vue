<template>
  <div class="min-h-screen bg-light-gray">
    <div class="container py-8">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center gap-4">
        <p class="text-gray-600 block w-full">
          Fill in the details below to create a new quote
        </p>
      </div>

      <!-- Form -->
      <OrderForm headerTitle="Send Quote" v-if="dataSourceType === DataSource.ORDER" endpoint="quotes"
        @success="handleSuccess" @error="handleError" />
      <VectorForm headerTitle="Send Quote" v-if="dataSourceType === DataSource.VECTOR" endpoint="quotes"
        @success="handleSuccess" @error="handleError" />
    </div>
  </div>
</template>

<script setup lang="ts">

const router = useRouter();
const { query } = useRoute();
const toast = useToast();

const dataSourceType = ref(query?.type || DataSource.ORDER);

const handleSuccess = () => {
  toast.success('Quote created successfully!');
  router.push('/quotes');
};

const handleError = () => {
  toast.error('Something went wrong. Please try again.');
};

definePageMeta({
  name: "Create Quote",
  layout: "portal",
  middleware: ["auth"],
});
</script>