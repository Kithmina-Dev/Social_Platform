<template>
  <VeeForm
    :validation-schema="schema"
    @submit="handleSubmit"
    v-slot="{ errors, isSubmitting }"
  >
    <form @submit.prevent class="space-y-6">
      <slot :errors="errors || {}" :is-submitting="isSubmitting || false" />
    </form>
  </VeeForm>
</template>

<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

interface Props {
  schema?: any
  onSubmit?: (values: any) => void | Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  schema: toTypedSchema(z.object({}))
})

const emit = defineEmits<{
  submit: [values: any]
}>()

const handleSubmit = async (values: any) => {
  if (props.onSubmit) {
    await props.onSubmit(values)
  }
  emit('submit', values)
}
</script> 