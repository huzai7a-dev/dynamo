<template>
    <div class="flex flex-col">
        <UiSelect
            class="self-end border rounded border-gray-300"
            v-model="year"
            name="year"
            placeholder="Select a year"
            :options="yearsOptions"
        />
        <BaseChart
          :chartType="LineChart"
          :chartData="data"
          :chartOptions="options"
        />
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
        data: Array(12).fill(0).map(()=> Math.floor(Math.random() * 100)),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Vectors',
        data: Array(12).fill(0).map(()=> Math.floor(Math.random() * 100)),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      }
    ]
  };
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Monthly Graph'
      }
    }
  };

  //last 5 years
  const yearsOptions = Array.from({ length: 5 }, (_, index) => {
    const year = new Date().getFullYear() - index;
    return { label: year.toString(), value: year.toString() };
  })

  </script>
  