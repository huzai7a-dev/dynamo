<template>
  <div class="space-y-6">
    <h3 v-if="title" class="text-2xl font-bold text-gray-900">{{ title }}</h3>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <TableHeader description="Filter by quote number, quote name, and date range"
        firstPlaceholder="Search by quote number" secondPlaceholder="Search by quote name"
        createButtonLabel="Create Quote" :searchOrderNumber="searchOrderNumber" :searchOrderName="searchOrderName"
        :selectedDateRange="selectedDateRange" :isAdmin="isAdmin" :searchCustomerName="searchCustomerName"
        @create-order="emit('create-order')"
        @update:searchOrderNumber="(val: string) => emit('update:searchOrderNumber', val)"
        @update:searchOrderName="(val: string) => emit('update:searchOrderName', val)"
        @update:searchCustomerName="(val: string) => emit('update:searchCustomerName', val)"
        @update:selectedDateRange="(val) => emit('update:selectedDateRange', val)">

        <template #actions>
          <UiSelect :placeholder="'Create Quote'" :options="dataSourceTypeOptions"
            @update:modelValue="(event) => { router.push(`/quotes/create?type=${event}`) }" />
        </template>
      </TableHeader>


      <div class="p-6">
        <UiTable :data="formateData as any[]" :columns="columns" :pagination="props.pagination" :loading="props.loading"
          :error="props.error" :sortBy="props.sortBy" :sortOrder="props.sortOrder"
          @updateSort="(sortBy: string, sortOrder: string) => emit('sort', sortBy, sortOrder)"
          @updatePage="emit('paginate', $event)" @rowClick="emit('rowClick', $event)">
          <template #column-serial_number="{ index }">
            <span class="text-primary font-semibold">{{ index + 1 }}</span>
          </template>

          <template #column-id="{ row }">
            {{ `QR-${row.id}` }}
          </template>

          <template #column-status="{ row }">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="getOrderStatusBadgeClass((row as TableOrders).status)">
              {{ formatOrderStatus((row as TableOrders).status) }}
            </span>
          </template>

          <template #column-payment_status="{ row }">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="getPaymentStatusBadgeClass((row as TableOrders).payment_status)">
              {{ formatPaymentStatus((row as TableOrders).payment_status) }}
            </span>
          </template>

          <template #column-q_type="{ row }">
            <span>{{ row.q_type === DataSource.ORDER ? "Digitizing" : "Vector" }}</span>
          </template>

          <template #column-actions="{ row }">
            <div class="flex items-center gap-2" @click.stop>
              <button class="p-2 rounded hover:bg-slate-100" @click.stop="openDetail(row.id)" title="View">
                <Icon name="Eye" class="w-5 h-5 text-slate-600" />
              </button>

              <QuoteActions size="compact" :isAdmin="isAdmin" :status="(row as any).status"
                @accept="handleMoveToOrder(row.id, row.original_q_type)" @reject="handleRejectClick(row.id)"
                @proceed="updateQuoteStatus(row.id, QuoteStatus.PROCEED, row.original_q_type)"
                @edit="handleEditOrder(row.id, row.original_q_type)" @deliver="handleDeliverClick(row.id)" />
            </div>
          </template>

        </UiTable>

        <!-- Modals -->
        <QuoteDetailModal v-model="showDetailModal" :quoteId="selectedQuoteId" @refresh="emit('refresh')" />
        <QuoteRejectModal v-model="showRejectModal" :loading="rejecting" @confirm="handleRejectConfirm" />
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
  formatPaymentStatus
} from "~/utils/orderUtils";
import { QuoteStatus } from "~~/shared/types/enums";
import QuoteActions from "./QuoteActions.vue";
import QuoteRejectModal from "./QuoteRejectModal.vue";
import QuoteDetailModal from "./QuoteDetailModal.vue";

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
  'create-order': [];
  'paginate': [page: number];
  'sort': [sortBy: string, sortOrder: string];
  'rowClick': [{ row: TableOrders, index: number }];
  'update:dataSourceType': [value: DataSource];
  'update:searchOrderNumber': [value: string];
  'update:searchOrderName': [value: string];
  'update:searchCustomerName': [value: string];
  'update:selectedDateRange': [value: { from: Date | null; to: Date | null }];
  'refresh': [];
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
    ...(isAdmin.value ? {
      customer_name: (item as any).customer_name,
    } : {}),
  }));
});

const selectedDateRange = ref<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const columns = computed(() => [
  { label: "Serial Number", key: "serial_number" },
  { label: "Quote Number", key: "id" },
  { label: "Quote Name", key: "title" },
  { label: "Quote Type", key: "q_type" },
  ...(isAdmin.value ? [{ label: "Customer Name", key: "customer_name" }] : []),
  { label: "Price", key: "price" },
  { label: "Quote Status", key: "status" },
  { label: "Date", key: "created_at" },
  { label: "Actions", key: "actions" },
]);

const toast = useToast();
const showDetailModal = ref(false);
const selectedQuoteId = ref<string | number>("");
const showRejectModal = ref(false);
const rejecting = ref(false);
const activelyRejectingId = ref<string | number>("");

const openDetail = (id: string | number) => {
  selectedQuoteId.value = id;
  showDetailModal.value = true;
};

// --- In-Table Quote Actions ---

const updateQuoteStatus = async (id: string | number, status: QuoteStatus, dataSourceType: any) => {
  try {
    await $fetch(`/api/quotes/status`, {
      method: "POST",
      body: { quoteId: id, status, dataSourceType }
    });
    toast.success("Quote status updated successfully");
    emit("refresh");
  } catch (error) {
    console.error("Error updating quote status:", error);
    toast.error("Failed to update quote status");
  }
};

const handleEditOrder = (id: string | number, qType: any) => {
  router.push(`/quotes/edit/${id}?type=${qType}`);
};

const handleMoveToOrder = async (id: string | number, dataSourceType: any) => {
  try {
    await $fetch(`/api/quotes/move-to-order`, {
      method: "POST",
      body: { quoteId: id, dataSourceType }
    });
    toast.success("Quote moved to order successfully");
    emit("refresh");
  } catch (error) {
    console.error("Error moving quote to order:", error);
    toast.error("Failed to move quote to order");
  }
};

const handleRejectClick = (id: string | number) => {
  activelyRejectingId.value = id;
  showRejectModal.value = true;
};

const handleRejectConfirm = async (reason: string) => {
  try {
    rejecting.value = true;
    await $fetch('/api/quotes/reject', {
      method: "POST",
      body: { quoteId: activelyRejectingId.value, reason }
    });
    toast.success("Quote rejected successfully");
    showRejectModal.value = false;
    emit("refresh");
  } catch (error: any) {
    console.error("Error rejecting quote:", error);
    toast.error(error.message || "Failed to reject quote");
  } finally {
    rejecting.value = false;
  }
};

const handleDeliverClick = (id: string | number) => {
  // Let this fall back to Modal logic, or implement delivery from table directly like vector
  openDetail(id); // Opens detail modal which contains its own delivery options
};



</script>