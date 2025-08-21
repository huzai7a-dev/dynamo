<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-8 max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-gray-100"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UiInput
        v-model="orderName"
        label="Order Name"
        required
        placeholder="Enter Order Name"
        :error="errors.orderName"
      />
      <UiInput
        v-model="poNumber"
        label="PO Number"
        placeholder="Enter PO Number"
        :error="errors.poNumber"
      />
      <UiSelect
        v-model="requiredFormat"
        label="Required Format"
        required
        placeholder="Select"
        :options="formatOptions"
        :error="errors.requiredFormat"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UiInput
        v-model="width"
        label="Width (inches)"
        placeholder="Enter Width (inches)"
        type="number"
        :error="errors.width"
      />
      <UiInput
        v-model="height"
        label="Height (inches)"
        placeholder="Enter Height (inches)"
        type="number"
        :error="errors.height"
      />
    </div>
    <p class="text-xs text-red-500 mt-1 mb-2">
      Please make sure to write the dimensions of your logo i.e., Width or
      Height. If not the logo will be digitized with the standard size.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UiSelect
        v-model="fabric"
        label="Fabric"
        required
        placeholder="Select Fabric"
        :options="fabricOptions"
        :error="errors.fabric"
      />
      <UiSelect
        v-model="placement"
        label="Placement"
        required
        placeholder="Select"
        :options="placementOptions"
        :error="errors.placement"
      />
      <UiInput
        v-model="numColors"
        label="Number Of Colors"
        placeholder="Enter Color Number"
        type="number"
        :error="errors.numColors"
      />
    </div>
    <div class="space-y-4 flex justify-between items-center">
      <div>
        <label class="block text-md font-semibold text-gray-700"
          >Do You Require Blending ?</label
        >
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
        <label class="block text-md font-semibold text-gray-700 mb-2"
          >Do you need this order as a rush?</label
        >
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
    <div>
      <label class="block text-md font-semibold text-gray-700 mb-2">
        Do You Require Faceless?
      </label>
      <div class="flex gap-6 text-gray-600">
        <label class="flex items-center gap-2">
          <input type="radio" value="with-outline" v-model="faceless" /> With
          Outline
        </label>
        <label class="flex items-center gap-2">
          <input type="radio" value="without-outline" v-model="faceless" />
          Without Outline
        </label>
      </div>
    </div>

    <UiInput
      v-model="instructions"
      label="Additional Instructions"
      placeholder="Enter Additional Instructions"
      type="textarea"
      :error="errors.instructions"
    />

    <UiFileUploader
      v-model:files="attachments"
      :multiple="true"
      accept="'*/*'"
    />
    
    <!-- Show existing attachments if editing -->
    <div v-if="isEditMode && existingAttachments?.length" class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Existing Attachments</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="attachment in existingAttachments" 
          :key="attachment.url"
          class="relative group"
        >
          <img 
            :src="attachment.url" 
            :alt="attachment.url"
            class="w-full h-24 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            @click="removeExistingAttachment(attachment)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <UiButton 
      type="submit" 
      fullWidth 
      size="lg" 
      :disabled="disabledSubmit"
    >
       {{ isLoading ? (isEditMode ? 'Updating Order...' : 'Creating Order...') : (isEditMode ? 'Update Order' : 'Create Order') }} 
    </UiButton>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { fabricOptions, formatOptions, placementOptions } from "~/constants";
import { OrderSchema } from "~~/shared/validationSchema";

interface Props {
  orderData?: IOrder;
  isEditMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  orderData: undefined
});

const emit = defineEmits(['success', 'error']);


const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: toTypedSchema(OrderSchema),
  initialValues: {
    orderName: "",
    poNumber: "",
    requiredFormat: "",
    width: "",
    height: "",
    fabric: "",
    placement: "",
    numColors: "",
    blending: "No" as const,
    rush: "No" as const,
    instructions: "",
    faceless: undefined,
    attachments: [],
  },
});

// Define fields with two-way binding
const [orderName] = defineField("orderName");
const [poNumber] = defineField("poNumber");
const [requiredFormat] = defineField("requiredFormat");
const [width] = defineField("width");
const [height] = defineField("height");
const [fabric] = defineField("fabric");
const [placement] = defineField("placement");
const [numColors] = defineField("numColors");
const [blending] = defineField("blending");
const [rush] = defineField("rush");
const [instructions] = defineField("instructions");
const [faceless] = defineField("faceless");
const [attachments] = defineField("attachments");

const isLoading = ref(false);

// Track existing attachments for edit mode
const existingAttachments = ref<Attachment[]>(props.orderData?.order_attachments || []);

const disabledSubmit = computed(() => Object.keys(errors.value).length > 0 || isLoading.value);

// Remove existing attachment
const removeExistingAttachment = (attachment: Attachment) => {
  existingAttachments.value = existingAttachments.value.filter(
    att => att.url !== attachment.url
  );
};

const onSubmit = handleSubmit(async (formValues) => {
  try {
    isLoading.value = true;
    const fd = new FormData();

    fd.append("orderName", formValues.orderName);
    fd.append("poNumber", formValues.poNumber ?? "");
    fd.append("requiredFormat", formValues.requiredFormat);
    fd.append("width", formValues.width ?? "");
    fd.append("height", formValues.height ?? "");
    fd.append("fabric", formValues.fabric);
    fd.append("placement", formValues.placement);
    fd.append("numColors", formValues.numColors ?? "");
    fd.append("blending", formValues.blending);
    fd.append("rush", formValues.rush);
    fd.append("instructions", formValues.instructions ?? "");
    fd.append("faceless", formValues.faceless ?? "");

    // Add new attachments
    formValues.attachments.forEach((file, i) => {
      fd.append("attachments", file);
    });

    // Add remaining existing attachments
    existingAttachments.value.forEach((attachment, i) => {
      fd.append("existingAttachments", attachment.url);
    });

    const url = props.isEditMode 
      ? `/api/orders/${props.orderData?.id}` 
      : "/api/orders";
    
    const method = props.isEditMode ? "PUT" : "POST";

    await $fetch(url, {
      method,
      body: fd,
    });

    emit('success');

  } catch (error) {
    console.error(error);
    emit('error');
  } finally {
    isLoading.value = false;
  }
});

// Watch for orderData changes and update form
watch(() => props.orderData, (newOrderData) => {
  if (newOrderData && props.isEditMode) {
    const initialValues = {
      orderName: newOrderData.order_name || "",
      poNumber: newOrderData.po_number || "",
      requiredFormat: newOrderData.required_format || "",
      width: newOrderData.width_in || "",
      height: newOrderData.height_in || "",
      fabric: newOrderData.fabric || "",
      placement: newOrderData.placement || "",
      numColors: newOrderData.num_colors?.toString() || "",
      blending: (newOrderData.blending || "No") as "No" | "Yes" | "Not Sure",
      rush: (newOrderData.rush || "No") as "No" | "Yes",
      instructions: newOrderData.instructions || "",
      faceless: newOrderData.faceless ? "with-outline" as const : "without-outline" as const,
      attachments: [],
    };
    setValues(initialValues);
    existingAttachments.value = newOrderData.order_attachments || [];
  }
}, { immediate: true });
</script>
