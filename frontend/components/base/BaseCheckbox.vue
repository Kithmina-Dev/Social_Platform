<template>
  <Checkbox
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :binary="binary"
    :class="checkboxClass"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Checkbox from 'primevue/checkbox'

interface Props {
  modelValue?: boolean
  binary?: boolean
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  binary: true,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checkboxClass = computed(() => {
  return {
    'p-invalid': props.class?.includes('p-invalid'),
    [props.class || '']: true
  }
})
</script>
