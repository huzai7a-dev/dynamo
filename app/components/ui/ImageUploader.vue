<template>
    <div class="space-y-4">
      <!-- File Input -->
      <input
        type="file"
        multiple
        accept="image/*"
        @change="handleFiles"
        class="hidden"
        ref="fileInput"
      />
      <button
        class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        @click="openFilePicker"
      >
        Select Images
      </button>
  
      <!-- Previews -->
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(image, index) in previews"
          :key="index"
          class="relative w-36 h-36 border rounded overflow-hidden"
        >
          <img
            :src="image"
            alt="Preview"
            class="object-cover w-full h-full"
          />
          <button
            class="absolute top-0 right-0 bg-black/50 text-white rounded-bl px-1 text-xs"
            @click="removeImage(index)"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const emit = defineEmits(['update:files']);
  
  const fileInput = ref(null);
  const files = ref([]); // Array of File objects
  const previews = ref([]); // Array of base64 strings
  
  function openFilePicker() {
    fileInput.value.click();
  }
  
  function handleFiles(event) {
    const selected = Array.from(event.target.files);
  
    selected.forEach(file => {
      if (file.type.startsWith('image/')) {
        files.value.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Reset input so selecting same file again works
    event.target.value = '';
  }
  
  function removeImage(index) {
    files.value.splice(index, 1);
    previews.value.splice(index, 1);
  }
  
  watch(files, (newFiles) => {
    emit('update:files', newFiles);
  });
  </script>
  
  <style scoped>
  /* Optional styling */
  </style>
  