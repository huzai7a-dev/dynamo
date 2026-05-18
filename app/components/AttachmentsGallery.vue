<script setup lang="ts">
import type { Attachment } from '~~/shared/types';

defineProps<{
  attachments: Attachment[]
  title?: string
  noAttachmentsMessage?: string
}>()

const IMAGE_FORMATS = new Set(['jpg','jpeg','png','webp','gif','avif','bmp','tiff','svg'])
const isImage = (a: any) => (a.resource_type || '').toLowerCase() === 'image' || IMAGE_FORMATS.has((a.format || '').toLowerCase())

const humanBytes = (n?: number | null) => {
  if (!n || n <= 0) return '—'
  const units = ['B','KB','MB','GB','TB']
  const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1)
  const val = n / Math.pow(1024, i)
  return `${val.toFixed(val >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

const filenameFromUrl = (url: string) => {
  try {
    const u = new URL(url)
    const last = u.pathname.split('/').filter(Boolean).pop() || ''
    return decodeURIComponent(last) || 'file'
  } catch {
    const last = url.split('?')[0].split('/').pop() || ''
    return decodeURIComponent(last) || 'file'
  }
}
</script>

<template>
  <div>
    <h2 class="mb-4 text-lg font-semibold text-secondary">{{ title || 'Attachments' }}</h2>

    <div v-if="!attachments || attachments.length === 0"
         class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-charcoal/70">
      {{ noAttachmentsMessage || 'No attachments uploaded yet.' }}
    </div>

    <!-- Further shrink size: grid-cols-2 to grid-cols-6 -->
    <div v-else class="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <article v-for="(a, idx) in attachments" :key="idx"
        class="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">

        <!-- PREVIEW -->
        <div class="relative w-full bg-slate-50 aspect-video">
          <!-- image -->
          <NuxtImg v-if="isImage(a)" :src="a.url" :alt="filenameFromUrl(a.url)"
            class="absolute inset-0 h-full w-full object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw" loading="lazy" />

          <!-- file placeholder -->
          <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
            <div class="grid h-8 w-8 place-items-center rounded-lg bg-primary-light text-primary-dark">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4" fill="none"
                stroke="currentColor" stroke-width="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
            <div class="text-[9px] uppercase font-bold text-charcoal/70">{{ a.format || 'file' }}</div>
          </div>
        </div>

        <!-- BODY: Ultra-compact -->
        <div class="p-2">
          <div class="truncate text-[10px] font-bold text-secondary" :title="filenameFromUrl(a.url)">
            {{ filenameFromUrl(a.url) }}
          </div>
          <div class="mt-1 flex items-center gap-1 text-[9px] text-charcoal/50">
            <span class="rounded bg-slate-100 px-1 py-0.5 uppercase font-medium">
              {{ a.format || (isImage(a) ? 'img' : 'file') }}
            </span>
            <span class="truncate">{{ humanBytes(a.bytes) }}</span>
          </div>
        </div>

        <!-- FOOTER: Ultra-compact -->
        <div class="mt-auto flex items-center justify-between border-t border-slate-200 bg-slate-50/40 p-2">
          <a :href="a.url" :download="filenameFromUrl(a.url)" target="_blank" rel="noopener"
            class="w-full inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-2 py-1 text-[9px] font-bold text-white transition hover:bg-primary-dark">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            Download
          </a>
        </div>
      </article>
    </div>
  </div>
</template>
