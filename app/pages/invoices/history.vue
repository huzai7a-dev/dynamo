<template>
  <div class="flex flex-col gap-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon name="History" class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 class="text-2xl font-black text-secondary tracking-tight">Invoice History</h3>
        <p class="text-sm text-charcoal/50 font-medium">View all your past invoices and payments.</p>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <!-- Search -->
        <div class="flex-1 min-w-0 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-primary/40 transition">
          <Icon name="Search" class="w-4 h-4 text-gray-400 shrink-0" />
          <input
            v-model="searchQuery"
            placeholder="Search by invoice #"
            class="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none font-sans"
            @input="debouncedSearch"
          />
        </div>

        <!-- Status Filter -->
        <div class="relative" ref="filterDropdownRef">
          <button
            @click="showFilterDropdown = !showFilterDropdown"
            class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-charcoal/70 hover:bg-gray-50 transition-colors"
          >
            <Icon name="Filter" class="w-4 h-4" />
            <span>{{ statusFilterLabel }}</span>
            <Icon name="ChevronDown" class="w-3.5 h-3.5" />
          </button>
          <Transition
            enter-active-class="transition-all duration-150 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div v-if="showFilterDropdown" class="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
              <button
                v-for="opt in filterOptions"
                :key="opt.value"
                @click="applyStatusFilter(opt.value)"
                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                :class="statusFilter === opt.value ? 'text-primary font-bold' : 'text-charcoal/70'"
              >
                {{ opt.label }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Spacer -->
        <div class="flex-1 hidden lg:block"></div>

        <!-- Date Label -->
        <div class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-charcoal/70">
          <Icon name="Calendar" class="w-4 h-4" />
          <span>All Time</span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center py-24">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center p-4">
      <div class="bg-rose-50 text-rose-600 p-8 rounded-3xl border border-rose-100 text-center max-w-md shadow-sm">
        <Icon name="AlertCircle" class="w-12 h-12 mx-auto mb-4" />
        <h3 class="font-bold text-lg mb-2">Error Loading History</h3>
        <p class="text-sm opacity-80 font-medium">We couldn't load your invoice history. Please try refreshing.</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Empty State -->
      <InvoiceEmptyState
        v-if="transactions.length === 0 && !searchQuery && statusFilter === 'all'"
        title="No Invoice History"
        description="You don't have any invoice history yet. Invoices will appear here once created."
        action-label="Create New Invoice"
        action-icon="FilePlus"
        action-route="/invoices"
      />

      <!-- No results for search/filter -->
      <div v-else-if="transactions.length === 0" class="flex flex-col items-center justify-center py-16">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Icon name="Search" class="w-8 h-8 text-gray-300" />
        </div>
        <p class="text-sm font-bold text-secondary mb-1">No results found</p>
        <p class="text-xs text-charcoal/50">Try adjusting your search or filter criteria.</p>
      </div>

      <template v-else>
        <!-- Table -->
        <UiTable
          :data="transactions"
          :columns="historyColumns"
          :disable-row-hover="true"
        >
          <!-- SNO -->
          <template #column-sno="{ index }">
            <span class="text-charcoal/70">
              {{ (pagination.currentPage - 1) * pagination.limit + index + 1 }}
            </span>
          </template>

          <!-- Invoice # -->
          <template #column-transactionRef="{ row }">
            <div class="text-charcoal/70">{{ row.transactionRef?.replace(/^INV-/, '') }}</div>
          </template>

          <!-- Pay Date -->
          <template #column-payDate="{ row }">
            <template v-if="row.status === 'paid' || row.status === 'refunded'">
              <div class="text-charcoal/70">{{ formatDatePrimary(row.paidAt || row.updatedAt) }}</div>
              <div class="text-xs text-charcoal/40 mt-0.5">{{ formatDateSecondary(row.paidAt || row.updatedAt) }}</div>
            </template>
            <template v-else>
              <span class="text-charcoal/40">—</span>
            </template>
          </template>

          <!-- Payment Method -->
          <template #column-paymentMethod="{ row }">
            <div v-if="row.status === 'paid' || row.status === 'refunded'" class="inline-flex items-center gap-2">
              <span
                class="inline-flex items-center justify-center w-8 h-5 rounded text-[9px] font-black uppercase"
                :class="paymentMethodBadgeClass(row.paymentMethod)"
              >
                {{ paymentMethodAbbr(row.paymentMethod) }}
              </span>
              <span class="text-charcoal/70">{{ row.paymentMethod || 'N/A' }}</span>
            </div>
            <span v-else class="text-charcoal/40">—</span>
          </template>

          <!-- Number (2CO order) -->
          <template #column-number="{ row }">
            <span v-if="row.status === 'paid' || row.status === 'refunded'" class="text-charcoal/70">
              {{ row.externalOrderNo ? `#${row.externalOrderNo}` : 'N/A' }}
            </span>
            <span v-else class="text-charcoal/40">—</span>
          </template>

          <!-- Currency -->
          <template #column-currency="{ row }">
            <span class="text-charcoal/70">{{ row.currency || 'USD' }}</span>
          </template>

          <!-- Price -->
          <template #column-price="{ row }">
            <span class="text-charcoal/70">${{ Number(row.amount).toFixed(2) }}</span>
          </template>

          <!-- Status -->
          <template #column-status="{ row }">
            <UiInvoiceStatusBadge :status="row.status" />
          </template>

          <!-- Action -->
          <template #column-action="{ row }">
            <button
              @click="downloadPdf(row)"
              class="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors"
            >
              <Icon name="Download" class="w-3 h-3" />
              Download PDF
            </button>
          </template>
        </UiTable>

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <p class="text-xs text-charcoal/50 font-medium">
            Showing {{ (pagination.currentPage - 1) * pagination.limit + 1 }} to {{ Math.min(pagination.currentPage * pagination.limit, pagination.totalCount) }} of {{ pagination.totalCount }} invoices
          </p>
          <div class="flex items-center gap-1">
            <button
              :disabled="pagination.currentPage <= 1"
              @click="changePage(pagination.currentPage - 1)"
              class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-charcoal/60 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="ChevronLeft" class="w-4 h-4" />
            </button>
            <template v-for="p in visiblePages" :key="p">
              <button
                @click="changePage(p)"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                :class="p === pagination.currentPage ? 'bg-primary text-white' : 'border border-gray-200 text-charcoal/60 hover:bg-gray-50'"
              >
                {{ p }}
              </button>
            </template>
            <button
              :disabled="pagination.currentPage >= pagination.totalPage"
              @click="changePage(pagination.currentPage + 1)"
              class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-charcoal/60 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="ChevronRight" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Hidden PDF print area -->
    <div id="pdf-print-area-history" class="hidden">
      <div v-if="pdfTx" style="font-family: sans-serif; background: #fff; width: 800px; padding: 40px; box-sizing: border-box; margin: 0 auto; color: #1e293b;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 16px">
          <img
            src="/images/full-logo.png"
            alt="Logo"
            style="height: 56px; width: auto; object-fit: contain; margin: 0 auto"
          />
          <p style="margin: 8px 0 0; font-size: 10px; font-weight: 700; color: #669699; letter-spacing: 2px; text-transform: uppercase">
            {{ COMPANY.tagline }}
          </p>
        </div>

        <!-- Invoice # banner -->
        <div style="display: flex; margin-bottom: 16px; border-radius: 6px; overflow: hidden">
          <div style="width: 10px; background: #f1f3f4"></div>
          <div style="flex: 1; background: #0d6c73; padding: 16px 24px">
            <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff">
              Invoice # {{ pdfTx.transactionRef }}
            </h2>
          </div>
        </div>

        <!-- Bill From / Bill To -->
        <div style="background: #f1f3f4; border-radius: 6px; padding: 20px 24px; margin-bottom: 16px">
          <table style="width: 100%">
            <tbody>
              <tr>
                <td style="width: 50%; vertical-align: top; font-size: 13px; color: #374151; line-height: 1.8">
                  <p style="margin: 0 0 4px; font-weight: 800; color: #0d6c73">Bill From:</p>
                  <p style="margin: 0"><strong>Name:</strong> {{ BILL_FROM.name }}</p>
                  <p style="margin: 0"><strong>E-mail:</strong> {{ BILL_FROM.email }}</p>
                  <p style="margin: 0"><strong>Phone no:</strong> {{ BILL_FROM.phone }}</p>
                  <p style="margin: 0"><strong>Address:</strong> {{ BILL_FROM.address }}</p>
                  <p style="margin: 0"><strong>Tax ID:</strong> {{ BILL_FROM.taxId }}</p>
                </td>
                <td style="width: 50%; vertical-align: top; font-size: 13px; color: #374151; line-height: 1.8; padding-left: 24px">
                  <template v-if="pdfUser">
                    <p style="margin: 0 0 4px; font-weight: 800; color: #0d6c73">Bill To:</p>
                    <p style="margin: 0"><strong>Name:</strong> {{ pdfUser.name }}</p>
                    <p style="margin: 0"><strong>E-mail:</strong> {{ pdfUser.email }}</p>
                    <p style="margin: 0"><strong>Company:</strong> {{ pdfUser.company }}</p>
                    <p style="margin: 0"><strong>Date:</strong> {{ formatDateShort(pdfTx.createdAt) }}</p>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Items Table -->
        <div style="background: #f1f3f4; border-radius: 6px; padding: 12px; margin-bottom: 16px">
          <table style="width: 100%; border-collapse: collapse">
            <thead>
              <tr style="background: #0d6c73; color: white">
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">#SR</th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">Design No</th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">Design Name</th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">PO Number</th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">Payment Status</th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">Received Date</th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in pdfItems" :key="idx" :style="{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }">
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">{{ idx + 1 }}</td>
                <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: 600; color: #003438; border-right: 1px solid #e2e8f0">{{ item.type === 'order' ? 'OR' : 'VR' }}-{{ item.id }}</td>
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">{{ item.name }}</td>
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">{{ item.poNumber || '-' }}</td>
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">{{ pdfStatusLabel }}</td>
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">{{ formatDateShort(item.date) }}</td>
                <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: bold; color: #0d6c73">${{ Number(item.price || 0).toFixed(0) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" style="background: #ffffff; padding: 12px; text-align: right; font-weight: 800; font-size: 14px; color: #003438; letter-spacing: 1px">Total</td>
                <td style="background: #ffffff; padding: 12px; text-align: center; font-weight: 800; font-size: 14px; color: #0d6c73">${{ Number(pdfTx.amount).toFixed(0) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Note -->
        <div style="background: #f1f3f4; border-radius: 6px; padding: 20px 24px; margin-bottom: 16px">
          <p style="margin: 0 0 8px; font-size: 13px; font-weight: 800; color: #003438">Note:</p>
          <p style="margin: 0; font-size: 12px; color: #374151; line-height: 1.7">
            If you have an outstanding balance: please pay it as soon as
            possible to avoid service interruptions. Accounts delinquent for
            over 7 days are subject to suspension and/or deletion.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { COMPANY, BILL_FROM } from "~/constants";

definePageMeta({
  name: "Invoice History",
  layout: "portal",
  middleware: ["auth"],
});

const toast = useToast();

// ── Reactive query params ─────────────────────────────────
const searchQuery = ref('');
const statusFilter = ref('all');
const currentPage = ref(1);

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Refunded', value: 'refunded' },
];

const statusFilterLabel = computed(() => {
  const opt = filterOptions.find(o => o.value === statusFilter.value);
  return opt ? `Filter: ${opt.label}` : 'Filter';
});

// ── Data fetching ─────────────────────────────────────────
const { data, pending, error, refresh } = await useFetch<any>('/api/invoices/history', {
  query: computed(() => ({
    search: searchQuery.value || undefined,
    status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
    page: currentPage.value,
    limit: 10,
  })),
  watch: false, // we manually trigger refresh
});

const transactions = computed(() => data.value?.transactions || []);
const pagination = computed(() => data.value?.pagination || { currentPage: 1, totalPage: 1, totalCount: 0, limit: 10 });

const historyColumns = [
  { key: 'sno', label: 'SNO', icon: 'CirclePlus' },
  { key: 'transactionRef', label: 'Invoice #', icon: 'FileText' },
  { key: 'payDate', label: 'Pay Date', icon: 'Calendar' },
  { key: 'paymentMethod', label: 'Payment Method', icon: 'CreditCard' },
  { key: 'number', label: 'Number', icon: 'Hash' },
  { key: 'currency', label: 'Currency', icon: 'DollarSign' },
  { key: 'price', label: 'Price', icon: 'CircleDollarSign' },
  { key: 'status', label: 'Status', icon: 'Tag' },
  { key: 'action', label: 'Action', icon: 'Settings' },
];

// Visible page numbers for pagination
const visiblePages = computed(() => {
  const total = pagination.value.totalPage;
  const current = pagination.value.currentPage;
  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

// ── Search debounce ───────────────────────────────────────
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    refresh();
  }, 400);
};

// ── Filter ────────────────────────────────────────────────
const showFilterDropdown = ref(false);
const filterDropdownRef = ref<HTMLElement | null>(null);

const applyStatusFilter = (value: string) => {
  statusFilter.value = value;
  showFilterDropdown.value = false;
  currentPage.value = 1;
  refresh();
};

// ── Pagination ────────────────────────────────────────────
const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.totalPage) return;
  currentPage.value = page;
  refresh();
};

