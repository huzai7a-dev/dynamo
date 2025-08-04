<template>
  <div class="p-6 space-y-6">
    <h1></h1>
    <h1 class="text-2xl font-semibold">Welcome {{ (user as IUser).fullName }}</h1>

    <!-- Top Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    <StatCard icon="Rows3" label="Orders" value="12" />
    <StatCard icon="Quote" label="Quotes" value="5" />
    <StatCard icon="PenTool" label="Vectors" value="3" />
    <StatCard icon="DollarSign" label="Amount" value="$120" />
  </div>

    <!-- Statistics Title -->
    <h2 class="text-xl font-medium">Statistics</h2>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 bg-white p-4 rounded-xl shadow">
      <MonthlyLineChart />
    </div>
    <div class="bg-white p-4 rounded-xl shadow">
      <SubDonutChart />
    </div>
  </div>

  </div>
</template>

<script setup lang="ts">
import type { IUser } from "~~/shared/types";

const { user } = useUserSession();

definePageMeta({
  layout: "portal",
  middleware: ["auth"],
});
</script>
