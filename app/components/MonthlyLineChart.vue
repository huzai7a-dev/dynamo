<template>
  <div class="flex flex-col gap-4">
    <!-- Header row: title+subtitle left, year selector right -->
    <div class="flex items-start justify-between w-full">
      <!-- Left: icon + title + subtitle -->
      <div class="flex flex-1 flex-col gap-0.5">
        <div class="flex items-center gap-2">
          <Icon name="TrendingUp" class="text-primary-dark w-5 h-5" />
          <h2 class="text-xl font-extrabold text-primary-dark font-sans leading-tight">Monthly Performance</h2>
        </div>
        <p class="text-sm text-muted font-sans pl-7">Real-time orders vs vectors comparison analysis</p>
      </div>
      <!-- Right: year selector -->
      <UiSelect class="!w-fit border border-gray-200 rounded-md text-sm text-gray-700 bg-white shadow-sm" v-model="year"
        name="year" placeholder="Select a year" :options="yearsOptions" />
    </div>
    <BaseChart :chartType="LineChart" :chartData="data" :chartOptions="options" />
  </div>
</template>

<script lang="ts" setup>
import { Line as LineChart } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';
import BaseChart from './ui/BaseChart.vue';

const year = ref(new Date().getFullYear().toString())

const data: ChartData<'line'> = {
  labels: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  datasets: [
    {
      label: 'Orders',
      data: Array(12).fill(0).map(() => Math.floor(Math.random() * 100)),
      borderColor: '#003438',
      backgroundColor: 'transparent',
      pointBackgroundColor: '#003438',
      pointBorderColor: '#003438',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      borderWidth: 2.5,
      fill: false,
    },
    {
      label: 'Vectors',
      data: Array(12).fill(0).map(() => Math.floor(Math.random() * 100)),
      borderColor: '#299BA3',
      backgroundColor: 'transparent',
      pointBackgroundColor: '#299BA3',
      pointBorderColor: '#299BA3',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      borderWidth: 2.5,
      fill: false,
    }
  ]
};

const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 24,
        font: {
          family: 'Manrope, Inter, sans-serif',
          size: 13,
        },
        color: '#374151',
      }
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#003438',
      titleFont: { family: 'Manrope, Inter, sans-serif', size: 12 },
      bodyFont: { family: 'Manrope, Inter, sans-serif', size: 12 },
      padding: 10,
      cornerRadius: 8,
    }
  },
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        font: { family: 'Manrope, Inter, sans-serif', size: 12 },
        color: '#6B7280',
      }
    },
    y: {
      border: { display: false, dash: [4, 4] },
      grid: {
        color: '#E5E7EB',
        lineWidth: 1,
      },
      ticks: {
        font: { family: 'Manrope, Inter, sans-serif', size: 12 },
        color: '#6B7280',
        stepSize: 25,
      },
      min: 0,
      max: 100,
    }
  }
};

const yearsOptions = Array.from({ length: 5 }, (_, index) => {
  const y = new Date().getFullYear() - index;
  return { label: y.toString(), value: y.toString() };
})
</script>