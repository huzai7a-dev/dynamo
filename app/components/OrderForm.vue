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

    <UiImageUploader
      v-model:files="attachments"
      :multiple="true"
      accept="image/*"
      :max-files="12"
    />
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
    attachments: [],
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
const [attachments]     = defineField('attachments')

const disabledSubmit = computed(()=> Object.keys(errors.value).length > 0)
// Handle file input

// Submit logic
const onSubmit = handleSubmit(async (formValues) => {
  try {
    // Build multipart form data
    const fd = new FormData()
    
    fd.append('orderName', formValues.orderName)
    fd.append('poNumber', formValues.poNumber ?? '')
    fd.append('requiredFormat', formValues.requiredFormat)
    fd.append('width', formValues.width ?? '')
    fd.append('height', formValues.height ?? '')
    fd.append('fabric', formValues.fabric)
    fd.append('placement', formValues.placement)
    fd.append('numColors', formValues.numColors ?? '')
    fd.append('blending', formValues.blending)
    fd.append('rush', formValues.rush)
    fd.append('instructions', formValues.instructions ?? '')

    // append files (use the name your API expects)
    formValues.attachments.forEach((file, i) => {
      fd.append('attachments', file) // or `attachments[]`
    })

    // send to backend (Nuxt $fetch respects FormData => multipart)
    await $fetch('/api/orders/create', {
      method: 'POST',
      body: fd,
    })

    // success UI here...
  } catch (error) {
    console.error(error)
  }})

</script>