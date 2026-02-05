<template>
  <div class="space-y-6">
    <h3 v-if="title" class="text-2xl font-bold text-gray-900">{{ title }}</h3>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <TableHeader
        createButtonLabel="Place Vector"
        title="Vector"
        :searchOrderNumber="searchOrderNumber"
        :searchOrderName="searchOrderName"
        :selectedDateRange="selectedDateRange"
        :isAdmin="isAdmin"
        :searchCustomerName="searchCustomerName"
        @create-order="emit('create-order')"
        @update:searchOrderNumber="
          (val: string) => emit('update:searchOrderNumber', val)
        "
        @update:searchOrderName="
          (val: string) => emit('update:searchOrderName', val)
        "
        @update:searchCustomerName="
          (val: string) => emit('update:searchCustomerName', val)
        "
        @update:selectedDateRange="
          (val) => emit('update:selectedDateRange', val)
        "
      />

      <div class="p-6">
        <UiTable
          :data="formateData"
          :columns="columns"
          :pagination="props.pagination"
          :loading="props.loading"
          :error="props.error"
          :sortBy="props.sortBy"
          :sortOrder="props.sortOrder"
          @updateSort="
            (sortBy: string, sortOrder: string) =>
              emit('sort', sortBy, sortOrder)
          "
          @updatePage="emit('paginate', $event)"
          @rowClick="emit('rowClick', $event)"
        >
          <template #column-serial_number="{ index }">
            <span class="text-primary font-semibold">{{ index + 1 }}</span>
          </template>

          <template #column-status="{ row }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="getOrderStatusBadgeClass((row as TableOrders).status)"
            >
              {{ formatOrderStatus((row as TableOrders).status) }}
            </span>
          </template>

          <template #column-payment_status="{ row }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="
                getPaymentStatusBadgeClass((row as TableOrders).payment_status)
              "
            >
              {{ formatPaymentStatus((row as TableOrders).payment_status) }}
            </span>
          </template>

          <!-- Actions column: Eye (open modal) + reuse OrderActions -->
          <template #column-actions="{ row }">
            <div class="flex items-center gap-2" @click.stop>
              <button
                class="p-2 rounded hover:bg-slate-100"
                @click.stop="openDetail(row.id)"
                title="View"
              >
                <Icon name="Eye" class="w-5 h-5 text-slate-600" />
              </button>

              <OrderActions
                size="compact"
                :isAdmin="isAdmin"
                :status="(row as any).status"
                @approve="handleApprove(row.id)"
                @reject="handleReject(row.id)"
                @deliver="handleDeliver(row.id, row.created_at)"
                @cancel="handleCancel(row.id)"
                @edit="handleEdit(row.id)"
              />
            </div>
          </template>
        </UiTable>

        <!-- Vector detail modal -->
        <VectorDetailModal
          v-model="showDetailModal"
          :vectorId="String(selectedVectorId)"
          @refresh="emit('refresh')"
        />

        <!-- Delivery modal for quick deliver from table actions -->
        <DeliveryModal
          v-model="showDeliveryModal"
          :orderId="String(selectedVectorId)"
          :orderDate="selectedVectorDate || ''"
          @on:deliver="
            () => {
              showDeliveryModal = false;
              emit('refresh');
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import type {
  TableOrders,
  Pagination,
  IVector,
  TableVector,
} from "#shared/types";
import TableHeader from "./TableHeader.vue";
import { ROLE } from "~~/shared/constants";
import {
  getOrderStatusBadgeClass,
  getPaymentStatusBadgeClass,
  formatOrderStatus,
  formatPaymentStatus,
} from "~/utils/orderUtils";
import Icon from "./Icon.vue";
import OrderActions from "./OrderActions.vue";
import VectorDetailModal from "./VectorDetailModal.vue";
import DeliveryModal from "./DeliveryModal.vue";
import { OrderStatus } from "~~/shared/types/enums";
import { useRouter } from "vue-router";

interface Props {
  title?: string;
  data?: IVector[];
  pagination?: Pagination;
  loading: boolean;
  error: boolean;
  sortBy?: string;
  sortOrder?: string;
  searchOrderNumber?: string;
  searchOrderName?: string;
  searchCustomerName?: string;
}

const emit = defineEmits<{
  "create-order": [];
  paginate: [page: number];
  sort: [sortBy: string, sortOrder: string];
  rowClick: [{ row: TableVector; index: number }];
  "update:searchOrderNumber": [value: string];
  "update:searchOrderName": [value: string];
  "update:searchCustomerName": [value: string];
  "update:selectedDateRange": [value: { from: Date | null; to: Date | null }];
  refresh: [];
}>();

const props = defineProps<Props>();
const { user } = useUserSession();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

const formateData = computed(() => {
  return props.data?.map((item) => ({
    ...item,
    created_at: formateDate(item.created_at),
    price: Number(item.price) > 0 ? `$${item.price}` : "N/A",
    ...(isAdmin.value
      ? {
          customer_name: item?.customer_name,
          is_from_quote: item?.is_from_quote ? "Yes" : "No",
        }
      : {}),
  }));
});

const selectedDateRange = ref<{ from: Date | null; to: Date | null }>({
  from: null,
  to: null,
});

const columns = ref([
  { label: "Serial Number", key: "serial_number" },
  { label: "Vector Number", key: "id" },
  { label: "Vector Name", key: "vector_name" },
  ...(isAdmin.value
    ? [
        { label: "Customer Name", key: "customer_name" },
        { label: "Converted From Quote", key: "is_from_quote" },
      ]
    : []),
  { label: "Price", key: "price" },
  { label: "Vector Status", key: "status" },
  { label: "Payment Status", key: "payment_status" },
  { label: "Date", key: "created_at" },
  { label: "Actions", key: "actions" },
]);

// Modal & action state
const showDetailModal = ref(false);
const selectedVectorId = ref<string | number>("");
const openDetail = (id: string | number) => {
  selectedVectorId.value = id;
  showDetailModal.value = true;
};

const toast = useToast();
const router = useRouter();

const showDeliveryModal = ref(false);
const selectedVectorDate = ref<string | undefined>(undefined);

const updateVectorStatus = async (id: string | number, status: OrderStatus) => {
  try {
    await $fetch(`/api/vectors/status`, {
      method: "POST",
      body: { vectorId: String(id), status },
    });
    toast.success("Vector status updated successfully");
    emit("refresh");
  } catch (e) {
    console.error(e);
    toast.error("Failed to update vector status");
  }
};

const handleApprove = (id: string | number) =>
  updateVectorStatus(id, OrderStatus.IN_PROGRESS);
const handleReject = (id: string | number) =>
  updateVectorStatus(id, OrderStatus.REJECTED);
const handleCancel = (id: string | number) =>
  updateVectorStatus(id, OrderStatus.CANCELLED);

const handleDeliver = (id: string | number, date?: string) => {
  selectedVectorId.value = id;
  selectedVectorDate.value = date;
  showDeliveryModal.value = true;
};

const handleEdit = (id: string | number) => {
  navigateTo(`/vectors/edit/${encodeURIComponent(String(id))}`);
};
</script>
