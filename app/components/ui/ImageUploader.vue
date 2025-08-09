<template>
  <div class="space-y-4">
    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="onFileChange"
    />

    <button
      type="button"
      class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
      @click="openFilePicker"
    >
      Select Images
    </button>

    <!-- Thumbnails -->
    <div class="flex flex-wrap gap-4">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="relative w-24 h-24 border rounded overflow-hidden"
      >
        <img :src="item.url" alt="Preview" class="w-full h-full object-cover" />
        <button
          type="button"
          class="absolute top-0 right-0 bg-black/60 text-white rounded-bl px-1 text-xs"
          @click="removeAt(index)"
          aria-label="Remove image"
          title="Remove"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Optional helper text -->
    <p v-if="maxFiles" class="text-xs text-gray-500">
      {{ items.length }} / {{ maxFiles }} selected
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type PreviewItem = {
  id: string;
  file: File;
  url: string; // Object URL
};

const props = withDefaults(defineProps<{
  /** v-model:files (controlled) */
  files?: File[];
  /** Accept attribute for input */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Max number of files allowed (optional) */
  maxFiles?: number;
}>(), {
  files: () => [],
  accept: 'image/*',
  multiple: true,
  maxFiles: undefined
});

const emit = defineEmits<{
  /** Emit whenever internal list changes */
  'update:files': [files: File[]]
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const items = ref<PreviewItem[]>([]);

/** Build internal preview list from incoming controlled files */
function syncFromProps(incoming: File[]) {
  // revoke previous
  items.value.forEach(i => URL.revokeObjectURL(i.url));
  items.value = incoming.map((f) => ({
    id: crypto.randomUUID(),
    file: f,
    url: URL.createObjectURL(f)
  }));
}

// Initialize from props
syncFromProps(props.files);

// Keep internal list in sync if parent changes files externally
watch(
  () => props.files,
  (newFiles) => {
    // naive check: re-sync if lengths differ or references changed
    if (!newFiles) return;
    if (newFiles.length !== items.value.length ||
        newFiles.some((f, i) => items.value[i]?.file !== f)) {
      syncFromProps(newFiles);
    }
  },
  { deep: false }
);

// Emit to parent whenever our internal list changes
watch(
  items,
  (val) => emit('update:files', val.map(v => v.file)),
  { deep: true }
);

function openFilePicker() {
  fileInput.value?.click();
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  addFiles(Array.from(input.files));
  // allow re-selecting the same files later
  input.value = '';
}

function addFiles(newFiles: File[]) {
  const images = newFiles.filter((f) => f.type.startsWith('image/'));

  // Enforce maxFiles if provided
  const remaining = props.maxFiles
    ? Math.max(props.maxFiles - items.value.length, 0)
    : images.length;

  const toAdd = props.maxFiles ? images.slice(0, remaining) : images;

  const next: PreviewItem[] = toAdd.map((f) => ({
    id: crypto.randomUUID(),
    file: f,
    url: URL.createObjectURL(f)
  }));

  items.value.push(...next);
}

function removeAt(index: number) {
  const [removed] = items.value.splice(index, 1);
  if (removed) URL.revokeObjectURL(removed.url);
}

// Cleanup all object URLs on unmount
onBeforeUnmount(() => {
  items.value.forEach(i => URL.revokeObjectURL(i.url));
});
</script>

<style scoped>
/* You can replace with your own design system or Tailwind */
</style>
