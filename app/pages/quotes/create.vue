<template>
    <div class="min-h-screen bg-light-gray">
      <div class="container py-8">
        <!-- Header -->
        <div class="mb-8">
          <p class="text-gray-600">
            Fill in the details below to create a new quote
          </p>
        </div>
  
        <!-- Form -->
        <OrderForm
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
  