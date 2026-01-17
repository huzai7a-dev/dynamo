<template>
    <div class="min-h-screen">
        <!-- Search Section -->
        <div
            class="grid grid-cols-1 md:grid-cols-3 mb-8 gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div v-for="config in searchConfigs" :key="config.type" class="space-y-3">
                <label class="text-sm font-bold text-gray-700 uppercase tracking-tight">{{ config.label }}</label>
                <div class="flex gap-2">
                    <Input v-model="config.model.value" placeholder="Search..." class="flex-1" size="sm" />
                    <Button rounded variant="primary" size="sm" class="px-6"
                        @click="handleSearch(config.type, config.model.value)">Search</Button>
                </div>
            </div>
        </div>

        <!-- Options Section -->
        <div
            class="grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
            <div v-for="(group, index) in dashboardConfig" :key="group.title"
                class="flex flex-col border-r border-gray-100 lg:border-gray-200 last:border-r-0">
                <div class="bg-[#f8f9fa] px-6 py-4 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800 tracking-tight">{{ group.title }}</h2>
                </div>
                <div class="p-4 space-y-1">
                    <button v-for="option in group.options" :key="option.id" @click="selectOption(group.type, option)"
                        :class="[
                            'w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 flex justify-between items-center group',
                            activeOption?.id === option.id
                                ? 'bg-primary/10 text-primary font-bold shadow-sm'
                                : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                        ]">
                        <span class="text-[0.95rem]">{{ option.label }}</span>
                        <Icon name="ChevronRight"
                            class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Table Section Placeholder -->
        <div v-if="activeOption" class="mt-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <UiTable class="h-[calc(100vh-500px)]" :loading="isLoading" :data="data" :columns="columns" infinite-scroll
                :pagination="pagination" @load-more="loadMore"
                @row-click="$router.push(`/${activeOption.type}s/${$event.row.id}`)">
                <template #column-serial_number="{ index }">
                    <span class="text-primary font-semibold">{{ index + 1 }}</span>
                </template>

                <template #column-status="{ row }">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        :class="getOrderStatusBadgeClass((row as TableOrders).status)">
                        {{ formatOrderStatus((row as TableOrders).status) }}
                    </span>
                </template>

                <template #column-payment_status="{ row }">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        :class="getPaymentStatusBadgeClass((row as TableOrders).payment_status)">
                        {{ formatPaymentStatus((row as TableOrders).payment_status) }}
                    </span>
                </template>

                <template #column-created_at="{ row }">
                    <span class="text-primary font-semibold">{{ formateDate((row as TableOrders).created_at) }}</span>
                </template>

                <template #column-rush="{ row }">
                    <span class="text-primary font-semibold">{{ row.rush === "Yes" ? 'New/Rush' : 'New' }}</span>
                </template>

                <template #column-q_type="{ row }">
                    <span class="text-primary font-semibold">{{ row?.q_type?.toUpperCase() }}</span>
                </template>
            </UiTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import Icon from '../Icon.vue'
import { DataSource, OrderStatus, QuoteStatus } from '../../../shared/types/enums'
import type { OrderResponse, TableOrders, Pagination } from '~~/shared/types'

// Types
interface Option {
    id: string
    label: string
    action: string
    type: DataSource // The generic type is implicit via DataSource usage
}

interface SearchConfig {
    label: string
    type: DataSource
    model: Ref<string>
}

interface DataGroup {
    title: string
    type: DataSource
    options: Option[]
}

// State
const searchQuotes = ref('')
const searchOrders = ref('')
const searchVectors = ref('')

const activeOption = ref<Option & { type: DataSource } | null>(null)
const isLoading = ref(false)
const data = ref<TableOrders[] | any[]>([]) // Use Union or any if types are mixed
const pagination = ref<Pagination>({ currentPage: 1, totalPage: 1 })

// Configuration
const searchConfigs: SearchConfig[] = [
    { label: 'Quote Number', type: DataSource.QUOTE, model: searchQuotes },
    { label: 'Order Number', type: DataSource.ORDER, model: searchOrders },
    { label: 'Vector Number', type: DataSource.VECTOR, model: searchVectors }
]

const dashboardConfig: DataGroup[] = [
    {
        title: 'Quotes',
        type: DataSource.QUOTE,
        options: [
            { id: 'q1', label: "Today's Quotes", action: 'fetchToday', type: DataSource.QUOTE },
            { id: 'q2', label: 'Ready Quotes', action: 'fetchReady', type: DataSource.QUOTE },
            { id: 'q3', label: 'All Quotes', action: 'fetchAll', type: DataSource.QUOTE },
            { id: 'q4', label: 'Convert to Order', action: 'convert', type: DataSource.QUOTE },
        ]
    },
    {
        title: 'Orders',
        type: DataSource.ORDER,
        options: [
            { id: 'o1', label: "Today's Orders", action: 'fetchToday', type: DataSource.ORDER },
            { id: 'o2', label: 'Ready Orders', action: 'fetchReady', type: DataSource.ORDER },
            { id: 'o3', label: 'All Orders', action: 'fetchAll', type: DataSource.ORDER },
            { id: 'o4', label: 'Orders with price 0', action: 'fetchPrice0', type: DataSource.ORDER },
            { id: 'o5', label: 'Orders with Price', action: 'fetchWithPrice', type: DataSource.ORDER },
        ]
    },
    {
        title: 'Vectors',
        type: DataSource.VECTOR,
        options: [
            { id: 'v1', label: "Today's Vector", action: 'fetchToday', type: DataSource.VECTOR },
            { id: 'v2', label: 'Ready Vector', action: 'fetchReady', type: DataSource.VECTOR },
            { id: 'v3', label: 'All vectors', action: 'fetchAll', type: DataSource.VECTOR },
            { id: 'v4', label: 'Vectors with price 0$', action: 'fetchPrice0', type: DataSource.VECTOR },
            { id: 'v5', label: 'vectors with Price', action: 'fetchWithPrice', type: DataSource.VECTOR },
        ]
    }
]

