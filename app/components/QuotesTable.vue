<template>
  <div class="space-y-6">
    <h3 v-if="title" class="text-2xl font-bold text-gray-900">{{ title }}</h3>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <TableHeader
        description="Filter by quote number, quote name, and date range"
        firstPlaceholder="Search by quote number"
        secondPlaceholder="Search by quote name"
        createButtonLabel="Create Quote"
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
      >
        <template #actions>
          <UiSelect
            :placeholder="'Create Quote'"
            :options="dataSourceTypeOptions"
            @update:modelValue="
              (event) => {
                router.push(`/quotes/create?type=${event}`);
              }
            "
          />
        </template>
      </TableHeader>

      <div class="p-6">
        <UiTable
          :data="formateData as any[]"
          :columns="columns"
          :pagination="props.pagination"
          :loading="props.loading"
          :error="props.error"
          :sortBy="props.sortBy"
          :sortOrder="props.sortOrder"
          disableRowHover
          @updateSort="
            (sortBy: string, sortOrder: string) =>
              emit('sort', sortBy, sortOrder)
          "
          @updatePage="emit('paginate', $event)"
        >
          <template #column-serial_number="{ index }">
            <span class="text-primary font-semibold">{{ index + 1 }}</span>
          </template>

          <template #column-id="{ row }">
            {{ `QR-${row.id}` }}
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

          <template #column-q_type="{ row }">
            <span>{{
              row.q_type === DataSource.ORDER ? "Digitizing" : "Vector"
            }}</span>
          </template>

          <template #column-edit="{ row }">
            <button
              class="p-2 rounded hover:bg-slate-100"
              title="Edit this quote"
              @click.stop="handleEditOrder(row.id, row.original_q_type)"
            >
              <Icon name="Pencil" class="w-5 h-5 text-slate-600" />
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

        <!-- Modals -->
        <EntityDetailModal
          v-model="showDetailModal"
          type="quote"
          :entityId="selectedQuoteId"
          @refresh="emit('refresh')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { TableOrders, Pagination } from "#shared/types";
import TableHeader from "./TableHeader.vue";
import { ROLE } from "~~/shared/constants";
import {
  getOrderStatusBadgeClass,
  getPaymentStatusBadgeClass,
  formatOrderStatus,
  formatPaymentStatus,
} from "~/utils/orderUtils";
import { downloadBlob } from "~/utils/download";
import EntityDetailModal from "./EntityDetailModal.vue";

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
  "update:dataSourceType": [value: DataSource];
  "update:searchOrderNumber": [value: string];
  "update:searchOrderName": [value: string];
  "update:searchCustomerName": [value: string];
  "update:selectedDateRange": [value: { from: Date | null; to: Date | null }];
  refresh: [];
}>();

const props = defineProps<Props>();
const { user } = useUserSession();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);
// const dataSourceType = ref(DataSource.ORDER);
const router = useRouter();
const dataSourceTypeOptions = [
  { label: "Digitizing", value: DataSource.ORDER },
  { label: "Vector", value: DataSource.VECTOR },
];

const formateData = computed(() => {
  return (props.data || []).map((item) => ({
    ...item,
    created_at: formateDate(item.created_at),
    price: item.price > 0 ? `$${item.price}` : "-",
    q_type: (item as any).q_type === DataSource.ORDER ? "Digitizing" : "Vector",
    original_q_type: (item as any).q_type,
    ...(isAdmin.value
      ? {
          customer_name: (item as any).customer_name,
        }
      : {}),
  }));
});

const selectedDateRange = ref<{ from: Date | null; to: Date | null }>({
  from: null,
  to: null,
});

const columns = computed(() => [
  { label: "Serial Number", key: "serial_number" },
  { label: "Quote Number", key: "id" },
  { label: "Quote Name", key: "title" },
  { label: "Quote Type", key: "q_type" },
  ...(isAdmin.value ? [{ label: "Customer Name", key: "customer_name" }] : []),
  { label: "Price", key: "price" },
  { label: "Quote Status", key: "status" },
  { label: "Date", key: "created_at" },
  { label: "Edit", key: "edit" },
  { label: "Download Files", key: "download_files" },
  { label: "Details", key: "details" },
]);

const showDetailModal = ref(false);
const selectedQuoteId = ref<string | number>("");

const openDetail = (id: string | number) => {
  selectedQuoteId.value = id;
  showDetailModal.value = true;
};

const handleEditOrder = (id: string | number, qType: any) => {
  router.push(`/quotes/edit/${id}?type=${qType}`);
};

const toast = useToast();

const handleDownloadFiles = async (id: string | number) => {
  try {
    const blob = await $fetch<Blob>(`/api/attachments/quote/${id}/download`, {
      responseType: "blob",
    });
    downloadBlob(blob, `quote-${id}-files.zip`);
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || "Failed to download files");
  }
};
</script>
