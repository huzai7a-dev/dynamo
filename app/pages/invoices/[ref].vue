<template>
    <div class="space-y-6">
        <!-- Back Button -->
        <div class="flex items-center">
            <button @click="$router.push('/invoices')"
                class="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                <Icon name="ArrowLeft" class="w-4 h-4 mr-1" />
                Back to Invoices
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
            <Icon name="AlertCircle" class="w-5 h-5 mr-2" />
            <span>Failed to load invoice. {{ error.message }}</span>
        </div>

        <div v-else class="max-w-4xl mx-auto space-y-8">

            <!-- Invoice Header -->
            <div
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Invoice</h1>
                    <p class="text-gray-500 mt-1 font-mono">#{{ invoice.transactionRef }}</p>
                    <div class="mt-4 flex items-center space-x-3">
                        <InvoiceStatusBadge :status="invoice.status" />
                        <span class="text-gray-400 text-sm flex items-center">
                            <Icon name="Calendar" class="w-4 h-4 mr-1" />
                            {{ formatDate(invoice.createdAt) }}
                        </span>
                    </div>
                </div>
                <div class="text-left md:text-right">
                    <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold">Total Amount</p>
                    <p class="text-4xl font-bold text-primary mt-1">${{ invoice.amount }}</p>
                    <p class="text-sm text-gray-400 mt-1 font-medium">{{ invoice.currency }}</p>
                </div>
            </div>

            <!-- Invoice Items -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
                    <Icon name="List" class="w-5 h-5 text-gray-500 mr-2" />
                    <h4 class="font-semibold text-gray-700">Items</h4>
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
                                    Description</th>
                                <th scope="col"
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="item in invoice.items" :key="`${item.type}:${item.id}`"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :class="item.type === 'order' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                                        {{ item.type }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name
                                }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">${{
                                    item.price }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" icon="RotateCcw" class="w-full justify-center">
                    Revert
                </Button>
                <Button variant="outline" icon="Eye" class="w-full justify-center">
                    Details
                </Button>
                <Button variant="outline" icon="Download" class="w-full justify-center">
                    PDF
                </Button>
                <Button variant="primary" icon="CreditCard"
                    class="w-full justify-center shadow-lg hover:shadow-xl transition-all">
                    Pay Now
                </Button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Icon from '~/components/Icon.vue';
import Button from '~/components/ui/Button.vue';
import InvoiceStatusBadge from '~/components/ui/InvoiceStatusBadge.vue';

definePageMeta({
    layout: "portal",
    middleware: ["auth"],
});


const route = useRoute();
const inVoiceRef = route.params.ref as string;

const { data: invoice, pending, error } = await useFetch(`/api/invoices/${inVoiceRef}`);

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>
