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
              @click="downloadPdf(row)"
              class="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors"
            >
              <Icon name="Download" class="w-3 h-3" />
              Download PDF
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

    <!-- Hidden PDF print area (reused from unpaid page pattern) -->
    <div id="pdf-print-area" class="hidden">
      <div
        v-if="pdfTx"
        style="
          font-family: sans-serif;
          background: #fff;
          width: 800px;
          padding: 40px;
          box-sizing: border-box;
          margin: 0 auto;
          color: #1e293b;
        "
      >
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 16px">
          <img
            src="/images/full-logo.png"
            alt="Logo"
            style="height: 56px; width: auto; object-fit: contain; margin: 0 auto"
          />
          <p
            style="
              margin: 8px 0 0;
              font-size: 10px;
              font-weight: 700;
              color: #669699;
              letter-spacing: 2px;
              text-transform: uppercase;
            "
          >
            {{ COMPANY.tagline }}
          </p>
        </div>

        <!-- Invoice # banner -->
        <div
          style="
            display: flex;
            margin-bottom: 16px;
            border-radius: 6px;
            overflow: hidden;
          "
        >
          <div style="width: 10px; background: #f1f3f4"></div>
          <div style="flex: 1; background: #0d6c73; padding: 16px 24px">
            <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff">
              Invoice # {{ pdfTx.transactionRef }}
            </h2>
          </div>
        </div>

        <!-- Bill From / Bill To -->
        <div
          style="
            background: #f1f3f4;
            border-radius: 6px;
            padding: 20px 24px;
            margin-bottom: 16px;
          "
        >
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
        <div
          style="
            background: #f1f3f4;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 16px;
          "
        >
          <table style="width: 100%; border-collapse: collapse">
            <thead>
              <tr style="background: #0d6c73; color: white">
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">
                  #SR
                </th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">
                  Design No
                </th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">
                  Design Name
                </th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">
                  PO Number
                </th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">
                  Payment Status
                </th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255, 255, 255, 0.2)">
                  Received Date
                </th>
                <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in pdfItems"
                :key="idx"
                :style="{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }"
              >
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">
                  {{ idx + 1 }}
                </td>
                <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: 600; color: #003438; border-right: 1px solid #e2e8f0">
                  {{ item.type === "order" ? "OR" : "VR" }}-{{ item.id }}
                </td>
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">
                  {{ item.name }}
                </td>
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">
                  {{ item.poNumber || "-" }}
                </td>
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">
                  Paid
                </td>
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151; border-right: 1px solid #e2e8f0">
                  {{ formatDateShort(item.date) }}
                </td>
                <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: bold; color: #0d6c73">
                  ${{ Number(item.price || 0).toFixed(0) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td
                  colspan="6"
                  style="background: #ffffff; padding: 12px; text-align: right; font-weight: 800; font-size: 14px; color: #003438; letter-spacing: 1px"
                >
                  Total
                </td>
                <td style="background: #ffffff; padding: 12px; text-align: center; font-weight: 800; font-size: 14px; color: #0d6c73">
                  ${{ Number(pdfTx.amount).toFixed(0) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Note -->
        <div
          style="
            background: #f1f3f4;
            border-radius: 6px;
            padding: 20px 24px;
            margin-bottom: 16px;
          "
        >
          <p style="margin: 0 0 8px; font-size: 13px; font-weight: 800; color: #003438">
            Note:
          </p>
          <p style="margin: 0; font-size: 12px; color: #374151; line-height: 1.7">
            If you have an outstanding balance: please pay it as soon as
            possible to avoid service interruptions. Accounts delinquent for
            over 7 days are subject to suspension and/or deletion.
          </p>
        </div>

        <!-- Payment Information -->
        <div
          style="
            background: #f1f3f4;
            border-radius: 6px;
            padding: 20px 24px;
            margin-bottom: 16px;
          "
        >
          <p style="margin: 0 0 14px; font-size: 13px; font-weight: 800; color: #003438">
            Payment Information:
          </p>
          <table style="width: 100%; font-size: 12px">
            <tbody>
              <tr>
                <td style="width: 40%; vertical-align: top; border-right: 1px solid #dbe0e2; padding-right: 15px">
                  <div style="font-weight: 600; margin-bottom: 10px; color: #003438">
                    We accept:
                  </div>
                  <div style="display: flex; gap: 8px">
                    <!-- Placeholders for card logos -->
                    <div style="background: white; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; font-size: 9px; font-weight: bold; color: #1d4ed8">
                      VISA
                    </div>
                    <div style="background: white; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; font-size: 9px; font-weight: bold; color: #dc2626">
                      MC
                    </div>
                    <div style="background: white; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; font-size: 9px; font-weight: bold; color: #2563eb">
                      AMEX
                    </div>
                    <div style="background: white; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; font-size: 9px; font-weight: bold; color: #0369a1">
                      PayPal
                    </div>
                  </div>
                </td>
                <td style="width: 60%; vertical-align: top; padding-left: 15px">
                  <table style="width: 100%; color: #374151; line-height: 1.6">
                    <tbody>
                      <tr>
                        <td colspan="2" style="font-weight: 600; color: #003438; padding-bottom: 4px">
                          Bank Transfer
                        </td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600">Account Name:</td>
                        <td>{{ PAYMENT_INFO.accountName }}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600">Bank Name:</td>
                        <td>{{ PAYMENT_INFO.bankName }}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600">Account Number:</td>
                        <td>{{ PAYMENT_INFO.accountNumber }}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600">Routing Number:</td>
                        <td>{{ PAYMENT_INFO.routingNumber }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Thank You -->
        <div style="text-align: center; margin-bottom: 16px">
          <h2
            style="
              margin: 0 0 5px 0;
              font-family: serif;
              font-style: italic;
              font-size: 32px;
              color: #003438;
            "
          >
            Thank you!
          </h2>
          <p
            style="
              margin: 0;
              font-size: 11px;
              color: #669699;
              text-transform: uppercase;
              letter-spacing: 2px;
            "
          >
            WE APPRECIATE YOUR BUSINESS
          </p>
        </div>

        <!-- Footer -->
        <div
          style="
            background: #003438;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            border-bottom: 4px solid #0d6c73;
          "
        >
          <div style="display: flex; gap: 20px">
            <span>{{ COMPANY.website }}</span>
            <span>{{ COMPANY.phone }}</span>
            <span>{{ COMPANY.email }}</span>
          </div>
          <div style="text-align: right">
            {{ COMPANY.address }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { COMPANY, PAYMENT_INFO, BILL_FROM } from "~/constants";

definePageMeta({
  name: "Paid Invoices",
  layout: "portal",
  middleware: ["auth"],
});

const toast = useToast();

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
const pdfTx = ref<any>(null);
const pdfItems = ref<any[]>([]);
const pdfUser = ref<any>(null);

const downloadPdf = async (tx: any) => {
  try {
    // Fetch full invoice detail (reuses existing endpoint)
    const detail = await $fetch<any>(`/api/invoices/${tx.transactionRef}`);
    pdfTx.value = { ...detail, ...tx };
    pdfItems.value = detail?.items || [];
    pdfUser.value = detail?.user || null;

    await nextTick();

    const printArea = document.getElementById("pdf-print-area");
    if (!printArea) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
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
    toast.error("Failed to prepare PDF. Please try again.");
  }
};

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

const formatDateShort = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
</script>
