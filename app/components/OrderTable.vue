<template>
  <div class="space-y-6">
    <h3 v-if="title" class="text-2xl font-bold text-gray-900">{{ title }}</h3>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <TableHeader
        description="Filter by order number, order name, and date range"
        firstPlaceholder="Search by order number"
        secondPlaceholder="Search by order name"
        createButtonLabel="Place order"
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
          :data="formateData || []"
          :columns="columns"
          :pagination="props.pagination"
          :loading="props.loading"
          :error="props.error"
          :sortBy="props.sortBy"
          :sortOrder="props.sortOrder"
          disableRowHover
          @updatePage="emit('paginate', $event)"
        >
          <template #column-serial_number="{ index }">
            <span class="text-primary font-semibold">{{ index + 1 }}</span>
          </template>

          <template #column-id="{ row }">
            {{ `OR-${row.id}` }}
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
              v-if="isOrderProcessingOrPending((row as TableOrders).status)"
              class="text-gray-400"
            >
              -
            </span>
            <span
              v-else
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="
                getPaymentStatusBadgeClass(
                  (row as TableOrders).payment_status,
                  row.price,
                )
              "
            >
              {{
                formatPaymentStatus(
                  (row as TableOrders).payment_status,
                  row.price,
                )
              }}
            </span>
          </template>

          <template #column-order_name="{ row }">
            {{
              row?.is_from_quote
                ? `${row.order_name} (QR-${row?.from_quote_id})`
                : row.order_name
            }}
          </template>

          <template #column-convert_from_quote="{ row }">
            <span class="text-primary font-semibold">{{
              row.convert_from_quote
            }}</span>
          </template>

          <template #column-edit="{ row }">
            <button
              class="p-2 rounded transition-colors disabled:cursor-not-allowed enabled:hover:bg-slate-100"
              :disabled="(row as TableOrders).status === OrderStatus.DELIVERED"
              :title="
                (row as TableOrders).status === OrderStatus.DELIVERED
                  ? 'Delivered orders cannot be edited'
                  : 'Edit this order'
              "
              @click.stop="handleEdit(row.id)"
            >
              <Icon
                name="Pencil"
                class="w-5 h-5"
                :class="
                  (row as TableOrders).status === OrderStatus.DELIVERED
                    ? 'text-slate-300'
                    : 'text-slate-600'
                "
              />
            </button>
          </template>

          <template #column-download_files="{ row }">
            <button
              class="p-2 rounded"
              title="Download Files"
              @click.stop="handleDownloadFiles(row.id)"
            >
              <Icon name="Download" class="w-5 h-5 text-slate-600" />
            </button>
          </template>

          <template #column-details="{ row }">
            <button
              class="p-2 rounded"
              title="View Details"
              @click.stop="openDetail(row.id)"
            >
              <Icon name="Eye" class="w-5 h-5 text-slate-600" />
            </button>
          </template>
        </UiTable>

        <!-- Order detail modal -->
        <EntityDetailModal
          v-model="showDetailModal"
          type="order"
          :entityId="selectedOrderId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import type { TableOrders, Pagination } from "#shared/types";
import TableHeader from "./TableHeader.vue";
import Icon from "./Icon.vue";
import EntityDetailModal from "./EntityDetailModal.vue";
import { ROLE } from "~~/shared/constants";
import { OrderStatus } from "~~/shared/types/enums";
import {
  getOrderStatusBadgeClass,
  getPaymentStatusBadgeClass,
  formatOrderStatus,
  formatPaymentStatus,
  isOrderProcessingOrPending,
} from "~/utils/orderUtils";
import { downloadBlob } from "~/utils/download";

interface Props {
  title?: string;
  data?: TableOrders[];
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
  rowClick: [{ row: TableOrders; index: number }];
  "update:searchOrderNumber": [value: string];
  "update:searchOrderName": [value: string];
  "update:searchCustomerName": [value: string];
  "update:selectedDateRange": [value: { from: Date | null; to: Date | null }];
  refresh: [];
}>();

const props = defineProps<Props>();
const { user } = useUserSession();
const router = useRouter();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

const formateData = computed(() => {
  return props.data?.map((item) => ({
    ...item,
    created_at: formateDate(item.created_at),
    price: isOrderProcessingOrPending(item.status)
      ? "-"
      : item.price > 0
        ? `$${item.price}`
        : "Free",
    ...(isAdmin.value
      ? {
          customer_name: (item as any).customer_name,
          is_from_quote: (item as any).is_from_quote ? "Yes" : "No",
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
  { label: "Order Number", key: "id" },
  { label: "Order Name", key: "order_name" },
  ...(isAdmin.value
    ? [
        { label: "Customer Name", key: "customer_name" },
        { label: "Converted From Quote", key: "is_from_quote" },
      ]
    : []),
  { label: "Price", key: "price" },
  { label: "Order Status", key: "status" },
  { label: "Payment Status", key: "payment_status" },
  { label: "Date", key: "created_at" },
  { label: "Edit", key: "edit" },
  { label: "Download Files", key: "download_files" },
  { label: "Details", key: "details" },
]);

const showDetailModal = ref(false);
const selectedOrderId = ref<string | number>("");

const openDetail = (id: string | number) => {
  selectedOrderId.value = id;
  showDetailModal.value = true;
};

const handleEdit = (id: string | number) => {
  navigateTo(`/orders/edits/${encodeURIComponent(String(id))}`);
};

const toast = useToast();

const handleDownloadFiles = async (id: string | number) => {
  try {
    const blob = await $fetch<Blob>(`/api/attachments/order/${id}/download`, {
      responseType: "blob",
    });
    downloadBlob(blob, `order-${id}-files.zip`);
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || "Failed to download files");
  }
};
</script>
