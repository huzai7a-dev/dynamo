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
          Invoice
        </h3>
        <p class="text-sm text-charcoal/50 font-medium">
          {{
            allItems.length > 0
              ? "Review your invoice details below."
              : "Create and manage your invoices."
          }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-24">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center p-4">
      <div
        class="bg-rose-50 text-rose-600 p-8 rounded-3xl border border-rose-100 text-center max-w-md shadow-sm"
      >
        <Icon name="AlertCircle" class="w-12 h-12 mx-auto mb-4" />
        <h3 class="font-bold text-lg mb-2 italic">Error Loading Invoices</h3>
        <p class="text-sm opacity-80 font-medium">
          We couldn't retrieve your unpaid items. Please try refreshing the page
          or contact support.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Empty State -->
      <InvoiceEmptyState
        v-if="allItems.length === 0"
        title="No Invoices Yet"
        description="You haven't created any invoices yet. Get started by creating your first invoice."
        action-label="Create New Invoice"
        action-icon="FilePlus"
        action-route="/orders"
      />

      <!-- Data State -->
      <template v-else>
        <!-- Total Payable Amount Card -->
        <div
          class="bg-white rounded-2xl border border-primary/20 p-6 flex items-center justify-between mb-6 shadow-sm overflow-hidden"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <Icon name="CircleDollarSign" class="w-6 h-6 text-primary" />
            </div>
            <div>
              <p class="text-sm font-medium text-charcoal/60">
                Total Payable Amount
              </p>
              <p class="text-2xl font-black text-primary tracking-tight">
                ${{ selectedTotal.toFixed(2) }}
              </p>
            </div>
          </div>
          <!-- Decorative Illustration -->
          <div class="hidden sm:block relative">
            <svg
              width="120"
              height="80"
              viewBox="0 0 120 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Document stack -->
              <rect
                x="20"
                y="8"
                width="60"
                height="50"
                rx="4"
                fill="#f0fdf4"
                stroke="#bbf7d0"
                stroke-width="1"
              />
              <rect
                x="25"
                y="4"
                width="60"
                height="50"
                rx="4"
                fill="#f0fdf4"
                stroke="#bbf7d0"
                stroke-width="1"
              />
              <rect
                x="30"
                y="0"
                width="60"
                height="50"
                rx="4"
                fill="white"
                stroke="#bbf7d0"
                stroke-width="1.5"
              />
              <!-- Document lines -->
              <line
                x1="40"
                y1="14"
                x2="80"
                y2="14"
                stroke="#d1fae5"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <line
                x1="40"
                y1="22"
                x2="72"
                y2="22"
                stroke="#d1fae5"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <line
                x1="40"
                y1="30"
                x2="76"
                y2="30"
                stroke="#d1fae5"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <!-- Dollar circle -->
              <circle
                cx="95"
                cy="55"
                r="20"
                fill="#dcfce7"
                stroke="#86efac"
                stroke-width="1.5"
              />
              <text
                x="95"
                y="62"
                text-anchor="middle"
                fill="#16a34a"
                font-size="18"
                font-weight="bold"
              >
                $
              </text>
            </svg>
          </div>
        </div>

        <!-- Invoice Table -->
        <UiTable
          :data="allItems"
          :columns="invoiceColumns"
          :disable-row-hover="true"
        >
          <!-- S# -->
          <template #column-sno="{ index }">
            <span
              class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold"
            >
              {{ index + 1 }}
            </span>
          </template>

          <!-- Number -->
          <template #column-number="{ row }">
            <span class="font-black text-secondary tracking-tight">
              {{ row.type === "order" ? "OR" : "VR" }}-{{ row.id }}
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

          <!-- Design Name -->
          <template #column-name="{ row }">
            <span class="font-bold text-secondary">{{ row.name }}</span>
          </template>

          <!-- Price -->
          <template #column-price="{ row }">
            <span class="font-black text-primary">
              {{
                row.price === "0.00"
                  ? "Free"
                  : `$${Number(row.price).toFixed(2)}`
              }}
            </span>
          </template>

          <!-- Select header -->
          <template #header-select>
            <input
              type="checkbox"
              :checked="allChecked"
              :indeterminate="someChecked && !allChecked"
              class="w-4 h-4 accent-primary cursor-pointer rounded"
              @change="toggleAll"
            />
          </template>

          <!-- Select checkbox -->
          <template #column-select="{ row }">
            <input
              type="checkbox"
              :checked="checkedIds.has(`${row.type}-${row.id}`)"
              class="w-4 h-4 accent-primary cursor-pointer rounded"
              @change="toggleItem(row)"
            />
          </template>

          <!-- Price Status -->
          <template #column-status>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Payable
            </span>
          </template>

          <!-- Footer: Total Payable Amount -->
          <template #footer>
            <tr class="bg-primary/[0.04] border-t border-primary-light/30">
              <td colspan="3" class="px-3 py-2.5"></td>
              <td
                class="px-3 py-2.5 text-center text-xs font-black text-secondary uppercase tracking-wider"
              >
                Total Payable Amount
              </td>
              <td
                class="px-3 py-2.5 text-center text-sm font-black text-primary"
              >
                ${{ selectedTotal.toFixed(2) }}
              </td>
              <td colspan="2" class="px-3 py-2.5"></td>
            </tr>
          </template>
        </UiTable>

        <!-- Footer CTA Section -->
        <div
          class="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 shadow-sm"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <Icon name="FileText" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <p class="text-sm font-bold text-secondary">Ready to proceed?</p>
              <p class="text-xs text-charcoal/50 font-medium">
                Generate the invoice and continue with the payment process.
              </p>
            </div>
          </div>
          <button
            @click="generateInvoice"
            :disabled="creatingInvoice || checkedIds.size === 0"
            class="px-8 py-3 bg-primary hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm flex items-center gap-2.5 shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px] whitespace-nowrap"
          >
            <Icon
              v-if="creatingInvoice"
              name="RefreshCw"
              class="w-4 h-4 animate-spin"
            />
            <Icon v-else name="FileText" class="w-4 h-4" />
            {{
              creatingInvoice ? "Generating..." : "Generate Invoice for Payment"
            }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  name: "Invoices",
  layout: "portal",
  middleware: ["auth"],
});

