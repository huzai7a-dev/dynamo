<template>
  <!-- Loading State -->
  <OrderDetailSkeleton v-if="pending" />

  <!-- Error State -->
  <UiErrorState v-else-if="error" title="Unable to Load Quote"
    message="We couldn't load the quote details. This might be due to a network issue or the quote might not exist."
    :loading="pending" back-route="/quotes" back-text="Back to Quotes" @retry="() => refresh()" />

  <!-- Success State -->
  <div v-else-if="quote">
    <QuoteDetail :quote="quote" :isAdmin="isAdmin" :quoteId="String(route.params.id)">
      <template #actions>
        <QuoteActions :isAdmin="isAdmin" :status="quote?.status" @accept="handleMoveToOrder(quote.q_type)"
          @reject="handleRejectClick" @proceed="updateOrderStatus(QuoteStatus.PROCEED, quote.q_type)"
          @edit="handleEditOrder" @deliver="showDeliveryModal = true" />

      </template>
    </QuoteDetail>

    <!-- Delivery Modal -->
    <QuoteDeliveryModal v-model="showDeliveryModal" :quoteId="String(route.params.id)" :initialValues="{
      stitchCount: quote?.quote_data?.stitch_count || '',
      turnAroundTime: quote?.quote_data?.turn_around_time || '',
      price: quote?.estimated_price || '',
      additionalQuery: quote?.quote_data?.additional_query || ''
    }" @on:deliver="handleDeliver" />
    <QuoteRejectModal v-model="showRejectModal" :loading="rejecting" @confirm="handleRejectConfirm" />
  </div>
</template>

<script setup lang="ts">
import OrderDetailSkeleton from "~/components/skeletons/OrderDetailSkeleton.vue";
import { ROLE } from "~~/shared/constants";
import { DataSource, QuoteStatus } from "~~/shared/types/enums";

interface QuoteResponse {
  message: string;
  data: any; // Using any to accommodate the unified quote structure including q_type
}

const route = useRoute();
const router = useRouter();
const { user } = useUserSession();

const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

const toast = useToast();
const showDeliveryModal = ref(false);

const { data, pending, error, refresh } = useFetch<QuoteResponse>(
  `/api/quotes/${route.params.id}`
);

const quote = computed(() => data.value?.data);

// Using quote.q_type for dataSourceType logic
const updateOrderStatus = async (status: QuoteStatus, dataSourceType: DataSource) => {
  try {
    await $fetch(`/api/quotes/status`, {
      method: "POST",
      body: { quoteId: route.params.id, status, dataSourceType }
    });
    toast.success("Quote status updated successfully");
    refresh();
  } catch (error) {
    console.error("Error updating quote status:", error);
    toast.error("Failed to update quote status");
  }
}

const handleEditOrder = () => {
  // Redirect to edit page with correct type
  router.push(`/quotes/edit/${route.params.id}?type=${quote.value?.q_type}`);
};

const handleMoveToOrder = async (dataSourceType: DataSource) => {
  try {
    await $fetch(`/api/quotes/move-to-order`, {
      method: "POST",
      body: { quoteId: route.params.id, dataSourceType }
    });
    toast.success("Quote moved to order successfully");
    refresh();
  } catch (error) {
    console.error("Error moving quote to order:", error);
    toast.error("Failed to move quote to order");
  }
};

const handleDeliver = async (form: any) => {
  try {
    const formData = new FormData();
    formData.append('stitchCount', form.stitchCount);
    formData.append('turnAroundTime', form.turnAroundTime);
    formData.append('price', form.price);
    formData.append('additionalQuery', form.additionalQuery);

    // Append files
    if (form.attachments && form.attachments.length > 0) {
      form.attachments.forEach((file: File) => {
        formData.append('attachments', file);
      });
    }

    await $fetch(`/api/quotes/deliver/${route.params.id}`, {
      method: "POST",
      body: formData
    });

    toast.success("Quote delivered successfully");
    showDeliveryModal.value = false;
    refresh();

  } catch (error: any) {
    console.error("Error delivering quote:", error);
    toast.error(error.statusMessage || "Failed to deliver quote");
  }
};

const showRejectModal = ref(false);
const rejecting = ref(false);

const handleRejectClick = () => {
  showRejectModal.value = true;
};

const handleRejectConfirm = async (reason: string) => {
  try {
    rejecting.value = true;
    await $fetch('/api/quotes/reject', {
      method: "POST",
      body: { quoteId: route.params.id, reason }
    });
    toast.success("Quote rejected successfully");
    showRejectModal.value = false;
    refresh();
  } catch (error: any) {
    console.error("Error rejecting quote:", error);
    toast.error(error.message || "Failed to reject quote");
  } finally {
    rejecting.value = false;
  }
};

definePageMeta({
  name: "Quotes Details",
  layout: "portal",
  middleware: ["auth"],
});

</script>

<style scoped>
/* subtle polish */
.container :where(.card) {
  animation: fade-in 0.6s ease-in-out both;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>