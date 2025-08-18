<script setup lang="ts">
const props = defineProps<{
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'completed' | string
}>()

const map = {
  pending:   'bg-amber-100 text-amber-800 border-amber-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  approved:  'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected:  'bg-rose-100 text-rose-800 border-rose-200',
  completed: 'bg-primary-light text-primary-dark border-teal-200'
} as Record<string, string>

const label = (s: string) => s
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium"
    :class="map[status] ?? 'bg-slate-100 text-slate-700 border-slate-200'"
  >
    <span class="h-1.5 w-1.5 rounded-full"
          :class="{
            'bg-amber-500': status==='pending',
            'bg-blue-500': status==='in_progress',
            'bg-emerald-500': status==='approved',
            'bg-rose-500': status==='rejected',
            'bg-teal-600': status==='completed'
          }"/>
    {{ label(status) }}
  </span>
</template>