// Column Definitions
const columnDefinitions: Record<DataSource, any[]> = {
    [DataSource.QUOTE]: [
        { key: 'serial_number', label: 'S.No' },
        { key: 'id', label: 'Order Number' },
        { key: 'title', label: 'Order Name' },
        { key: 'rush', label: 'Order Type' },
        { key: 'customer_name', label: 'Customer Name' },
        { key: 'customer_email', label: 'Customer Email' },
        { key: 'status', label: 'Order Status' },
        { key: 'q_type', label: 'Quote Type' },
        { key: 'created_at', label: 'Date' },
    ],
    [DataSource.ORDER]: [
        { key: 'serial_number', label: 'S.No' },
        { key: 'id', label: 'Order Number' },
        { key: 'order_name', label: 'Order Name' },
        { key: 'rush', label: 'Order Type' },
        { key: 'customer_name', label: 'Customer Name' },
        { key: 'customer_email', label: 'Customer Email' },
        { key: 'status', label: 'Order Status' },
        { key: 'payment_status', label: 'Payment Status' },
        { key: 'created_at', label: 'Date' },
    ],
    [DataSource.VECTOR]: [
        { key: 'serial_number', label: 'S.No' },
        { key: 'id', label: 'Order Number' },
        { key: 'vector_name', label: 'Order Name' },
        { key: 'rush', label: 'Order Type' },
        { key: 'customer_name', label: 'Customer Name' },
        { key: 'customer_email', label: 'Customer Email' },
        { key: 'status', label: 'Order Status' },
        { key: 'payment_status', label: 'Payment Status' },
        { key: 'created_at', label: 'Date' },
    ],
    [DataSource.ALL]: [] // Fallback or unused
}

const columns = computed(() => {
    if (!activeOption.value) return []
    return columnDefinitions[activeOption.value.type] || []
})


const handleSearch = async (type: DataSource, search: string) => {
    if (type === DataSource.ORDER || type === DataSource.VECTOR || type === DataSource.QUOTE) {
        if (!search.trim()) return

        activeOption.value = { id: 'search', label: `Search: ${search}`, action: 'search', type }
        isLoading.value = true
        data.value = []
        pagination.value = { currentPage: 1, totalPage: 1 }

        await fetchData(false, type)
        isLoading.value = false
    } else {
        console.log(`Search for ${type} not implemented yet`)
    }
}

const selectOption = async (type: DataSource, option: Option) => {
    activeOption.value = { ...option, type }

    if ([DataSource.ORDER, DataSource.VECTOR, DataSource.QUOTE].includes(type)) {
        isLoading.value = true
        data.value = []
        pagination.value = { currentPage: 1, totalPage: 1 }

        await fetchData(false, type)
        isLoading.value = false
    } else {
        console.log(`Fetching data for ${type}: ${option.action} (Not implemented yet)`)
    }
}

const loadMore = async () => {
    if (isLoading.value || pagination.value.currentPage >= pagination.value.totalPage || !activeOption.value) return

    pagination.value.currentPage++
    isLoading.value = true
    await fetchData(true, activeOption.value.type)
    isLoading.value = false
}

const fetchData = async (append = false, type: DataSource) => {
    if (!activeOption.value) return

    const params: any = {
        page: pagination.value.currentPage,
        limit: 10
    }

    if (activeOption.value.action === 'search') {
        const searchVal = type === DataSource.ORDER ? searchOrders.value : type === DataSource.VECTOR ? searchVectors.value : searchQuotes.value
        params.order_number = searchVal
    } else {
        const today = new Date().toISOString().split('T')[0]

        switch (activeOption.value.action) {
            case 'fetchToday':
                params.date_from = today
                params.date_to = today
                break
            case 'fetchReady':
                params.status = OrderStatus.DELIVERED
                break
            case 'convert':
                params.status = QuoteStatus.PROCEED
                break
            case 'fetchPrice0':
                params.is_free = true
                break
            case 'fetchWithPrice':
                params.is_paid = true
                break
            case 'fetchAll':
            default:
                break
        }
    }

    const urlMap: Record<DataSource, string> = {
        [DataSource.ORDER]: 'orders',
        [DataSource.VECTOR]: 'vectors',
        [DataSource.QUOTE]: 'quotes',
        [DataSource.ALL]: 'orders'
    }

    const url = `/api/${urlMap[type]}`

    try {
        const response = await $fetch<{ data: any }>(url, {
            method: 'GET',
            query: params,
        })

        let tableData: any[] = []
        if (type === DataSource.ORDER && 'orders' in response.data) {
            tableData = response.data.orders
        } else if (type === DataSource.VECTOR && 'vectors' in response.data) {
            tableData = response.data.vectors
        } else if (type === DataSource.QUOTE && 'quotes' in response.data) {
            tableData = response.data.quotes
        }

        if (append) {
            data.value = [...data.value, ...tableData]
        } else {
            data.value = tableData
        }

        pagination.value = response.data.pagination
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}
</script>

<style scoped>
.animate-in {
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-fill-mode: forwards;
}

@keyframes slide-in-from-bottom {
    from {
        transform: translateY(1rem);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.slide-in-from-bottom-4 {
    animation-name: slide-in-from-bottom;
}
</style>
