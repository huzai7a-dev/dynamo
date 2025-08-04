<template>
    <BaseChart
      :chartType="DoughnutChart"
      :chartData="data"
      :chartOptions="options"
    />
  </template>
  
  <script lang="ts" setup>
  import { Doughnut as DoughnutChart } from 'vue-chartjs';
  import type { ChartData, ChartOptions } from 'chart.js';
  import BaseChart from './ui/BaseChart.vue';
  
  const data: ChartData<'doughnut'> = {
    labels: ['Order', 'Vector', 'Quote'],
    datasets: [
      {
        label: 'Total',
        data: [25, 10, 5],
        backgroundColor: [
          'oklch(70.7% 0.165 254.624)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(251, 191, 36, 0.6)'
        ],
        borderColor: ['#155dfc', '#22c55e', '#fbbf24'],
        borderWidth: 1
      }
    ]
  };
  
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Sub Graph'
      }
    }
  };
  </script>
  