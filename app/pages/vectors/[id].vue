<template>
    <OrderDetailSkeleton v-if="pending" />

    <UiErrorState 
    v-else-if="error"
    title="Unable to Load Vector"
    message="We couldn't load the vector details. This might be due to a network issue or the vector might not exist."
    :loading="pending"
    back-route="/vectors"
    back-text="Back to Vectors"
    @retry="() => refresh()"
  />

  <div v-else-if="vector" class="min-h-screen bg-light-gray">
    <div class="container py-8">
      <!-- Header -->
      <OrderHeader
        :order_name="vector?.vector_name"
        :po_number="vector?.po_number"
        :status="vector?.status"
      />

      <!-- Main -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 class="mb-4 text-lg font-semibold text-secondary">
              Order Details
            </h2>
            <VectorMetaGrid :vector="vector" />
          </div>

          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <AttachmentsGallery
              title="Order Attachments"
              noAttachmentsMessage="No order attachments uploaded."
              :attachments="vector.vector_attachments || []"
            />
          </div>

          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <AttachmentsGallery
              title="Delivery Attachments"
              noAttachmentsMessage="No delivery attachments uploaded yet."
              :attachments="vector.delivery_attachments || []"
            />
          </div>
        </div>

        <aside class="space-y-6">
          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 class="mb-3 text-base font-semibold text-secondary">Summary</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-charcoal/70">Status</span>
                <UiStatusBadge :status="vector?.status" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-charcoal/70">Payment</span>
                <span
                  class="text-sm font-medium"
                  :class="
                    vector?.payment_status === 'paid'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  "
                >
                  {{ vector?.payment_status === "paid" ? "Paid" : "Pending" }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-charcoal/70">Estimate</span>
                <span class="text-sm font-medium text-secondary">
                  {{
                    vector?.price === "0.00"
                      ? "To be quoted"
                      : `$${vector?.price}`
                  }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 class="mb-4 text-lg font-semibold text-secondary">Notes</h2>
            <InstructionBox :instructions="vector?.instructions" />
          </div>
        
          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 class="mb-3 text-base font-semibold text-secondary">Actions</h3>
            <OrderActions
              :isAdmin="isAdmin"
              :status="vector?.status"
              @approve="updateVectorStatus(OrderStatus.IN_PROGRESS)"
              @reject="updateVectorStatus(OrderStatus.REJECTED)"
              @deliver="showDeliveryModal = true"
              @cancel="updateVectorStatus(OrderStatus.CANCELLED)"
              @edit="handleEditVector"
            />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROLE } from '~~/shared/constants';


interface VectorResponse {
  message: string;
  data: IVector;
}
definePageMeta({
  name: "Vector Details",
  layout: "portal",
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const { user } = useUserSession();

const toast = useToast();
const showDeliveryModal = ref(false);


const { data, pending, error, refresh } = useFetch<VectorResponse>(`/api/vectors/${route.params.id}`);

const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);
const vector = computed(() => data?.value?.data);

const updateVectorStatus = async (status: OrderStatus) => {
  try {
    await $fetch(`/api/vectors/status`, {
      method: "POST",
      body: { vectorId: route.params.id, status }
    });
    toast.success("Vector status updated successfully");
    refresh();
  } catch (error) {
    console.error("Error updating vector status:", error);
    toast.error("Failed to update vector status");
  }
}

const handleEditVector = () => {
  router.push(`/vectors/edit/${route.params.id}`);
};

</script>

<style scoped></style>