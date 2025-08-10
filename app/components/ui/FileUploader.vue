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
      Select Files
    </button>

    <!-- Thumbnails or icons -->
    <div class="flex flex-wrap gap-4">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="relative w-24 h-24 border rounded overflow-hidden flex items-center justify-center"
      >
        <!-- Image preview for images, else show file icon -->
        <template v-if="item.file.type.startsWith('image/')">
          <img :src="item.url as string" alt="Preview" class="w-full h-full object-cover" />
        </template>
        <template v-else>
          <div  class="flex flex-col items-center justify-center">
            <Icon name="File" class="w-8 h-8 text-gray-400" />
            <span class="text-xs text-center">{{ item.file.name }}</span>
          </div>
        </template>

        <button
          type="button"
          class="absolute top-0 right-0 bg-black/60 text-white rounded-bl px-1 text-xs"
          @click="removeAt(index)"
          aria-label="Remove file"
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
import Icon from '../Icon.vue';

type PreviewItem = {
  id: string;
  file: File;
  url: string | null; // Object URL or null
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
  accept: '*/*',  // Accept all file types by default
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
  items.value.forEach(i => URL.revokeObjectURL(i.url as string));
  items.value = incoming.map((f) => ({
    id: crypto.randomUUID(),
    file: f,
    url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null // Only create object URL for images
  }));
}

// Initialize from props
syncFromProps(props.files);

// Keep internal list in sync if parent changes files externally
watch(
  () => props.files,
  (newFiles) => {
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
  // Enforce maxFiles if provided
  const remaining = props.maxFiles
    ? Math.max(props.maxFiles - items.value.length, 0)
    : newFiles.length;

  const toAdd = props.maxFiles ? newFiles.slice(0, remaining) : newFiles;

  const next: PreviewItem[] = toAdd.map((f) => ({
    id: crypto.randomUUID(),
    file: f,
    url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null // Only create object URL for images
  }));

  items.value.push(...next);
}

function removeAt(index: number) {
  const [removed] = items.value.splice(index, 1);
  if (removed && removed.url) URL.revokeObjectURL(removed.url); // Clean up the object URL for images
}

// Cleanup all object URLs on unmount
onBeforeUnmount(() => {
  items.value.forEach(i => i.url && URL.revokeObjectURL(i.url));
});
</script>

<style scoped>
/* You can replace with your own design system or Tailwind */
</style>
