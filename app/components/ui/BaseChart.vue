<template>
    <component :is="chartType" :data="chartData" :options="chartOptions" />
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    ArcElement
  } from 'chart.js';
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    ArcElement
  );
  
  // Props
  defineProps<{
    chartType: any;
    chartData: any;
    chartOptions: any;
  }>();
  </script>
  