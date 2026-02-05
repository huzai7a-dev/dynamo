<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4"
  >
    <div
      class="w-full max-w-4xl rounded-xl bg-white shadow-lg overflow-auto max-h-[90vh]"
    >
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-lg font-semibold">Vector Details</h3>
        <button class="p-2" @click="close">✕</button>
      </div>

      <div class="p-6">
        <div v-if="pending" class="flex items-center justify-center py-12">
          <div
            class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
          ></div>
        </div>

        <div v-else-if="error" class="text-center text-rose-600">
          Failed to load vector details.
          <div class="mt-4">
            <button
              class="px-3 py-2 bg-primary text-white rounded"
              @click="refresh"
            >
              Retry
            </button>
          </div>
        </div>

        <div v-else-if="vector">
          <OrderHeader
            :order_name="vector.vector_name"
            :po_number="vector.po_number"
            :status="vector.status"
          />

          <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div class="lg:col-span-2 space-y-6">
              <div
                class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 class="mb-4 text-lg font-semibold text-secondary">
                  Order Details
                </h2>
                <VectorMetaGrid :vector="vector" />
                <AttachmentsGallery
                  class="mt-6"
                  title="Attachments"
                  noAttachmentsMessage="No vector attachments uploaded."
                  :attachments="vector.vector_attachments || []"
                />
              </div>

              <DeliveryDetails
                v-if="deliveryData"
                :deliveryData="deliveryData"
              />
            </div>

            <aside class="space-y-6">
              <div
                class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 class="mb-3 text-base font-semibold text-secondary">
                  Summary
                </h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-charcoal/70">Status</span>
                    <UiStatusBadge :status="vector.status" />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-charcoal/70">Payment</span>
                    <span
                      class="text-sm font-medium"
                      :class="
                        vector.payment_status === 'paid'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      "
                    >
                      {{
                        vector.payment_status === "paid" ? "Paid" : "Pending"
                      }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-charcoal/70">Estimate</span>
                    <span class="text-sm font-medium text-secondary">{{
                      vector.price === "0.00"
                        ? "To be quoted"
                        : `$${vector.price}`
                    }}</span>
                  </div>
                </div>
              </div>

              <div
                class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 class="mb-4 text-lg font-semibold text-secondary">Notes</h2>
                <InstructionBox :instructions="vector.instructions" />
              </div>

              <div
                class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 class="mb-3 text-base font-semibold text-secondary">
                  Actions
                </h3>
                <OrderActions
                  :isAdmin="isAdmin"
                  :status="vector.status"
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

      <div class="flex items-center justify-end gap-2 p-4 border-t">
        <button class="px-4 py-2 rounded bg-gray-100" @click="close">
          Close
        </button>
      </div>
    </div>

    <!-- Delivery modal used inside detail modal -->
    <DeliveryModal
      v-model="showDeliveryModal"
      :orderId="String(vectorId)"
      :orderDate="vector?.created_at"
      @on:deliver="handleDeliveryComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { IVector, VectorDelivery } from "~~/shared/types";
import OrderHeader from "./OrderHeader.vue";
import VectorMetaGrid from "./VectorMetaGrid.vue";
import AttachmentsGallery from "./AttachmentsGallery.vue";
import DeliveryDetails from "./DeliveryDetails.vue";
import InstructionBox from "./InstructionBox.vue";
import OrderActions from "./OrderActions.vue";
import DeliveryModal from "./DeliveryModal.vue";
import { OrderStatus } from "~~/shared/types/enums";
import { ROLE } from "~~/shared/constants";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    vectorId?: string;
  }>(),
  {
    modelValue: false,
    vectorId: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "refresh"): void;
}>();

const modelValue = computed(() => props.modelValue);
const vectorId = computed(() => props.vectorId);

const { data, pending, error, refresh } = useFetch<{
  message: string;
  data: IVector;
}>(() => (vectorId.value ? `/api/vectors/${vectorId.value}` : null), {
  watch: [vectorId],
});

const { data: deliveryDataResp } = useFetch<VectorDelivery>(
  () => (vectorId.value ? `/api/vectors/deliver/${vectorId.value}` : null),
  { watch: [vectorId] },
);

const vector = computed(() => data.value?.data);
const deliveryData = computed(() => deliveryDataResp.value);

const { user } = useUserSession();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

const showDeliveryModal = ref(false);
const toast = useToast();

const close = () => emit("update:modelValue", false);

const updateVectorStatus = async (status: OrderStatus) => {
  try {
    await $fetch(`/api/vectors/status`, {
      method: "POST",
      body: { vectorId: vectorId.value, status },
    });
    toast.success("Vector status updated successfully");
    refresh();
    emit("refresh");
  } catch (e) {
    console.error(e);
    toast.error("Failed to update vector status");
  }
};

const handleEditVector = () => {
  navigateTo(`/vectors/edit/${vectorId.value}`);
};

const handleDeliveryComplete = async (deliveryDataForm: any) => {
  try {
    const fd = new FormData();
    fd.append("vectorId", String(vectorId.value));
    fd.append("stitches", deliveryDataForm.stitches);
    fd.append("price", deliveryDataForm.price);
    // optional fields
    if (deliveryDataForm.discount)
      fd.append("discount", deliveryDataForm.discount);
    if (deliveryDataForm.total_price)
      fd.append("total_price", deliveryDataForm.total_price);
    // append attachments if any
    (deliveryDataForm.attachments || []).forEach((f: File) =>
      fd.append("attachments", f),
    );
    await $fetch(`/api/vectors/deliver`, { method: "POST", body: fd });
    toast.success("Vector delivered successfully");
    refresh();
    emit("refresh");
    showDeliveryModal.value = false;
  } catch (e) {
    console.error(e);
    toast.error("Failed to complete delivery");
  }
};
</script>
