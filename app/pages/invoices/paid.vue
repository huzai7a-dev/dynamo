<template>
  <div class="flex flex-col gap-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <div
        class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
      >
        <Icon name="FileText" class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 class="text-2xl font-black text-secondary tracking-tight">
          Paid Invoices
        </h3>
        <p class="text-sm text-charcoal/50 font-medium">
          View and manage your paid invoices.
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center py-24">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center p-4">
      <div
        class="bg-rose-50 text-rose-600 p-8 rounded-3xl border border-rose-100 text-center max-w-md shadow-sm"
      >
        <Icon name="AlertCircle" class="w-12 h-12 mx-auto mb-4" />
        <h3 class="font-bold text-lg mb-2">Error Loading Invoices</h3>
        <p class="text-sm opacity-80 font-medium">
          We couldn't load your paid invoices. Please try refreshing.
        </p>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Empty State -->
      <InvoiceEmptyState
        v-if="transactions.length === 0"
        title="No Paid Invoices"
        description="You don't have any paid invoices yet. Once you pay an invoice, it will appear here."
        action-label="View Unpaid Invoices"
        action-icon="FileText"
        action-route="/invoices/unpaid"
      />

      <template v-else>
        <!-- Summary Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total Paid Invoices -->
          <div
            class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="FileText" class="w-4 h-4 text-primary" />
              </div>
              <p
                class="text-xs font-medium text-charcoal/50 uppercase tracking-wide"
              >
                Total Paid Invoices
              </p>
            </div>
            <p class="text-3xl font-black text-secondary">
              {{ stats.totalPaidInvoices }}
            </p>
            <p class="text-xs text-charcoal/40 mt-1">All time</p>
          </div>

          <!-- Total Amount Paid -->
          <div
            class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="CircleDollarSign" class="w-4 h-4 text-primary" />
              </div>
              <p
                class="text-xs font-medium text-charcoal/50 uppercase tracking-wide"
              >
                Total Amount Paid
              </p>
            </div>
            <p class="text-3xl font-black text-primary">
              ${{ stats.totalAmountPaid }}
            </p>
            <p class="text-xs text-charcoal/40 mt-1">All time</p>
          </div>

          <!-- Latest Paid Invoice -->
          <div
            class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="Calendar" class="w-4 h-4 text-primary" />
              </div>
              <p
                class="text-xs font-medium text-charcoal/50 uppercase tracking-wide"
              >
                Latest Paid Invoice
              </p>
            </div>
            <p class="text-2xl font-black text-secondary">
              {{ formatDatePrimary(stats.latestPaidAt) }}
            </p>
            <p class="text-xs text-charcoal/40 mt-1">
              {{ formatDateSecondary(stats.latestPaidAt) }}
            </p>
          </div>

          <!-- Payment Success Rate -->
          <div
            class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="CheckCircle" class="w-4 h-4 text-primary" />
              </div>
              <p
                class="text-xs font-medium text-charcoal/50 uppercase tracking-wide"
              >
                Payment Success Rate
              </p>
            </div>
            <p class="text-3xl font-black text-primary">
              {{ stats.successRate }}%
            </p>
            <p class="text-xs text-charcoal/40 mt-1">All invoices are paid</p>
          </div>
        </div>

        <!-- Table -->
        <UiTable
          :data="transactions"
          :columns="paidInvoiceColumns"
          :disable-row-hover="true"
        >
          <!-- SNO -->
          <template #column-sno="{ index }">
            <span class="text-charcoal/70">
              {{ index + 1 }}
            </span>
          </template>

          <!-- Invoice Number -->
          <template #column-transactionRef="{ row }">
            <div class="text-charcoal/70">
              {{ row.transactionRef?.replace(/^INV-/, "") }}
            </div>
          </template>

          <!-- Price -->
          <template #column-amount="{ row }">
            <span class="text-charcoal/70"
              >${{ Number(row.amount).toFixed(2) }}</span
            >
          </template>

          <!-- Date (created) -->
          <template #column-date="{ row }">
            <div class="text-charcoal/70">
              {{ formatDatePrimary(row.createdAt) }}
            </div>
            <div class="text-xs text-charcoal/40 mt-0.5">
              {{ formatDateSecondary(row.createdAt) }}
            </div>
          </template>

          <!-- Paid On -->
          <!-- <template #column-paidOn="{ row }">
            <div class="text-charcoal/70">
              {{ formatDatePrimary(row.paidAt || row.updatedAt) }}
            </div>
            <div class="text-xs text-charcoal/40 mt-0.5">
              {{ formatDateSecondary(row.paidAt || row.updatedAt) }}
            </div>
          </template> -->

          <!-- Action -->
          <template #column-action="{ row }">
            <button
              @click="downloadInvoicePdf(row.transactionRef)"
              :disabled="downloadingRef === row.transactionRef"
              class="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <template v-if="downloadingRef === row.transactionRef">
                <Icon name="RefreshCw" class="w-3 h-3 animate-spin" />
                Generating...
              </template>
              <template v-else>
                <Icon name="Download" class="w-3 h-3" />
                Download PDF
              </template>
            </button>
          </template>
        </UiTable>

        <!-- Footer Success Message -->
        <div
          class="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 mt-6 shadow-sm"
        >
          <div
            class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"
          >
            <Icon name="CheckCircle" class="w-5 h-5 text-emerald-600" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-bold text-secondary">
              All invoices are paid!
            </p>
            <p class="text-xs text-charcoal/50 font-medium">
              Thank you for your business. Keep up the great work!
            </p>
          </div>
          <!-- Decorative -->
          <div class="hidden sm:block">
            <svg
              width="80"
              height="50"
              viewBox="0 0 80 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="10"
                y="5"
                width="40"
                height="30"
                rx="3"
                fill="#f0fdf4"
                stroke="#bbf7d0"
                stroke-width="1"
              />
              <line
                x1="18"
                y1="15"
                x2="42"
                y2="15"
                stroke="#d1fae5"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="18"
                y1="22"
                x2="36"
                y2="22"
                stroke="#d1fae5"
                stroke-width="2"
                stroke-linecap="round"
              />
              <rect
                x="35"
                y="18"
                width="35"
                height="24"
                rx="3"
                fill="#dcfce7"
                stroke="#86efac"
                stroke-width="1"
              />
              <line
                x1="42"
                y1="26"
                x2="62"
                y2="26"
                stroke="#bbf7d0"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="42"
                y1="33"
                x2="56"
                y2="33"
                stroke="#bbf7d0"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

definePageMeta({
  name: "Paid Invoices",
  layout: "portal",
  middleware: ["auth"],
});

const { data, pending, error } = await useFetch<any>("/api/invoices/paid");

const transactions = computed(() => data.value?.transactions || []);
const stats = computed(
  () =>
    data.value?.stats || {
      totalPaidInvoices: 0,
      totalAmountPaid: "0.00",
      latestPaidAt: null,
      successRate: 100,
    },
);

const paidInvoiceColumns = [
  { key: "sno", label: "SNO", icon: "CirclePlus" },
  { key: "transactionRef", label: "Invoice Number", icon: "FileText" },
  { key: "amount", label: "Price", icon: "CircleDollarSign" },
  { key: "date", label: "Date", icon: "Calendar" },
  { key: "action", label: "Action", icon: "Settings" },
];

// ── PDF Download ──────────────────────────────────────────
const { downloadInvoicePdf, downloadingRef } = useInvoicePdf();

// ── Date Helpers ──────────────────────────────────────────
const formatDatePrimary = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateSecondary = (dateString: string | null) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

</script>
