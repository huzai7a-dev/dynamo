<template>
  <form @submit.prevent="onSubmit" class="space-y-8 max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-gray-100">
    <div class="w-full text-center text-2xl font-semibold py-2 bg-primary text-white">
      <h3>{{ headerTitle }}</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UiInput v-model="vectorName" label="Vector Name" required placeholder="Enter Vector Name"
        :error="errors.vectorName" />
      <UiInput v-model="poNumber" label="PO Number" placeholder="Enter PO Number" :error="errors.poNumber" />
      <UiSelect v-model="requiredFormat" label="Required Format" required placeholder="Select"
        :options="vectorFormatOptions" :error="errors.requiredFormat" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UiInput v-model="numColors" label="Number Of Colors" placeholder="Enter Color Number" type="number"
        :error="errors.numColors" />

      <UiSelect v-model="vectorType" label="Vector Type" placeholder="Select" :options="vectorTypeOptions"
        :error="errors.vectorType" />
    </div>

    <div class="space-y-4 flex justify-between items-center">
      <div>
        <label class="block text-md font-semibold text-gray-700">Do You Require Blending ?</label>
        <div class="flex gap-6 text-gray-600">
          <label class="flex items-center gap-2">
            <input type="radio" value="No" v-model="blending" /> No
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" value="Yes" v-model="blending" /> Yes
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" value="Not Sure" v-model="blending" /> Not Sure
          </label>
        </div>
      </div>
      <div>
        <label class="block text-md font-semibold text-gray-700 mb-2">Do you need this order as a rush?</label>
        <div class="flex gap-6 text-gray-600">
          <label class="flex items-center gap-2">
            <input type="radio" value="No" v-model="rush" /> No
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" value="Yes" v-model="rush" /> Yes
          </label>
        </div>
      </div>
    </div>

    <UiInput v-model="instructions" label="Additional Instructions" placeholder="Enter Additional Instructions"
      type="textarea" :error="errors.instructions" />

    <UiFileUploader v-model:files="attachments" :multiple="true" accept="'*/*'" />

    <!-- Show existing attachments if editing -->
    <div v-if="isEditMode && existingAttachments?.length" class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Existing Attachments</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="attachment in existingAttachments" :key="attachment.url" class="relative group">
          <img :src="attachment.url" :alt="attachment.url"
            class="w-full h-24 object-cover rounded-lg border border-gray-200" />
          <button type="button" @click="removeExistingAttachment(attachment)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            ×
          </button>
        </div>
      </div>
    </div>

    <UiButton type="submit" fullWidth size="lg" :disabled="disabledSubmit">
      {{
        isLoading
          ? isEditMode
            ? "Updating..."
            : "Submitting..."
          : isEditMode
            ? "Update"
            : "Submit"
      }}
    </UiButton>

    <p class="text-sm text-gray-600 mt-4">If you experience any issues while uploading your files, please email us at <a
        class="text-primary font-semibold" href="mailto:order@dynamostitches.com">order@dynamostitches.com</a> with
      complete details.
    </p>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { vectorFormatOptions, vectorTypeOptions } from "~/constants";
import { VectorSchema } from "~~/shared/validationSchema";
import type { IVector } from "~~/shared/types";

interface Props {
  vectorData?: IVector;
  isEditMode?: boolean;
  endpoint?: 'quotes' | 'vectors';
  headerTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  vectorData: undefined,
  endpoint: "vectors",
  headerTitle: "Send Vector",
});

const emit = defineEmits(["success", "error"]);

const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: toTypedSchema(VectorSchema),
  initialValues: {
    vectorName: "",
    poNumber: "",
    requiredFormat: "",
    numColors: "",
    blending: "No" as const,
    rush: "No" as const,
    instructions: "",
    vectorType: "",
    attachments: [],
  },
});

// Define fields with two-way binding
const [vectorName] = defineField("vectorName");
const [poNumber] = defineField("poNumber");
const [requiredFormat] = defineField("requiredFormat");
const [numColors] = defineField("numColors");
const [blending] = defineField("blending");
const [rush] = defineField("rush");
const [instructions] = defineField("instructions");
const [attachments] = defineField("attachments");
const [vectorType] = defineField("vectorType");


const isLoading = ref(false);

// Track existing attachments for edit mode
const existingAttachments = ref<Attachment[]>(
  props.vectorData?.vector_attachments || []
);

const disabledSubmit = computed(
  () => Object.keys(errors.value).length > 0 || isLoading.value
);

// Remove existing attachment
const removeExistingAttachment = (attachment: Attachment) => {
  existingAttachments.value = existingAttachments.value.filter(
    (att) => att.url !== attachment.url
  );
};

const onSubmit = handleSubmit(async (formValues) => {
  try {
    isLoading.value = true;
    const fd = new FormData();

    fd.append("vectorName", formValues.vectorName);
    fd.append("poNumber", formValues.poNumber ?? "");
    fd.append("requiredFormat", formValues.requiredFormat);
    fd.append("numColors", formValues.numColors ?? "");
    fd.append("blending", formValues.blending);
    fd.append("rush", formValues.rush);
    fd.append("instructions", formValues.instructions ?? "");
    fd.append("vectorType", formValues.vectorType ?? "");
    fd.append("dataSourceType", DataSource.VECTOR);

    // Add new attachments
    formValues.attachments.forEach((file, i) => {
      fd.append("attachments", file);
    });

    // Add remaining existing attachments
    existingAttachments.value.forEach((attachment, i) => {
      fd.append("existingAttachments", attachment.url);
    });

    const url = props.isEditMode
      ? `/api/${props.endpoint}/${props.vectorData?.id}`
      : `/api/${props.endpoint}`;

    const method = props.isEditMode ? "PUT" : "POST";

    await $fetch(url, {
      method,
      body: fd,
    });

    emit("success");
  } catch (error) {
    console.error(error);
    emit("error");
  } finally {
    isLoading.value = false;
  }
});

// Watch for orderData changes and update form
watch(
  () => props.vectorData,
  (newOrderData) => {
    if (newOrderData && props.isEditMode) {
      const initialValues = {
        vectorName: newOrderData.vector_name || "",
        poNumber: newOrderData.po_number || "",
        requiredFormat: newOrderData.required_format || "",
        numColors: newOrderData.num_colors?.toString() || "",
        blending: (newOrderData.blending || "No") as "No" | "Yes" | "Not Sure",
        rush: (newOrderData.rush || "No") as "No" | "Yes",
        instructions: newOrderData.instructions || "",
        attachments: [],
      };
      setValues(initialValues);
      existingAttachments.value = newOrderData.vector_attachments || [];
    }
  },
  { immediate: true }
);
</script>
