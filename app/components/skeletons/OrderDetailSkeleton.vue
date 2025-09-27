<template>
  <div class="min-h-screen bg-light-gray">
    <div class="container py-8">
      <!-- Header Skeleton -->
      <OrderHeaderSkeleton />

      <!-- Main Content Skeleton -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Details Skeleton -->
          <OrderDetailsSkeleton />

          <!-- Attachments Skeleton -->
          <AttachmentsSkeleton />
        </div>

        <!-- Sidebar Skeleton -->
        <aside class="space-y-6">
          <!-- Summary Skeleton -->
          <SummarySkeleton />

          <!-- Notes Skeleton -->
          <NotesSkeleton />

          <!-- Actions Skeleton -->
          <ActionsSkeleton />
        </aside>
      </div>
    </div>ß
  </div>
</template>

<script setup lang="ts">
import ActionsSkeleton from './ActionsSkeleton.vue';
import AttachmentsSkeleton from './AttachmentsSkeleton.vue';
import NotesSkeleton from './NotesSkeleton.vue';
import OrderDetailsSkeleton from './OrderDetailsSkeleton.vue';
import OrderHeaderSkeleton from './OrderHeaderSkeleton.vue';
import SummarySkeleton from './SummarySkeleton.vue';

// This component serves as the main skeleton wrapper for order detail page
</script>
