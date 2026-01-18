<template>
  <OrderDetailSkeleton v-if="pending" />

  <UiErrorState v-else-if="error" title="Unable to Load Vector"
    message="We couldn't load the vector details. This might be due to a network issue or the vector might not exist."
    :loading="pending" back-route="/vectors" back-text="Back to Vectors" @retry="() => refresh()" />

  <div v-else-if="vector" class="min-h-screen bg-light-gray">
    <div class="container py-8">
      <!-- Header -->
      <OrderHeader :order_name="vector?.vector_name" :po_number="vector?.po_number" :status="vector?.status" />

      <!-- Main -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-lg font-semibold text-secondary">
              Order Details
            </h2>
            <VectorMetaGrid :vector="vector" />
            <AttachmentsGallery class="mt-6" title="Attachments" noAttachmentsMessage="No vector attachments uploaded."
              :attachments="vector.vector_attachments || []" />
          </div>

          <!-- <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <AttachmentsGallery
              title="Order Attachments"
              noAttachmentsMessage="No order attachments uploaded."
              :attachments="vector.vector_attachments || []"
            />
          </div> -->

          <!-- Delivery Details -->
          <DeliveryDetails v-if="deliveryData" :deliveryData="deliveryData" />

        </div>

        <aside class="space-y-6">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="mb-3 text-base font-semibold text-secondary">Summary</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-charcoal/70">Status</span>
                <UiStatusBadge :status="vector?.status" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-charcoal/70">Payment</span>
                <span class="text-sm font-medium" :class="vector?.payment_status === 'paid'
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                  ">
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

          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-lg font-semibold text-secondary">Notes</h2>
            <InstructionBox :instructions="vector?.instructions" />
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="mb-3 text-base font-semibold text-secondary">Actions</h3>
            <OrderActions :isAdmin="isAdmin" :status="vector?.status"
              @approve="updateVectorStatus(OrderStatus.IN_PROGRESS)" @reject="updateVectorStatus(OrderStatus.REJECTED)"
              @deliver="showDeliveryModal = true" @cancel="updateVectorStatus(OrderStatus.CANCELLED)"
              @edit="handleEditVector" />
          </div>
        </aside>
      </div>
    </div>
  </div>
  <!-- Delivery Modal -->
  <DeliveryModal v-model="showDeliveryModal" :orderId="String(route.params.id)" :orderDate="vector?.created_at"
    @on:deliver="handleDeliveryComplete" />
</template>

<script setup lang="ts">
import type { DeliveryFormData } from '~/components/DeliveryModal.vue';
import { ROLE } from '~~/shared/constants';
import type { VectorDelivery } from '~~/shared/types';


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

const { data: deliveryData, pending: deliveryPending, error: deliveryError, refresh: deliveryRefresh } = useFetch<VectorDelivery>(`/api/vectors/deliver/${route.params.id}`);

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

const handleDeliveryComplete = async (deliveryData: DeliveryFormData) => {
  try {
    const fd = new FormData();

    // Required fields
    fd.append("vectorId", String(route.params.id));
    fd.append("stitches", deliveryData.stitches);
    fd.append("price", deliveryData.price);

    // Optional fields - only append if they have values
    if (deliveryData.discount) fd.append("discount", deliveryData.discount);
    if (deliveryData.total_price) fd.append("total_price", deliveryData.total_price);
    if (deliveryData.order_category) fd.append("order_category", deliveryData.order_category);
    if (deliveryData.height) fd.append("height", deliveryData.height);
    if (deliveryData.width) fd.append("width", deliveryData.width);
    if (deliveryData.comments) fd.append("comments", deliveryData.comments);
    if (deliveryData.designer_level) fd.append("designer_level", deliveryData.designer_level);
    if (deliveryData.assign_percentage) fd.append("assign_percentage", deliveryData.assign_percentage);
    if (deliveryData.minimum_price) fd.append("minimum_price", deliveryData.minimum_price);
    if (deliveryData.maximum_price) fd.append("maximum_price", deliveryData.maximum_price);
    if (deliveryData.thousand_stitches) fd.append("thousand_stitches", deliveryData.thousand_stitches);
    if (deliveryData.normal_delivery) fd.append("normal_delivery", deliveryData.normal_delivery);
    if (deliveryData.edit_or_change) fd.append("edit_or_change", deliveryData.edit_or_change);
    if (deliveryData.edit_in_stitch_file) fd.append("edit_in_stitch_file", deliveryData.edit_in_stitch_file);
    if (deliveryData.comment_box_1) fd.append("comment_box_1", deliveryData.comment_box_1);
    if (deliveryData.comment_box_2) fd.append("comment_box_2", deliveryData.comment_box_2);
    if (deliveryData.comment_box_3) fd.append("comment_box_3", deliveryData.comment_box_3);
    if (deliveryData.comment_box_4) fd.append("comment_box_4", deliveryData.comment_box_4);

    // Append attachments
    deliveryData.attachments.forEach(file => {
      fd.append("attachments", file);
    });

    await $fetch(`/api/vectors/deliver`, {
      method: "POST",
      body: fd
    });

    await refresh();
    toast.success("Vector delivered successfully");

    showDeliveryModal.value = false;
  } catch (error) {
    console.error("Error completing delivery:", error);
    toast.error("Failed to complete delivery");
  }
}
</script>

<style scoped></style>