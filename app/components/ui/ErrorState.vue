<template>
  <div class="min-h-screen bg-light-gray flex items-center justify-center">
    <div class="container py-8">
      <div class="max-w-md mx-auto text-center">
        <div class="mb-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-secondary mb-2">{{ title }}</h2>
          <p class="text-charcoal/70 mb-6">{{ message }}</p>
        </div>
        
        <div class="space-y-3">
          <UiButton 
            v-if="showRetry"
            @click="onRetry" 
            :loading="loading" 
            variant="primary" 
            fullWidth
          >
            <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
            {{ retryText }}
          </UiButton>
          
          <UiButton 
            v-if="backRoute"
            @click="navigateTo(backRoute)" 
            variant="outline" 
            fullWidth
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            {{ backText }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  showRetry?: boolean
  retryText?: string
  backRoute?: string
  backText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: 'We encountered an error while loading the content. Please try again.',
  showRetry: true,
  retryText: 'Try Again',
  backText: 'Go Back',
  loading: false
})

const emit = defineEmits<{
  retry: []
}>()

const onRetry = () => {
  emit('retry')
}
</script>
