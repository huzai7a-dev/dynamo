<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex shrink-0 justify-between items-center">
      <h3 class="text-2xl font-black text-secondary tracking-tight">Unpaid Invoice</h3>
    </div>

    <!-- Payment Success Banner -->
    <Transition name="slide-down">
      <div
        v-if="showSuccessBanner"
        class="flex items-center gap-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-sm"
      >
        <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Icon name="CheckCircle" class="w-5 h-5 text-emerald-600" />
        </div>
        <div class="flex-1">
          <p class="font-bold text-sm">Payment Submitted Successfully!</p>
          <p class="text-xs text-emerald-600 mt-0.5">Your payment is being processed. This invoice will update to <strong>Paid</strong> shortly once 2Checkout confirms.</p>
        </div>
        <button @click="showSuccessBanner = false" class="text-emerald-400 hover:text-emerald-600">
          <Icon name="X" class="w-4 h-4" />
        </button>
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center py-24">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center p-4">
      <div class="bg-rose-50 text-rose-600 p-8 rounded-3xl border border-rose-100 text-center max-w-md shadow-sm">
        <Icon name="AlertCircle" class="w-12 h-12 mx-auto mb-4" />
        <h3 class="font-bold text-lg mb-2">Error Loading Invoices</h3>
        <p class="text-sm opacity-80 font-medium">We couldn't load your unpaid invoices. Please try refreshing.</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="transactions.length === 0" class="flex items-center justify-center py-24">
        <div class="bg-white rounded-[3rem] border border-slate-200 p-20 text-center shadow-xl max-w-lg animate-in zoom-in-95 duration-700">
          <div class="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
            <Icon name="FileText" class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-3xl font-black text-secondary mb-4 italic tracking-tight">NO UNPAID INVOICES</h3>
          <p class="text-charcoal/50 font-medium leading-relaxed mb-8">
            You have no pending invoices. Generate one from the
            <NuxtLink to="/invoices" class="text-primary font-bold hover:underline">Invoice</NuxtLink>
            page.
          </p>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg border-2 border-primary overflow-hidden">
        <table class="min-w-full table-auto border-collapse text-sm font-sans">
          <thead class="bg-primary">
            <tr>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">#SR</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Invoice Number</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Price</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Price Status</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Date</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tx, index) in transactions"
              :key="tx.transactionRef"
              class="bg-white border-b border-primary-light/30 last:border-b-0 hover:bg-primary-light/10 transition-colors duration-150"
            >
              <td class="px-5 py-4 text-center text-sm text-gray-500">{{ index + 1 }}</td>
              <td class="px-5 py-4 text-center text-sm font-black text-secondary tracking-tight">
                {{ tx.transactionRef }}
              </td>
              <td class="px-5 py-4 text-center text-sm font-black text-primary italic">
                {{ Number(tx.amount).toFixed(0) }}
              </td>
              <td class="px-5 py-4 text-center">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                  unPaid
                </span>
              </td>
              <td class="px-5 py-4 text-center text-xs text-gray-500">{{ formatDate(tx.createdAt) }}</td>
              <td class="px-5 py-4 text-center">
                <div class="flex items-center justify-center gap-2 flex-wrap">
                  <!-- Revert -->
                  <button
                    @click="confirmRevert(tx)"
                    :disabled="revertingRef === tx.transactionRef"
                    class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-bold rounded-md transition-colors shadow-sm"
                  >
                    <span v-if="revertingRef === tx.transactionRef" class="flex items-center gap-1">
                      <Icon name="RefreshCw" class="w-3 h-3 animate-spin" /> Reverting...
                    </span>
                    <span v-else>Revert</span>
                  </button>

                  <!-- Details -->
                  <button
                    @click="openDetails(tx)"
                    class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors shadow-sm flex items-center gap-1"
                  >
                    <Icon name="Eye" class="w-3 h-3" />
                    Details
                  </button>

                  <!-- Download PDF -->
                  <button
                    @click="downloadPdf(tx)"
                    class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-md transition-colors shadow-sm flex items-center gap-1"
                  >
                    <Icon name="Download" class="w-3 h-3" />
                    Download PDF
                  </button>

                  <!-- Pay Now -->
                  <button
                    @click="payNow(tx)"
                    :disabled="payingRef === tx.transactionRef"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-md transition-colors shadow-sm flex items-center gap-1"
                  >
                    <Icon v-if="payingRef === tx.transactionRef" name="RefreshCw" class="w-3 h-3 animate-spin" />
                    {{ payingRef === tx.transactionRef ? 'Redirecting...' : 'Pay Now' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <UiModal v-model="showDetailsModal">
      <div v-if="selectedTx">
        <h2 class="text-lg font-black text-secondary mb-1">Invoice Detail</h2>
        <p class="text-sm font-bold text-secondary mb-4">
          Invoice Number : <span class="font-black">{{ selectedTx.transactionRef }}</span>
        </p>

        <div class="overflow-x-auto rounded-lg border border-gray-200 overflow-hidden">
          <table class="min-w-full table-auto text-sm">
            <thead class="bg-secondary text-white">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">sno</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Order Number</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Design Name</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Price</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Order Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in selectedTxDetails"
                :key="`detail-${idx}`"
                class="border-b border-gray-100 last:border-b-0"
              >
                <td class="px-4 py-3 text-gray-600">{{ idx + 1 }}</td>
                <td class="px-4 py-3 font-bold text-secondary">
                  {{ item.type === 'order' ? 'OR' : 'VR' }}-{{ item.id }}
                </td>
                <td class="px-4 py-3 text-gray-700">{{ item.name }}</td>
                <td class="px-4 py-3 font-bold text-primary">{{ Number(item.price || 0) }}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDate(item.date) }}</td>
              </tr>

              <!-- Total row -->
              <tr class="bg-secondary/80">
                <td colspan="3" class="px-4 py-3 text-white font-bold">Total Amount</td>
                <td class="px-4 py-3 text-white font-black text-base">
                  {{ selectedTxDetails.reduce((s, i) => s + Number(i.price || 0), 0) }}
                </td>
                <td class="px-4 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="detailsLoading" class="flex justify-center py-6">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </UiModal>

    <!-- Revert Confirm Modal -->
    <UiModal v-model="showRevertModal">
      <div class="text-center py-4">
        <div class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Icon name="AlertTriangle" class="w-8 h-8 text-amber-600" />
        </div>
        <h3 class="text-xl font-black text-secondary mb-2">Revert Invoice?</h3>
        <p class="text-gray-500 text-sm leading-relaxed mb-6">
          This will delete the invoice and return all included orders/vectors back to your
          <span class="font-bold text-secondary">Invoice</span> page as unpaid items.
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

    <!-- Hidden PDF print area -->
    <div id="pdf-print-area" class="hidden">
      <div v-if="pdfTx" style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px;">
        <h1 style="color: #1e293b; border-bottom: 2px solid #0d9488; padding-bottom: 12px;">Invoice</h1>
        <p><strong>Invoice Number:</strong> {{ pdfTx.transactionRef }}</p>
        <p><strong>Date:</strong> {{ formatDate(pdfTx.createdAt) }}</p>
        <p><strong>Status:</strong> Unpaid</p>
        <p><strong>Total Amount:</strong> ${{ Number(pdfTx.amount).toFixed(2) }} {{ pdfTx.currency }}</p>
        <br />
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: #1e293b; color: white;">
              <th style="padding: 10px; text-align: left; font-size: 12px;">#</th>
              <th style="padding: 10px; text-align: left; font-size: 12px;">Order Number</th>
              <th style="padding: 10px; text-align: left; font-size: 12px;">Design Name</th>
              <th style="padding: 10px; text-align: left; font-size: 12px;">Price</th>
              <th style="padding: 10px; text-align: left; font-size: 12px;">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in pdfItems" :key="idx" :style="{ background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }">
              <td style="padding: 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0;">{{ idx + 1 }}</td>
              <td style="padding: 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">
                {{ item.type === 'order' ? 'OR' : 'VR' }}-{{ item.id }}
              </td>
              <td style="padding: 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0;">{{ item.name }}</td>
              <td style="padding: 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${{ Number(item.price || 0).toFixed(2) }}</td>
              <td style="padding: 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0;">{{ formatDate(item.date) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background: #1e293b; color: white;">
              <td colspan="3" style="padding: 10px; font-weight: bold;">Total Amount</td>
              <td style="padding: 10px; font-weight: bold;">${{ Number(pdfTx.amount).toFixed(2) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  layout: "portal",
  middleware: ["auth"],
});

const toast = useToast();
const route = useRoute();

// ── Payment Success Banner ─────────────────────────────────
// Show when returning from 2Checkout with ?payment=success
const showSuccessBanner = ref(route.query.payment === 'success');

// Clean the query param from the URL without reloading
if (showSuccessBanner.value) {
  const router = useRouter();
  router.replace({ query: { ...route.query, payment: undefined, ref: undefined } });
}

// Fetch all pending transactions
const { data, pending, error, refresh } = await useFetch<any>('/api/invoices');
const transactions = computed(() => data.value?.transactions || []);

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
    toast.error('Failed to load invoice details');
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
    await $fetch(`/api/invoices/${tx.transactionRef}`, { method: 'DELETE' });
    toast.success('Invoice reverted. Items returned to Invoice page.');
    await refresh();
  } catch (err: any) {
    toast.error(err.data?.message || 'Failed to revert invoice');
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
      { method: 'POST' }
    );
    // Redirect the browser to 2Checkout
    window.location.href = checkoutUrl;
  } catch (err: any) {
    toast.error(err.data?.message || 'Failed to initiate payment. Please try again.');
    payingRef.value = null;
  }
  // Note: don't reset payingRef on success — user is being redirected away
};

// ── PDF Download ───────────────────────────────────────────
const pdfTx = ref<any>(null);
const pdfItems = ref<any[]>([]);

const downloadPdf = async (tx: any) => {
  try {
    // Fetch detail for PDF
    const detail = await $fetch<any>(`/api/invoices/${tx.transactionRef}`);
    pdfTx.value = tx;
    pdfItems.value = detail?.items || [];

    await nextTick();

    const printArea = document.getElementById('pdf-print-area');
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

// ── Helpers ────────────────────────────────────────────────
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};
</script>
