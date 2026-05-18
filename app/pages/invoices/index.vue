<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex shrink-0 justify-between items-center">
      <h3 class="text-2xl font-black text-secondary tracking-tight">Invoice</h3>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-24">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center p-4">
      <div class="bg-rose-50 text-rose-600 p-8 rounded-3xl border border-rose-100 text-center max-w-md shadow-sm">
        <Icon name="AlertCircle" class="w-12 h-12 mx-auto mb-4" />
        <h3 class="font-bold text-lg mb-2 italic">Error Loading Invoices</h3>
        <p class="text-sm opacity-80 font-medium">We couldn't retrieve your unpaid items. Please try refreshing the page or contact support.</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="allItems.length === 0" class="flex items-center justify-center py-24">
        <div class="bg-white rounded-[3rem] border border-slate-200 p-20 text-center shadow-xl max-w-lg animate-in zoom-in-95 duration-700">
          <div class="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
            <Icon name="Check" class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-3xl font-black text-secondary mb-4 italic tracking-tight">NO PENDING ITEMS</h3>
          <p class="text-charcoal/50 font-medium leading-relaxed">
            You're all caught up! There are no unpaid orders or vectors in your account at the moment.
          </p>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg border-2 border-primary overflow-hidden">
        <table class="min-w-full table-auto border-collapse text-sm font-sans">
          <!-- Header -->
          <thead class="bg-primary">
            <tr>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">S#</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Number</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Date</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Design Name</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Price</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">
                <!-- Master checkbox -->
                <input
                  type="checkbox"
                  :checked="allChecked"
                  :indeterminate="someChecked && !allChecked"
                  class="w-4 h-4 accent-white cursor-pointer"
                  @change="toggleAll"
                />
              </th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-white uppercase tracking-widest">Price Status</th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody>
            <tr
              v-for="(item, index) in allItems"
              :key="`${item.type}-${item.id}`"
              class="bg-white border-b border-primary-light/30 last:border-b-0 hover:bg-primary-light/10 transition-colors duration-150"
            >
              <td class="px-5 py-4 text-center text-sm text-gray-500">{{ index + 1 }}</td>
              <td class="px-5 py-4 text-center text-sm font-black text-secondary tracking-tight">
                {{ item.type === 'order' ? 'OR' : 'VR' }}-{{ item.id }}
              </td>
              <td class="px-5 py-4 text-center text-xs text-gray-500">{{ formatDate(item.createdAt) }}</td>
              <td class="px-5 py-4 text-center text-sm font-bold text-secondary">{{ item.name }}</td>
              <td class="px-5 py-4 text-center text-sm font-black text-primary italic">
                {{ item.price === '0.00' ? 'Free' : `$${Number(item.price).toFixed(2)}` }}
              </td>
              <td class="px-5 py-4 text-center">
                <input
                  type="checkbox"
                  :checked="checkedIds.has(`${item.type}-${item.id}`)"
                  class="w-4 h-4 accent-primary cursor-pointer"
                  @change="toggleItem(item)"
                />
              </td>
              <td class="px-5 py-4 text-center">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Payable
                </span>
              </td>
            </tr>

            <!-- Total Row -->
            <tr class="bg-slate-50 border-t-2 border-primary/20">
              <td colspan="3" class="px-5 py-4"></td>
              <td class="px-5 py-4 text-center text-sm font-black text-secondary uppercase tracking-wider">
                Total Payable Amount
              </td>
              <td class="px-5 py-4 text-center text-base font-black text-primary italic">
                ${{ selectedTotal.toFixed(2) }}
              </td>
              <td colspan="2" class="px-5 py-4"></td>
            </tr>
          </tbody>
        </table>

        <!-- Generate Button Row -->
        <div class="bg-white border-t border-primary/10 p-4 flex justify-center">
          <button
            @click="generateInvoice"
            :disabled="creatingInvoice || checkedIds.size === 0"
            class="px-10 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg uppercase tracking-widest text-sm flex items-center gap-3 shadow-lg shadow-emerald-600/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            <Icon v-if="creatingInvoice" name="RefreshCw" class="w-4 h-4 animate-spin" />
            <Icon v-else name="FileText" class="w-4 h-4" />
            {{ creatingInvoice ? 'Generating...' : 'Generate Invoice for payment' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: "portal",
  middleware: ["auth"],
});

const router = useRouter();
const toast = useToast();
const { data, pending, error } = await useFetch<any>('/api/user/unpaid-items');

const allItems = computed(() => data.value?.items || []);

// Track checked state using a Set of "type-id" keys
const checkedIds = reactive(new Set<string>());

// Initialize all items as checked when data loads
watch(allItems, (items) => {
  checkedIds.clear();
  items.forEach((item: any) => checkedIds.add(`${item.type}-${item.id}`));
}, { immediate: true });

const allChecked = computed(() => allItems.value.length > 0 && checkedIds.size === allItems.value.length);
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
    allItems.value.forEach((item: any) => checkedIds.add(`${item.type}-${item.id}`));
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
    await $fetch('/api/invoices/create', {
      method: 'POST',
      body: { items: itemsPayload },
    });

    toast.success('Invoice generated successfully!');
    await router.push('/invoices/unpaid');
  } catch (err: any) {
    console.error(err);
    toast.error(err.data?.message || 'Failed to generate invoice');
  } finally {
    creatingInvoice.value = false;
  }
};

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