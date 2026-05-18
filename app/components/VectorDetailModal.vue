<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div class="fixed inset-0 bg-black/40" @click="close"></div>

      <div class="relative w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-lg">
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h3 class="text-lg font-semibold text-secondary">Vector Details</h3>
          <button class="p-2 rounded hover:bg-slate-100" @click="close">
            <Icon name="X" />
          </button>
        </div>

        <div class="p-6">
          <div v-if="pending" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>

          <UiErrorState v-else-if="error" title="Unable to Load Vector"
            message="We couldn't load the vector details. This might be due to a network issue or the vector might not exist."
            :loading="pending" back-route="/vectors" back-text="Back to Vectors" @retry="refresh" />

          <div v-else-if="vector" class="min-h-[40vh]">
            <!-- Header -->
            <OrderHeader :order_name="vector.vector_name" :po_number="vector.po_number" :status="vector.status"
              :updated_at="vector.updated_at">
              <template #actions>
                <OrderActions size="compact" :isAdmin="isAdmin" :status="vector.status"
                  @approve="updateVectorStatus(OrderStatus.IN_PROGRESS)"
                  @reject="updateVectorStatus(OrderStatus.REJECTED)" @deliver="showDeliveryModal = true"
                  @cancel="updateVectorStatus(OrderStatus.CANCELLED)" @edit="handleEditVector" />
              </template>
            </OrderHeader>

            <div class="p-8 space-y-8 bg-slate-50/50">
              <!-- Section: Vector Information -->
              <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div class="px-6 py-4 bg-primary/5 flex items-center gap-2 border-b border-slate-100">
                  <Icon name="Info" :size="18" class="text-primary" />
                  <h2 class="text-sm font-bold text-primary uppercase tracking-wider">Vector Information</h2>
                </div>
                <div class="p-6">
                  <VectorMetaGrid :vector="vector" />
                </div>
              </div>

              <!-- Section: Attachments -->
              <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div class="px-6 py-4 bg-amber-50 flex items-center gap-2 border-b border-slate-100">
                  <Icon name="Paperclip" :size="18" class="text-amber-600" />
                  <h2 class="text-sm font-bold text-amber-600 uppercase tracking-wider font-sans">Attachments</h2>
                </div>
                <div class="p-6">
                  <AttachmentsGallery noAttachmentsMessage="No vector attachments uploaded."
                    :attachments="vector.vector_attachments || []" />
                </div>
              </div>

              <DeliveryDetails v-if="deliveryData" :deliveryData="deliveryData" />
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Modal inside detail modal -->
      <DeliveryModal v-model="showDeliveryModal" :orderId="vectorId ? String(vectorId) : ''"
        :orderDate="vector?.created_at || ''" @on:deliver="handleDeliveryComplete" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { IVector, VectorDelivery } from "~~/shared/types";
import Icon from "./Icon.vue";
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

const { data, pending, error, execute: fetchVector } = useFetch<{
  message: string;
  data: IVector;
}>(() => (vectorId.value ? `/api/vectors/${vectorId.value}` : ''), {
  immediate: false,
  watch: [vectorId],
});

const { data: deliveryDataResp, execute: fetchDelivery } = useFetch<VectorDelivery>(
  () => (vectorId.value ? `/api/vectors/deliver/${vectorId.value}` : ''),
  {
    immediate: false,
    watch: [vectorId]
  },
);

watch(modelValue, (isOpen) => {
  if (isOpen && vectorId.value) {
    fetchVector();
    fetchDelivery();
  }
});

const refresh = () => {
  fetchVector();
  fetchDelivery();
};

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