// ── PDF Download ──────────────────────────────────────────
const pdfTx = ref<any>(null);
const pdfItems = ref<any[]>([]);
const pdfUser = ref<any>(null);

const pdfStatusLabel = computed(() => {
  const status = pdfTx.value?.status;
  if (status === 'paid') return 'Paid';
  if (status === 'refunded') return 'Refunded';
  return 'Receivable';
});

const downloadPdf = async (tx: any) => {
  try {
    const detail = await $fetch<any>(`/api/invoices/${tx.transactionRef}`);
    pdfTx.value = { ...detail, ...tx };
    pdfItems.value = detail?.items || [];
    pdfUser.value = detail?.user || null;

    await nextTick();

    const printArea = document.getElementById('pdf-print-area-history');
    if (!printArea) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${tx.transactionRef}</title>
          <style>
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
            body { font-family: Arial, sans-serif; padding: 40px; }
            @page { margin: 0; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printArea.innerHTML}
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch (err) {
    toast.error('Failed to prepare PDF. Please try again.');
  }
};

// ── Click outside to close dropdowns ──────────────────────
const handleClickOutside = (event: Event) => {
  // Close filter dropdown
  if (filterDropdownRef.value && !filterDropdownRef.value.contains(event.target as Node)) {
    showFilterDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  if (searchTimeout) clearTimeout(searchTimeout);
});

// ── Payment Method Helpers ────────────────────────────────
const paymentMethodAbbr = (method: string | null): string => {
  if (!method) return '—';
  const lower = method.toLowerCase();
  if (lower.includes('visa')) return 'VISA';
  if (lower.includes('master')) return 'MC';
  if (lower.includes('american') || lower.includes('amex')) return 'AMEX';
  if (lower.includes('paypal')) return 'PP';
  if (lower.includes('discover')) return 'DISC';
  return method.substring(0, 4).toUpperCase();
};

const paymentMethodBadgeClass = (method: string | null): string => {
  if (!method) return 'bg-gray-100 text-gray-500';
  const lower = method.toLowerCase();
  if (lower.includes('visa')) return 'bg-blue-100 text-blue-700';
  if (lower.includes('master')) return 'bg-red-50 text-red-600';
  if (lower.includes('american') || lower.includes('amex')) return 'bg-blue-50 text-blue-800';
  if (lower.includes('paypal')) return 'bg-indigo-50 text-indigo-700';
  if (lower.includes('discover')) return 'bg-orange-50 text-orange-700';
  return 'bg-gray-100 text-gray-600';
};

// ── Date Helpers ──────────────────────────────────────────
const formatDatePrimary = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateSecondary = (dateString: string | null) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDateShort = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
</script>
