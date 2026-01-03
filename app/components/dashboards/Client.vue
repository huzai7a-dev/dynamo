<template>
    <div class="p-6 space-y-6">
        <h1 class="text-2xl font-semibold">Welcome {{ (user as IUser).fullName }}</h1>

        <!-- Top Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon="Rows3" label="Orders" :value="data?.orders ?? 0" />
            <StatCard icon="Quote" label="Quotes" :value="data?.quotes ?? 0" />
            <StatCard icon="PenTool" label="Vectors" :value="data?.vectors ?? 0" />
            <StatCard icon="DollarSign" label="Amount" :value="data?.amount ?? 0" />
        </div>

        <!-- Statistics Title -->
        <h2 class="text-xl font-medium">Statistics</h2>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white p-4 rounded-xl shadow">
                <MonthlyLineChart />
            </div>
            <div class="bg-white p-4 rounded-xl shadow">
                <SubDonutChart v-if="!pending && !error && donutData" :data="donutData" />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">

interface DashboardResponse {
    orders: number;
    quotes: number;
    vectors: number;
    amount: number;
}

const { user } = useUserSession();

const { data, pending, error } = useFetch<DashboardResponse>("/api/dashboard/stats", {
    method: "GET",
    lazy: true,
    server: true,
    keepalive: true,
})

const donutData = computed(() => {
    return [data.value?.orders ?? 0, data.value?.vectors ?? 0, data.value?.quotes ?? 0]
})

</script>