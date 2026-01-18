<template>
  <div class="min-h-screen bg-light-gray">
    <div class="container py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-secondary mb-2">
          Edit Vector
        </h1>
        <p class="text-gray-600">
          Update your vector details below
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Error State -->
      <UiErrorState v-else-if="error" title="Unable to Load Order"
        message="We couldn't load the order details. This might be due to a network issue or the order might not exist."
        :loading="pending" back-route="/orders" back-text="Back to Orders" @retry="() => refresh()" />

      <!-- Form -->
      <div v-else>
        <VectorForm headerTitle="Edit Vector" v-if="vector && !pending" :vectorData="vector" :is-edit-mode="true"
          @success="handleSuccess" @error="handleError" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IVector } from '~~/shared/types';

interface VectorResponse {
  message: string;
  data: IVector;
}

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Fetch order data
const { data, pending, error, refresh } = useFetch<VectorResponse>(
  `/api/vectors/${route.params.id}`
);

const vector = computed(() => data.value?.data);

const handleSuccess = () => {
  toast.success('Vector updated successfully!');
  router.push(`/vectors/${route.params.id}`);
};

const handleError = () => {
  toast.error('Something went wrong. Please try again.');
};

definePageMeta({
  name: "Edit Vector",
  layout: "portal",
  middleware: ["auth"],
});
</script>