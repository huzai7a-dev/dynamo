<template>
    <div class="space-y-8">
        <!-- Header -->
        <div>
            <h1 class="text-2xl font-semibold">Welcome, {{ (user as any)?.fullName }}</h1>
            <p class="text-muted-foreground text-sm mt-1">Here's an overview of your referred clients.</p>
        </div>

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div class="bg-primary/10 p-3 rounded-xl">
                    <Icon name="Users" class="w-6 h-6 text-primary" />
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Total Clients</p>
                    <p class="text-3xl font-bold text-gray-800">{{ dashboardData?.stats?.total_clients ?? 0 }}</p>
                </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div class="bg-green-100 p-3 rounded-xl">
                    <Icon name="Calendar" class="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Last 30 Days</p>
                    <p class="text-3xl font-bold text-gray-800">{{ dashboardData?.stats?.clients_last_30_days ?? 0 }}
                    </p>
                </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div class="bg-purple-100 p-3 rounded-xl">
                    <Icon name="Star" class="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Last 7 Days</p>
                    <p class="text-3xl font-bold text-gray-800">{{ dashboardData?.stats?.clients_last_7_days ?? 0 }}</p>
                </div>
            </div>
        </div>

        <!-- Clients Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Search + Date Filter Header -->
            <TableHeader title="Client" firstPlaceholder="Search by client name"
                secondPlaceholder="Search by client email" :searchOrderNumber="searchName"
                :searchOrderName="searchEmail" :selectedDateRange="dateRange" :isAdmin="false"
                @update:searchOrderNumber="searchName = $event" @update:searchOrderName="searchEmail = $event"
                @update:selectedDateRange="dateRange = $event">
                <!-- Hide the default create button -->
                <template #actions><span /></template>
            </TableHeader>

            <div class="p-6">
                <UiTable class="min-h-[400px]" :data="formattedClients" :columns="columns" :pagination="pagination"
                    :loading="pending" :error="!!error" @updatePage="currentPage = $event" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TableHeader from '~/components/TableHeader.vue';

interface SalesmanStats {
    total_clients: number;
    clients_last_30_days: number;
    clients_last_7_days: number;
}

interface ClientRow {
    id: number;
    userName: string;
    contactName: string;
    companyName: string;
    email: string;
    phone: string;
    location: string;
    registeredAt: string;
}

interface Pagination {
    currentPage: number;
    totalPage: number;
}

interface SalesmanDashboardResponse {
    success: boolean;
    data: {
        stats: SalesmanStats;
        pagination: Pagination;
        clients: ClientRow[];
    };
}

const { user } = useUserSession();

// Filters
const currentPage = ref(1);
const searchName = ref('');
const searchEmail = ref('');
const dateRange = ref<{ from: Date | null; to: Date | null }>({ from: null, to: null });

// Reset to page 1 when any filter changes
watch([searchName, searchEmail, dateRange], () => { currentPage.value = 1; });

const params = computed(() => ({
    page: currentPage.value,
    name: searchName.value || undefined,
    email: searchEmail.value || undefined,
    ...(dateRange.value.from && { date_from: dateRange.value.from.toISOString().split('T')[0] }),
    ...(dateRange.value.to && { date_to: dateRange.value.to.toISOString().split('T')[0] }),
}));

const debounceParams = ref(useDebounce(params, 500));

const { data: response, pending, error } = useFetch<SalesmanDashboardResponse>('/api/salesmen/clients', {
    params: debounceParams,
});

const dashboardData = computed(() => response.value?.data ?? null);
const pagination = computed(() => dashboardData.value?.pagination ?? { currentPage: 1, totalPage: 1 });

const columns = [
    { key: 'serial_number', label: '#' },
    { key: 'contactName', label: 'Contact Name' },
    { key: 'companyName', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'location', label: 'Location' },
    { key: 'registeredAt', label: 'Registered' },
];

const formattedClients = computed(() =>
    (dashboardData.value?.clients ?? []).map((c, idx) => ({
        ...c,
        serial_number: ((pagination.value.currentPage - 1) * 10) + idx + 1,
        phone: c.phone || '—',
        location: c.location || '—',
        registeredAt: c.registeredAt
            ? new Date(c.registeredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : '—',
    }))
);
</script>
