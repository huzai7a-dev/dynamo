<template>
  <div class="flex flex-col gap-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <div
        class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
      >
        <Icon name="CircleDollarSign" class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 class="text-2xl font-black text-secondary tracking-tight">
          Unpaid Invoice
        </h3>
        <p class="text-sm text-charcoal/50 font-medium">
          Manage and take action on your unpaid invoices.
        </p>
      </div>
    </div>

    <!-- Payment Success Banner -->
    <Transition name="slide-down">
      <div
        v-if="showSuccessBanner"
        class="flex items-center gap-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-sm"
      >
        <div
          class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"
        >
          <Icon name="CheckCircle" class="w-5 h-5 text-emerald-600" />
        </div>
        <div class="flex-1">
          <p class="font-bold text-sm">Payment Submitted Successfully!</p>
          <p class="text-xs text-emerald-600 mt-0.5">
            Your payment is being processed. This invoice will update to
            <strong>Paid</strong> shortly once 2Checkout confirms.
          </p>
        </div>
        <button
          @click="showSuccessBanner = false"
          class="text-emerald-400 hover:text-emerald-600"
        >
          <Icon name="X" class="w-4 h-4" />
        </button>
      </div>
    </Transition>

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
          We couldn't load your unpaid invoices. Please try refreshing.
        </p>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Empty State -->
      <InvoiceEmptyState
        v-if="transactions.length === 0"
        title="No Unpaid Invoices"
        description="You're all caught up! There are no pending invoices that need your attention right now."
        action-label="Create New Invoice"
        action-icon="FilePlus"
        action-route="/invoices"
      />

      <!-- Data State -->
      <template v-else>
        <!-- Invoice Table -->
        <UiTable
          :data="transactions"
          :columns="unpaidInvoiceColumns"
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

          <!-- Price Status -->
          <template #column-status>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              Unpaid
            </span>
          </template>

          <!-- Date -->
          <template #column-date="{ row }">
            <div class="text-charcoal/70">
              {{ formatDatePrimary(row.createdAt) }}
            </div>
            <div class="text-xs text-charcoal/40 mt-0.5">
              {{ formatDateSecondary(row.createdAt) }}
            </div>
          </template>

          <!-- Action -->
          <template #column-action="{ row }">
            <div class="flex items-center justify-center gap-2 flex-wrap">
              <!-- Revert -->
              <button
                @click="confirmRevert(row)"
                :disabled="revertingRef === row.transactionRef"
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-60"
              >
                <template v-if="revertingRef === row.transactionRef">
                  <Icon name="RefreshCw" class="w-3 h-3 animate-spin" />
                  Reverting...
                </template>
                <template v-else>
                  <Icon name="RefreshCw" class="w-3 h-3" /> Revert
                </template>
              </button>

              <!-- Details -->
              <button
                @click="openDetails(row)"
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-lg transition-colors"
              >
                <Icon name="Eye" class="w-3 h-3" />
                Details
              </button>

              <!-- Download PDF -->
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

              <!-- Pay Now -->
              <button
                @click="payNow(row)"
                :disabled="payingRef === row.transactionRef"
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Icon
                  v-if="payingRef === row.transactionRef"
                  name="RefreshCw"
                  class="w-3 h-3 animate-spin"
                />
                <Icon v-else name="CircleDollarSign" class="w-3 h-3" />
                {{
                  payingRef === row.transactionRef
                    ? "Redirecting..."
                    : "Pay Now"
                }}
              </button>
            </div>
          </template>
        </UiTable>

        <!-- "No more" footer message -->
        <!-- <div class="flex flex-col items-center justify-center py-10">
          <div class="mb-4">
            <svg width="80" height="70" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="15" y="2" width="50" height="40" rx="4" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
              <line x1="25" y1="14" x2="55" y2="14" stroke="#d1fae5" stroke-width="2" stroke-linecap="round"/>
              <line x1="25" y1="22" x2="48" y2="22" stroke="#d1fae5" stroke-width="2" stroke-linecap="round"/>
              <line x1="25" y1="30" x2="52" y2="30" stroke="#d1fae5" stroke-width="2" stroke-linecap="round"/>
              <circle cx="40" cy="32" r="12" fill="#dcfce7" stroke="#86efac" stroke-width="1"/>
              <text x="40" y="37" text-anchor="middle" fill="#16a34a" font-size="12" font-weight="bold">$</text>
            </svg>
          </div>
          <p class="text-sm font-bold text-secondary">No more unpaid invoices!</p>
          <p class="text-xs text-charcoal/50 font-medium mt-1">Great job! All your invoices are paid.</p>
        </div> -->
      </template>
    </div>

    <!-- Details Modal -->
    <UiModal v-model="showDetailsModal">
      <div v-if="selectedTx">
        <h2 class="text-lg font-black text-secondary mb-1">Invoice Detail</h2>
        <p class="text-sm font-bold text-secondary mb-4">
          Invoice Number :
          <span class="font-black">{{ selectedTx.transactionRef }}</span>
        </p>

        <UiTable
          :data="selectedTxDetails"
          :columns="detailsColumns"
          :disable-row-hover="true"
        >
          <!-- SNO -->
          <template #column-sno="{ index }">
            <span class="text-charcoal/70">{{ index + 1 }}</span>
          </template>

          <!-- Order Number -->
          <template #column-number="{ row }">
            <span class="text-charcoal/70">
              {{ row.type === "order" ? "OR" : "VR" }}-{{ row.id }}
            </span>
          </template>

          <!-- Design Name -->
          <template #column-name="{ row }">
            <span class="text-charcoal/70">{{ row.name }}</span>
          </template>

          <!-- Price -->
          <template #column-price="{ row }">
            <span class="text-charcoal/70">${{ Number(row.price || 0) }}</span>
          </template>

          <!-- Order Date -->
          <template #column-date="{ row }">
            <span class="text-charcoal/70">{{ formatDate(row.date) }}</span>
          </template>

          <!-- Footer: Total Amount -->
          <template #footer>
            <tr class="bg-primary text-white border-t">
              <td colspan="3" class="px-3 py-2.5"></td>
              <td
                class="px-3 py-2.5 text-center text-xs font-black uppercase tracking-wider"
              >
                Total Amount
              </td>
              <td class="px-3 py-2.5 text-center text-sm">
                ${{
                  selectedTxDetails.reduce(
                    (s, i) => s + Number(i.price || 0),
                    0,
                  )
                }}
              </td>
            </tr>
          </template>
        </UiTable>

        <div v-if="detailsLoading" class="flex justify-center py-6">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          ></div>
        </div>
      </div>
    </UiModal>

    <!-- Revert Confirm Modal -->
    <UiModal v-model="showRevertModal">
      <div class="text-center py-4">
        <div
          class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4"
        >
          <Icon name="AlertTriangle" class="w-8 h-8 text-amber-600" />
        </div>
        <h3 class="text-xl font-black text-secondary mb-2">Revert Invoice?</h3>
        <p class="text-gray-500 text-sm leading-relaxed mb-6">
          This will delete the invoice and return all included orders/vectors
          back to your
          <span class="font-bold text-secondary">Invoice</span> page as unpaid
          items.
        </p>
        <div class="flex justify-center gap-3">
          <button
            @click="showRevertModal = false"
            class="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="executeRevert"
            :disabled="!!revertingRef"
            class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-60"
          >
            Yes, Revert
          </button>
        </div>
      </div>
    </UiModal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  name: "Unpaid Invoices",
  layout: "portal",
  middleware: ["auth"],
});

