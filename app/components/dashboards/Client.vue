<template>
    <div class="space-y-6 py-2">

        <!-- ── Welcome Header ── -->
        <div class="space-y-1">
            <div class="flex items-center gap-2">
                <Icon name="Sparkles" class="text-primary w-7 h-7" />
                <h1 class="text-3xl font-extrabold text-primary-dark font-sans leading-tight">
                    Welcome {{ (user as IUser).fullName }}
                </h1>
            </div>
            <p class="text-sm text-muted font-sans pl-9">
                Your business intelligence dashboard
            </p>
        </div>

        <!-- ── Stat Cards ── -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon="Rows3" label="Orders" :value="data?.orders ?? 0" gradient="bg-gradient-card-dark" />
            <StatCard icon="Quote" label="Quotes" :value="data?.quotes ?? 0" gradient="bg-gradient-card-teal" />
            <StatCard icon="PenTool" label="Vectors" :value="data?.vectors ?? 0" gradient="bg-gradient-card-green" />
            <StatCard icon="DollarSign" label="Amount" :value="`$${data?.amount ?? 0}`"
                gradient="bg-gradient-card-orange" />
        </div>

        <!-- ── Analytics Section Header ── -->
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-extrabold text-primary-dark font-sans">Analytics Dashboard</h2>
            <span
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-badge border border-gray-200 bg-white text-xs font-semibold text-gray-600 font-sans shadow-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
                Real-time data
            </span>
        </div>

        <!-- ── Charts Grid ── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                <MonthlyLineChart />
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
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