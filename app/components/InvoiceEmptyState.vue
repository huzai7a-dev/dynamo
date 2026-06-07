<template>
  <div class="flex items-center justify-center py-16">
    <div
      class="bg-white rounded-2xl border border-slate-200 p-12 md:p-16 text-center shadow-sm max-w-xl w-full animate-in zoom-in-95 duration-700"
    >
      <!-- Illustration -->
      <div class="flex justify-center mb-8">
        <div class="relative w-56 h-44">
          <!-- Decorative sparkles / plus signs -->
          <svg class="absolute top-2 left-6 w-3 h-3 text-primary/30" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0v12M0 6h12" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
          <svg class="absolute top-0 right-10 w-3 h-3 text-primary/30" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0v12M0 6h12" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
          <svg class="absolute bottom-8 left-4 w-2.5 h-2.5 text-primary/20" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0v12M0 6h12" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
          <svg class="absolute bottom-12 right-4 w-2.5 h-2.5 text-primary/20" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0v12M0 6h12" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>

          <!-- Paper airplane -->
          <svg class="absolute top-1 right-2 w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <!-- Dotted circle decoration -->
          <svg class="absolute top-4 right-0 w-16 h-16 text-primary/10" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>
          </svg>

          <!-- Chevron arrows on left -->
          <svg class="absolute bottom-14 left-0 w-8 h-6 text-primary/15" viewBox="0 0 30 20" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M5 5l7 5-7 5" />
            <path d="M15 5l7 5-7 5" />
          </svg>

          <!-- Main envelope -->
          <svg class="mx-auto relative" width="160" height="130" viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Invoice document behind envelope -->
            <rect x="35" y="5" width="90" height="70" rx="6" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
            <!-- Document lines -->
            <line x1="50" y1="22" x2="110" y2="22" stroke="#d1fae5" stroke-width="3" stroke-linecap="round"/>
            <line x1="50" y1="32" x2="100" y2="32" stroke="#d1fae5" stroke-width="3" stroke-linecap="round"/>
            <line x1="50" y1="42" x2="90" y2="42" stroke="#d1fae5" stroke-width="3" stroke-linecap="round"/>
            <line x1="50" y1="52" x2="105" y2="52" stroke="#d1fae5" stroke-width="3" stroke-linecap="round"/>

            <!-- Dollar circle on document -->
            <circle cx="80" cy="38" r="15" fill="#dcfce7" stroke="#86efac" stroke-width="1.5"/>
            <text x="80" y="44" text-anchor="middle" fill="#16a34a" font-size="16" font-weight="bold">$</text>

            <!-- Envelope body -->
            <path d="M15 65 L80 100 L145 65 L145 125 C145 127.761 142.761 130 140 130 L20 130 C17.2386 130 15 127.761 15 125 L15 65Z" fill="#4ade80" opacity="0.9"/>
            <!-- Envelope front flap -->
            <path d="M15 65 L80 95 L145 65 L145 70 C145 72 143 74 141 75 L83 110 C81 111 79 111 77 110 L19 75 C17 74 15 72 15 70 L15 65Z" fill="#22c55e"/>
            <!-- Envelope shadow -->
            <path d="M20 130 L80 100 L140 130 L20 130Z" fill="#16a34a" opacity="0.3"/>
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-2xl font-black text-secondary mb-3 tracking-tight">{{ title }}</h3>

      <!-- Description -->
      <p class="text-charcoal/50 font-medium leading-relaxed mb-8 max-w-sm mx-auto">
        {{ description }}
      </p>

      <!-- Action Button -->
      <div v-if="actionLabel">
        <NuxtLink v-if="actionRoute" :to="actionRoute">
          <UiButton variant="primary" size="lg" :icon="actionIcon">
            {{ actionLabel }}
          </UiButton>
        </NuxtLink>
        <UiButton v-else variant="primary" size="lg" :icon="actionIcon" @click="$emit('action')">
          {{ actionLabel }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  actionLabel?: string
  actionIcon?: string
  actionRoute?: string
}>()

defineEmits<{
  action: []
}>()
</script>
