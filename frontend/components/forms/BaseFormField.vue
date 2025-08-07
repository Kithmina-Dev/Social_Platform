<template>
  <div class="w-full">
    <label v-if="label" :for="fieldName" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <VeeField
      :name="fieldName"
      v-slot="{ field, errorMessage }"
    >
      <component
        :is="inputComponent"
        v-bind="field"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :error="errorMessage"
        :helper-text="helperText"
        :type="type"
        :rows="rows"
        :class="inputClasses"
      />
    </VeeField>
  </div>
</template>

<script setup lang="ts">
import { Field as VeeField } from 'vee-validate'
import { computed } from 'vue'

interface Props {
  name: string
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  component?: 'input' | 'textarea'
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  component: 'input',
  rows: 3
})

const fieldName = computed(() => props.name)
const inputComponent = computed(() => props.component === 'textarea' ? 'BaseTextarea' : 'BaseInput')

const inputClasses = computed(() => {
  return props.component === 'textarea' ? 'resize-none' : ''
})
</script> 