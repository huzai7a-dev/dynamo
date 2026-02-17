<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h3 class="text-2xl font-bold text-gray-900">Unpaid Invoices</h3>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg">
            Failed to load items. Please try again.
        </div>

        <div v-else class="space-y-8">

            <div v-if="allItems.length > 0"
                class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h4 class="font-semibold text-gray-700">Unpaid Items ({{ allItems.length }})</h4>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type</th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name</th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date</th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="item in allItems" :key="`${item.type}:${item.id}`">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                                        :class="item.type === 'order' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                                        {{ item.type }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ item.name }}
                                    <span class="text-xs text-gray-500 block">ID: #{{ item.id }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(item.date)
                                    }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ item.price }}</td>
                            </tr>
                        </tbody>
                        <tfoot class="bg-gray-50">
                            <tr>
                                <td colspan="3" class="px-6 py-4 text-right font-medium text-gray-900">Total Amount:
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-lg font-bold text-primary">${{
                                    totalAmount.toFixed(2) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Icon name="CheckCircle" class="mx-auto h-12 w-12 text-green-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No pending invoices</h3>
                <p class="mt-1 text-sm text-gray-500">Great job! You have no unpaid items.</p>
            </div>

            <!-- Action Bar -->
            <div v-if="allItems.length > 0"
                class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50 md:pl-64">
                <div class="max-w-7xl mx-auto flex justify-end items-center">
                    <button @click="generateInvoice" :disabled="creatingInvoice"
                        class="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                        <span v-if="creatingInvoice" class="mr-2">Processing...</span>
                        Generate Invoice
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
    layout: "portal",
    middleware: ["auth"],
});

const router = useRouter();
const toast = useToast();
const { data, pending, error } = await useFetch('/api/user/unpaid-items');

const allItems = computed(() => {
    const items = [];
    if (data.value?.orders) {
        items.push(...data.value.orders.map(o => ({ ...o, type: 'order', name: o.orderName, date: o.createdAt })));
    }
    if (data.value?.vectors) {
        items.push(...data.value.vectors.map(v => ({ ...v, type: 'vector', name: v.vectorName, date: v.createdAt })));
    }
    // Sort by date desc
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const totalAmount = computed(() => {
    return allItems.value.reduce((sum, item) => sum + Number(item.price || 0), 0);
});

const creatingInvoice = ref(false);

const generateInvoice = async () => {
    creatingInvoice.value = true;

    // Send all items
    const itemsPayload = allItems.value.map(item => ({
        type: item.type,
        id: Number(item.id)
    }));

    try {
        const invoice = await $fetch('/api/invoices/create', {
            method: 'POST',
            body: { items: itemsPayload }
        });

        toast.success(`Invoice generated successfully!`);
        await router.push(`/invoices/${invoice.transactionRef}`);

    } catch (err: any) {
        console.error(err);
        toast.error(err.data?.message || 'Failed to generate invoice');
    } finally {
        creatingInvoice.value = false;
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
};
</script>