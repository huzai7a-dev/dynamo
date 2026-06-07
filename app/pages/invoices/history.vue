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
        <div class="overflow-x-auto rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table class="min-w-full table-auto border-collapse text-sm font-sans">
            <thead class="bg-white border-b border-slate-200">
              <tr>
                <th class="px-4 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">#</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">Invoice #</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">Pay Date</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">Payment Method</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">Number</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">Currency</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">Price</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">Status</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(tx, index) in transactions"
                :key="tx.transactionRef"
                class="bg-white border-b border-slate-100 last:border-b-0 hover:bg-primary/[0.02] transition-colors duration-150"
              >
                <!-- # -->
                <td class="px-4 py-4 text-center text-sm text-charcoal/50">
                  {{ (pagination.currentPage - 1) * pagination.limit + index + 1 }}
                </td>
                <!-- Invoice # + Copy -->
                <td class="px-4 py-4">
                  <div class="text-sm font-black text-secondary tracking-tight">{{ tx.transactionRef }}</div>
                  <button
                    @click.stop="copyToClipboard(tx.transactionRef)"
                    class="inline-flex items-center gap-1 text-xs text-primary hover:text-teal-700 font-medium mt-1 transition-colors"
                  >
                    <Icon name="Copy" class="w-3 h-3" />
                    {{ copiedRef === tx.transactionRef ? 'Copied!' : 'Copy' }}
                  </button>
                </td>
                 <!-- Pay Date -->
                <td class="px-4 py-4 text-center">
                  <template v-if="tx.status === 'paid' || tx.status === 'refunded'">
                    <div class="text-sm text-charcoal/70">{{ formatDatePrimary(tx.paidAt || tx.updatedAt) }}</div>
                    <div class="text-xs text-charcoal/40 mt-0.5">{{ formatDateSecondary(tx.paidAt || tx.updatedAt) }}</div>
                  </template>
                  <template v-else>
                    <span class="text-charcoal/40">—</span>
                  </template>
                </td>
                <!-- Payment Method -->
                <td class="px-4 py-4 text-center">
                  <div v-if="tx.status === 'paid' || tx.status === 'refunded'" class="inline-flex items-center gap-2">
                    <span
                      class="inline-flex items-center justify-center w-8 h-5 rounded text-[9px] font-black uppercase"
                      :class="paymentMethodBadgeClass(tx.paymentMethod)"
                    >
                      {{ paymentMethodAbbr(tx.paymentMethod) }}
                    </span>
                    <span class="text-sm text-charcoal/70">{{ tx.paymentMethod || 'N/A' }}</span>
                  </div>
                  <span v-else class="text-charcoal/40">—</span>
                </td>
                <!-- Number (2CO order) -->
                <td class="px-4 py-4 text-center text-sm text-charcoal/70">
                  <span v-if="tx.status === 'paid' || tx.status === 'refunded'">
                    {{ tx.externalOrderNo ? `#${tx.externalOrderNo}` : 'N/A' }}
                  </span>
                  <span v-else class="text-charcoal/40">—</span>
                </td>
                <!-- Currency -->
                <td class="px-4 py-4 text-center text-sm text-charcoal/70">{{ tx.currency || 'USD' }}</td>
                <!-- Price -->
                <td class="px-4 py-4 text-center text-sm font-black text-primary">
                  ${{ Number(tx.amount).toFixed(2) }}
                </td>
                <!-- Status -->
                <td class="px-4 py-4 text-center">
                  <UiInvoiceStatusBadge :status="tx.status" />
                </td>
                <!-- Actions Menu -->
                <td class="px-4 py-4 text-center relative">
                  <div class="relative" ref="actionMenuRefs">
                    <button
                      @click.stop="toggleActionMenu(tx.transactionRef)"
                      class="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Icon name="MoreVertical" class="w-4 h-4 text-charcoal/50" />
                    </button>
                    <Transition
                      enter-active-class="transition-all duration-150 ease-out"
                      enter-from-class="opacity-0 scale-95"
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition-all duration-100 ease-in"
                      leave-from-class="opacity-100 scale-100"
                      leave-to-class="opacity-0 scale-95"
                    >
                      <div v-if="openActionMenu === tx.transactionRef" class="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                        <button
                          @click="viewDetails(tx)"
                          class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-charcoal/70"
                        >
                          <Icon name="Eye" class="w-3.5 h-3.5" />
                          View Details
                        </button>
                        <button
                          @click="downloadPdf(tx)"
                          class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-charcoal/70"
                        >
                          <Icon name="Download" class="w-3.5 h-3.5" />
                          Download PDF
                        </button>
                      </div>
                    </Transition>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
      <div v-if="pdfTx" style="font-family: 'Inter', sans-serif; background: #fff; width: 800px; padding: 40px; box-sizing: border-box; margin: 0 auto; color: #1e293b;">
        <table style="width: 100%; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px;">
          <tr>
            <td style="width: 50%; vertical-align: middle;">
              <h1 style="margin: 0; font-size: 24px; color: #003438; text-transform: uppercase; letter-spacing: 1px;">INVOICE</h1>
            </td>
            <td style="width: 50%; text-align: right; vertical-align: middle;">
              <table style="width: auto; margin-left: auto; font-size: 14px; color: #334155;">
                <tr>
                  <td style="padding-right: 15px; font-weight: bold; padding-bottom: 5px;">Invoice #</td>
                  <td style="font-weight: 800; color: #0f172a; padding-bottom: 5px;">{{ pdfTx.transactionRef }}</td>
                </tr>
                <tr>
                  <td style="padding-right: 15px; font-weight: bold;">Status</td>
                  <td style="font-weight: 800;" :style="{ color: pdfTx.status === 'paid' ? '#16a34a' : '#eab308' }">{{ pdfTx.status?.toUpperCase() }}</td>
                </tr>
                <tr>
                  <td style="padding-right: 15px; font-weight: bold;">Amount</td>
                  <td style="font-weight: 800; color: #0f172a;">${{ Number(pdfTx.amount).toFixed(2) }}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #003438; color: white;">
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">#SR</th>
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Design No</th>
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Design Name</th>
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in pdfItems" :key="idx" :style="{ background: idx % 2 === 0 ? '#f8fafc' : '#ffffff', borderBottom: '1px solid #e2e8f0' }">
              <td style="padding: 12px; text-align: center; font-size: 13px; color: #475569;">{{ idx + 1 }}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: 600; color: #0f172a;">{{ item.type === 'order' ? 'OR' : 'VR' }}-{{ item.id }}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px; color: #475569;">{{ item.name }}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: bold; color: #0f172a;">${{ Number(item.price || 0).toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="background: #e2e8f0; padding: 12px; text-align: right; font-weight: 800; font-size: 14px; color: #003438; letter-spacing: 1px;">TOTAL</td>
              <td style="background: #003438; padding: 12px; text-align: center; font-weight: 800; font-size: 14px; color: white;">${{ Number(pdfTx.amount).toFixed(2) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';

definePageMeta({
  layout: "portal",
  middleware: ["auth"],
});

const toast = useToast();
const router = useRouter();

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

// ── Action Menu ───────────────────────────────────────────
const openActionMenu = ref<string | null>(null);

const toggleActionMenu = (ref: string) => {
  openActionMenu.value = openActionMenu.value === ref ? null : ref;
};

const viewDetails = (tx: any) => {
  openActionMenu.value = null;
  router.push(`/invoices/${tx.transactionRef}`);
};

// ── Copy to Clipboard ─────────────────────────────────────
const copiedRef = ref<string | null>(null);

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedRef.value = text;
    toast.success('Copied to clipboard!');
    setTimeout(() => { copiedRef.value = null; }, 2000);
  } catch {
    toast.error('Failed to copy');
  }
};

// ── PDF Download ──────────────────────────────────────────
const pdfTx = ref<any>(null);
const pdfItems = ref<any[]>([]);

const downloadPdf = async (tx: any) => {
  openActionMenu.value = null;
  try {
    const detail = await $fetch<any>(`/api/invoices/${tx.transactionRef}`);
    pdfTx.value = { ...detail, ...tx };
    pdfItems.value = detail?.items || [];

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
            body { font-family: Arial, sans-serif; padding: 40px; }
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
  // Close action menus
  openActionMenu.value = null;
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
</script>