const toast = useToast();
const route = useRoute();

// ── Payment Success Banner ─────────────────────────────────
// Show when returning from 2Checkout with ?payment=success
const showSuccessBanner = ref(route.query.payment === "success");

// Clean the query param from the URL without reloading
if (showSuccessBanner.value) {
  const router = useRouter();
  router.replace({
    query: { ...route.query, payment: undefined, ref: undefined },
  });
}

// Fetch all pending transactions
const { data, pending, error, refresh } = await useFetch<any>("/api/invoices");
const transactions = computed(() => data.value?.transactions || []);

const unpaidInvoiceColumns = [
  { key: "sno", label: "SNO", icon: "CirclePlus" },
  { key: "transactionRef", label: "Invoice Number", icon: "FileText" },
  { key: "amount", label: "Price", icon: "CircleDollarSign" },
  { key: "status", label: "Price Status", icon: "Tag" },
  { key: "date", label: "Date", icon: "Calendar" },
  { key: "action", label: "Action", icon: "Settings" },
];

const detailsColumns = [
  { key: "sno", label: "SNO" },
  { key: "number", label: "Order Number" },
  { key: "name", label: "Design Name" },
  { key: "price", label: "Price" },
  { key: "date", label: "Order Date" },
];

// ── Details Modal ──────────────────────────────────────────
const showDetailsModal = ref(false);
const selectedTx = ref<any>(null);
const selectedTxDetails = ref<any[]>([]);
const detailsLoading = ref(false);

const openDetails = async (tx: any) => {
  selectedTx.value = tx;
  showDetailsModal.value = true;
  detailsLoading.value = true;

  try {
    const detail = await $fetch<any>(`/api/invoices/${tx.transactionRef}`);
    selectedTxDetails.value = detail?.items || [];
  } catch (e) {
    toast.error("Failed to load invoice details");
    selectedTxDetails.value = [];
  } finally {
    detailsLoading.value = false;
  }
};

// ── Revert ─────────────────────────────────────────────────
const showRevertModal = ref(false);
const pendingRevertTx = ref<any>(null);
const revertingRef = ref<string | null>(null);

const confirmRevert = (tx: any) => {
  pendingRevertTx.value = tx;
  showRevertModal.value = true;
};

const executeRevert = async () => {
  if (!pendingRevertTx.value) return;
  const tx = pendingRevertTx.value;

  showRevertModal.value = false;
  revertingRef.value = tx.transactionRef;

  try {
    await $fetch(`/api/invoices/${tx.transactionRef}`, { method: "DELETE" });
    toast.success("Invoice reverted. Items returned to Invoice page.");
    await refresh();
  } catch (err: any) {
    toast.error(err.data?.message || "Failed to revert invoice");
  } finally {
    revertingRef.value = null;
    pendingRevertTx.value = null;
  }
};

// ── Pay Now ────────────────────────────────────────────────
const payingRef = ref<string | null>(null);

const payNow = async (tx: any) => {
  payingRef.value = tx.transactionRef;
  try {
    const { checkoutUrl } = await $fetch<{ checkoutUrl: string }>(
      `/api/invoices/${tx.transactionRef}/pay-link`,
      { method: "POST" },
    );
    // Redirect the browser to 2Checkout
    window.location.href = checkoutUrl;
  } catch (err: any) {
    toast.error(
      err.data?.message || "Failed to initiate payment. Please try again.",
    );
    payingRef.value = null;
  }
  // Note: don't reset payingRef on success — user is being redirected away
};

// ── PDF Download ───────────────────────────────────────────
const { downloadInvoicePdf, downloadingRef } = useInvoicePdf();

// ── Helpers ────────────────────────────────────────────────
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

// Date formatting — primary: "May 28, 2026", secondary: "02:33 PM"
const formatDatePrimary = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateSecondary = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

</script>
