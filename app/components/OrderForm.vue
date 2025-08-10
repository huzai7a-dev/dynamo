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
    <UiButton 
      type="submit" 
      fullWidth 
      size="lg" 
      :disabled="disabledSubmit"
    >
       {{ isLoading ? 'Creating Order...' : 'Create Order' }} 
    </UiButton
    >
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { fabricOptions, formatOptions, placementOptions } from "~/constants";
import { OrderSchema } from "~~/shared/validationSchema";

const emit = defineEmits(['success', 'error']);

const toast = useToast();

const { handleSubmit, errors, defineField } = useForm({
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
    blending: "No",
    rush: "No",
    instructions: "",
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

const disabledSubmit = computed(() => Object.keys(errors.value).length > 0 || isLoading.value);

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

    formValues.attachments.forEach((file, i) => {
      fd.append("attachments", file);
    });

    await $fetch("/api/orders", {
      method: "POST",
      body: fd,
    });

    toast.success("Order created successfully!");
    emit('success')

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
    emit('error')
  }finally{
    isLoading.value = false
  }
});
</script>