const router = useRouter();
const toast = useToast();
const { data, pending, error } = await useFetch<any>("/api/user/unpaid-items");

const allItems = computed(() => data.value?.items || []);

const invoiceColumns = [
  { key: "sno", label: "S#", icon: "CirclePlus" },
  { key: "number", label: "Number", icon: "FileText" },
  { key: "date", label: "Date", icon: "Calendar" },
  { key: "name", label: "Design Name", icon: "Tag" },
  { key: "price", label: "Price", icon: "CircleDollarSign" },
  { key: "select", label: "" },
  { key: "status", label: "Price Status", icon: "ClipboardList" },
];

// Track checked state using a Set of "type-id" keys
const checkedIds = reactive(new Set<string>());

// Initialize all items as checked when data loads
watch(
  allItems,
  (items) => {
    checkedIds.clear();
    items.forEach((item: any) => checkedIds.add(`${item.type}-${item.id}`));
  },
  { immediate: true },
);

const allChecked = computed(
  () => allItems.value.length > 0 && checkedIds.size === allItems.value.length,
);
const someChecked = computed(() => checkedIds.size > 0);

const selectedTotal = computed(() => {
  return allItems.value
    .filter((item: any) => checkedIds.has(`${item.type}-${item.id}`))
    .reduce((sum: number, item: any) => sum + Number(item.price || 0), 0);
});

const toggleItem = (item: any) => {
  const key = `${item.type}-${item.id}`;
  if (checkedIds.has(key)) {
    checkedIds.delete(key);
  } else {
    checkedIds.add(key);
  }
};

const toggleAll = () => {
  if (allChecked.value) {
    checkedIds.clear();
  } else {
    allItems.value.forEach((item: any) =>
      checkedIds.add(`${item.type}-${item.id}`),
    );
  }
};

const creatingInvoice = ref(false);

const generateInvoice = async () => {
  if (checkedIds.size === 0) return;

  creatingInvoice.value = true;

  // Only send checked items
  const itemsPayload = allItems.value
    .filter((item: any) => checkedIds.has(`${item.type}-${item.id}`))
    .map((item: any) => ({
      type: item.type,
      id: Number(item.id),
    }));

  try {
    await $fetch("/api/invoices/create", {
      method: "POST",
      body: { items: itemsPayload },
    });

    toast.success("Invoice generated successfully!");
    await router.push("/invoices/unpaid");
  } catch (err: any) {
    console.error(err);
    toast.error(err.data?.message || "Failed to generate invoice");
  } finally {
    creatingInvoice.value = false;
  }
};

// Date formatting — primary: "May 22, 2026", secondary: "03:32:24 AM"
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
    second: "2-digit",
    hour12: true,
  });
};
</script>
