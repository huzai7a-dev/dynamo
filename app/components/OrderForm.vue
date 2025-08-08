<template>
  <form @submit.prevent="onSubmit" class="space-y-8 max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-gray-100">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UiInput v-model="orderName" label="Order Name" required placeholder="Enter Order Name" :error="errors.orderName" />
      <UiInput v-model="poNumber" label="PO Number" placeholder="Enter PO Number" :error="errors.poNumber" />
      <UiSelect v-model="requiredFormat" label="Required Format" required placeholder="Select" :options="formatOptions" :error="errors.requiredFormat" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UiInput v-model="width" label="Width (inches)" placeholder="Enter Width (inches)" type="number" :error="errors.width" />
      <UiInput v-model="height" label="Height (inches)" placeholder="Enter Height (inches)" type="number" :error="errors.height" />
    </div>
    <p class="text-xs text-red-500 mt-1 mb-2">
      Please make sure to write the dimensions of your logo i.e., Width or Height. If not the logo will be digitized with the standard size.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UiSelect v-model="fabric" label="Fabric" required placeholder="Select Fabric" :options="fabricOptions" :error="errors.fabric" />
      <UiSelect v-model="placement" label="Placement" required placeholder="Select" :options="placementOptions" :error="errors.placement" />
      <UiInput v-model="numColors" label="Number Of Colors" placeholder="Enter Color Number" type="number" :error="errors.numColors" />
    </div>
    <div class="space-y-4 flex justify-between items-center">
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2">Do You Require Blending</label>
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
        <label class="block text-lg font-semibold text-gray-700 mb-2">Do you need this order as a rush?</label>
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
    <UiInput v-model="instructions" label="Additional Instructions" placeholder="Enter Additional Instructions" type="textarea" :error="errors.instructions" />

    <UiImageUploader/>
    <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium mb-2">Attachment 1</label>
        <input type="file" @change="e => handleFileChange(e, 1)" class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Attachment 2</label>
        <input type="file" @change="e => handleFileChange(e, 2)" class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
      </div>
    </div> -->

    <UiButton type="submit" fullWidth size="lg" :disabled="disabledSubmit">Submit</UiButton>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { fabricOptions, formatOptions, placementOptions } from '~/constants'
import { OrderSchema } from '~~/shared/validationSchema'

// Setup the form
const { handleSubmit, values, errors, defineField, setFieldValue } = useForm({
  validationSchema: toTypedSchema(OrderSchema),
  initialValues: {
    orderName: '',
    poNumber: '',
    requiredFormat: '',
    width: '',
    height: '',
    fabric: '',
    placement: '',
    numColors: '',
    blending: 'No',
    rush: 'No',
    instructions: '',
    attachment1: null,
    attachment2: null,
  },
})

// Define fields with two-way binding
const [orderName] = defineField('orderName')
const [poNumber] = defineField('poNumber')
const [requiredFormat] = defineField('requiredFormat')
const [width] = defineField('width')
const [height] = defineField('height')
const [fabric] = defineField('fabric')
const [placement] = defineField('placement')
const [numColors] = defineField('numColors')
const [blending] = defineField('blending')
const [rush] = defineField('rush')
const [instructions] = defineField('instructions')

const disabledSubmit = computed(()=> Object.keys(errors.value).length > 0)
// Handle file input
function handleFileChange(e: Event, which: 1 | 2) {
  const files = (e.target as HTMLInputElement).files
  if (files?.length) {
    setFieldValue(which === 1 ? 'attachment1' : 'attachment2', files[0])
  }
}

// Submit logic
const onSubmit = handleSubmit((formValues) => {
  const fd = new FormData()
  fd.append('image', formValues.attachment1)
  try {
    $fetch('/api/orders/post', {
      method:'POST',
      body: fd,
    });
  } catch (error) {
    console.log(error)
  }
})
</script>