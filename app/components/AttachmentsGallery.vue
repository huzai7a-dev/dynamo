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

    <!-- KEY: auto-rows-fr + cards are h-full -->
    <div v-else class="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="(a, idx) in attachments" :key="idx"
               class="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <!-- PREVIEW: same height for images & files -->
        <div class="relative w-full bg-slate-50 aspect-video">
          <!-- image -->
          <NuxtImg v-if="isImage(a)"
                   :src="a.url"
                   :alt="filenameFromUrl(a.url)"
                   class="absolute inset-0 h-full w-full object-cover"
                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                   loading="lazy" />

          <!-- file placeholder -->
          <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div class="grid h-14 w-14 place-items-center rounded-2xl bg-primary-light text-primary-dark">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
              </svg>
            </div>
            <div class="text-xs uppercase text-charcoal/70">{{ a.format || 'file' }}</div>
            <div class="text-xs text-charcoal/60">{{ humanBytes(a.bytes) }}</div>
          </div>
        </div>

        <!-- BODY -->
        <div class="p-4">
          <div class="truncate text-sm font-medium text-secondary">{{ filenameFromUrl(a.url) }}</div>
          <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-charcoal/70">
            <span class="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 uppercase">
              {{ a.format || (isImage(a) ? 'img' : 'file') }}
            </span>
            <span>{{ humanBytes(a.bytes) }}</span>
          </div>
        </div>

        <!-- FOOTER pinned to bottom -->
        <div class="mt-auto flex items-center justify-between border-t border-slate-200 bg-slate-50/60 p-3">
          <span class="text-xs text-charcoal/60">
            {{ a.resource_type || (isImage(a) ? 'image' : 'raw') }}
          </span>
          <a :href="a.url"
             :download="filenameFromUrl(a.url)"
             target="_blank" rel="noopener"
             class="inline-flex items-center gap-1 rounded-2xl bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-dark">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <path d="M7 10l5 5 5-5"/>
              <path d="M12 15V3"/>
            </svg>
            Download
          </a>
        </div>
      </article>
    </div>
  </div>
</template>
