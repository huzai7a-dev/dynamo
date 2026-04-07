<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-col gap-0.5">
      <div class="flex items-center gap-2">
        <Icon name="PieChart" class="text-primary-dark w-5 h-5" />
        <h2 class="text-xl font-extrabold text-primary-dark font-sans leading-tight">Distribution Overview</h2>
      </div>
      <p class="text-sm text-muted font-sans pl-7">Comprehensive breakdown of all metrics</p>
    </div>

    <!-- Custom legend pills -->
    <div class="flex flex-wrap gap-2 pl-1">
      <span v-for="(item, i) in legendItems" :key="i"
        class="flex items-center gap-1 px-3 py-1 rounded-badge border border-gray-200 text-sm font-semibold text-gray-700 font-sans bg-white">
        <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: item.color }" />
        {{ item.label }}: {{ props.data?.[i] ?? 0 }}
      </span>
    </div>

    <!-- Chart -->
    <BaseChart :chartType="DoughnutChart" :chartData="chartData" :chartOptions="options" />
  </div>
</template>

<script lang="ts" setup>
import { Doughnut as DoughnutChart } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';
import BaseChart from './ui/BaseChart.vue';

interface Props {
  data: number[]
}

const props = defineProps<Props>();

const COLORS = {
  orders: '#003438',
  vectors: '#16A249',
  quotes: '#FACC14',
}

const legendItems = [
  { label: 'Orders', color: COLORS.orders },
  { label: 'Vectors', color: COLORS.vectors },
  { label: 'Quotes', color: COLORS.quotes },
]

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: ['Orders', 'Vectors', 'Quotes'],
  datasets: [
    {
      label: 'Total',
      data: props.data?.length ? props.data : [1, 1, 1],
      backgroundColor: [COLORS.orders, COLORS.vectors, COLORS.quotes],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 4,
    }
  ]
}));

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      backgroundColor: '#003438',
      titleFont: { family: 'Manrope, Inter, sans-serif', size: 12 },
      bodyFont: { family: 'Manrope, Inter, sans-serif', size: 12 },
      padding: 10,
      cornerRadius: 8,
    }
  }
};
</script>