<template>
  <div class="w-full date-range-select">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block mb-1 text-sm font-medium text-foreground"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 text-lg ml-0.5">*</span>
    </label>

    <!-- Date Range Input -->
    <div
      :class="[
        'relative flex items-center transition-all duration-200 rounded-xl shadow-md cursor-pointer',
        'focus-within:ring-1 focus-within:ring-ring focus-within:border border-primary bg-muted/20 hover:bg-muted/30',
        'h-11 text-base',
        {
          'cursor-not-allowed opacity-60': disabled,
          'bg-muted/30': readonly
        }
      ]"
      @click="toggleCalendar"
    >
      <!-- Calendar Icon -->
      <span class="pl-3 text-muted-foreground">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </span>

      <!-- Date Range Display -->
      <div class="flex-1 px-3 py-2 text-foreground">
        <div v-if="!fromDate && !toDate" class="text-muted-foreground">
          {{ placeholder || 'Select date range...' }}
        </div>
        <div v-else class="flex items-center gap-2">
          <span class="text-sm">
            {{ formatDate(fromDate) }}
          </span>
          <span class="text-muted-foreground">→</span>
          <span class="text-sm">
            {{ formatDate(toDate) }}
          </span>
        </div>
      </div>

      <!-- Clear Button -->
      <button
        v-if="fromDate || toDate"
        @click.stop="clearDates"
        class="pr-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Calendar Popup -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[320px] left-0"
    >
      <!-- Calendar Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 class="text-sm font-semibold text-foreground">
          {{ currentMonthYear }}
        </h3>
        <button
          @click="nextMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Week Days -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-xs font-medium text-muted-foreground text-center py-1"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="date in calendarDates"
          :key="date.key"
          @click="selectDate(date)"
          :class="[
            'text-sm text-center py-2 rounded-lg cursor-pointer transition-colors',
            {
              'text-muted-foreground': !date.isCurrentMonth,
              'hover:bg-primary/10': date.isCurrentMonth && !isDateSelected(date),
              'bg-primary text-white': isDateSelected(date),
              'bg-primary/20 text-primary': isDateInRange(date),
              'ring-2 ring-primary ring-offset-2': isDateSelected(date)
            }
          ]"
        >
          {{ date.day }}
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex gap-2 mt-4 pt-4 border-t border-gray-200">
        <button
          @click="setQuickRange('today')"
          :class="[
            'flex-1 px-3 py-2 text-xs rounded-lg transition-colors',
            quickRangeType === 'today' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          ]"
        >
          Today
        </button>
        <button
          @click="setQuickRange('week')"
          :class="[
            'flex-1 px-3 py-2 text-xs rounded-lg transition-colors',
            quickRangeType === 'week' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          ]"
        >
          This Week
        </button>
        <button
          @click="setQuickRange('month')"
          :class="[
            'flex-1 px-3 py-2 text-xs rounded-lg transition-colors',
            quickRangeType === 'month' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          ]"
        >
          This Month
        </button>
      </div>

      <!-- Apply Button -->
      <div class="flex gap-2 mt-4">
        <button
          @click="applySelection"
          :disabled="!tempFromDate || !tempToDate"
          class="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Apply
        </button>
        <button
          @click="closeCalendar"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

interface DateRange {
  from: Date | null
  to: Date | null
}

interface CalendarDate {
  date: Date
  day: number
  isCurrentMonth: boolean
  key: string
}

const props = defineProps<{
  modelValue?: DateRange
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: string
  required?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateRange): void
}>()

// Reactive state
const isOpen = ref(false)
const currentDate = ref(new Date())
const fromDate = ref<Date | null>(props.modelValue?.from || null)
const toDate = ref<Date | null>(props.modelValue?.to || null)
const tempFromDate = ref<Date | null>(null)
const tempToDate = ref<Date | null>(null)
const quickRangeType = ref<'today' | 'week' | 'month' | null>(null)

// Computed properties
const inputId = `date-range-${Math.random().toString(36).substring(2, 10)}`

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDates = computed((): CalendarDate[] => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const dates: CalendarDate[] = []
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    dates.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      key: date.toISOString()
    })
  }
  
  return dates
})

// Methods
function toggleCalendar() {
  if (!props.disabled && !props.readonly) {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      tempFromDate.value = fromDate.value
      tempToDate.value = toDate.value
      quickRangeType.value = null
    }
  }
}

function closeCalendar() {
  isOpen.value = false
  tempFromDate.value = fromDate.value
  tempToDate.value = toDate.value
  quickRangeType.value = null
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function selectDate(date: CalendarDate) {
  if (!date.isCurrentMonth) return
  
  if (!tempFromDate.value || (tempFromDate.value && tempToDate.value)) {
    // Start new selection
    tempFromDate.value = date.date
    tempToDate.value = null
    quickRangeType.value = null
  } else {
    // Complete selection
    if (date.date < tempFromDate.value!) {
      tempToDate.value = tempFromDate.value
      tempFromDate.value = date.date
    } else {
      tempToDate.value = date.date
    }
    quickRangeType.value = null
  }
}

function isDateSelected(date: CalendarDate): boolean {
  return (
    (tempFromDate.value && isSameDay(date.date, tempFromDate.value)) ||
    (tempToDate.value && isSameDay(date.date, tempToDate.value))
  ) || false
}

function isDateInRange(date: CalendarDate): boolean {
  if (!tempFromDate.value || !tempToDate.value) return false
  return date.date >= tempFromDate.value && date.date <= tempToDate.value
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function clearDates() {
  fromDate.value = null
  toDate.value = null
  tempFromDate.value = null
  tempToDate.value = null
  quickRangeType.value = null
  emit('update:modelValue', { from: null, to: null })
  console.log('Dates cleared')
}

function applySelection() {
  if (tempFromDate.value && tempToDate.value) {
    fromDate.value = tempFromDate.value
    toDate.value = tempToDate.value
    emit('update:modelValue', {
      from: tempFromDate.value,
      to: tempToDate.value
    })
    console.log('Selected date range:', {
      from: formatDate(tempFromDate.value),
      to: formatDate(tempToDate.value),
      quickRangeType: quickRangeType.value
    })
    closeCalendar()
  }
}

function setQuickRange(type: 'today' | 'week' | 'month') {
  const today = new Date()
  quickRangeType.value = type
  
  switch (type) {
    case 'today':
      tempFromDate.value = today
      tempToDate.value = today
      break
    case 'week':
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      tempFromDate.value = startOfWeek
      tempToDate.value = today
      break
    case 'month':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      tempFromDate.value = startOfMonth
      tempToDate.value = today
      break
  }
  
  console.log('Quick range selected:', type, {
    from: formatDate(tempFromDate.value),
    to: formatDate(tempToDate.value)
  })
}

// Click outside to close
function handleClickOutside(event: Event) {
  const target = event.target as Element
  if (!target.closest('.date-range-select')) {
    closeCalendar()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    fromDate.value = newValue.from
    toDate.value = newValue.to
  }
}, { deep: true })
</script>

<style scoped>
.date-range-select {
  position: relative;
}
</style>
