<template>
    <div class="min-h-screen bg-light-gray">
      <div class="container py-8">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center gap-4">
          <p class="text-gray-600 block w-full">
            Fill in the details below to create a new quote
          </p>

          <div class="w-96">
            <UiSelect
              v-model="dataSourceType"
              label="Data Source Type"
              placeholder="Select"
              :options="dataSourceTypeOptions"
            />
          </div>
        </div>
  
        <!-- Form -->
        <OrderForm
          v-if="dataSourceType === DataSource.ORDER"
          endpoint="quotes"
          @success="handleSuccess"
          @error="handleError"
        />
        <VectorForm
          v-if="dataSourceType === DataSource.VECTOR"
          endpoint="quotes"
          @success="handleSuccess"
          @error="handleError"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const router = useRouter();
  const toast = useToast();

  const dataSourceType = ref(DataSource.ORDER);
  const dataSourceTypeOptions = [
    { label: "Order", value: DataSource.ORDER },
    { label: "Vector", value: DataSource.VECTOR },
  ];
  
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
  