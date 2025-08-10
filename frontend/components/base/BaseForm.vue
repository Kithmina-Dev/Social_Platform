<template>
  <Form
    :validation-schema="schema"
    @submit="$emit('submit', $event)"
    v-slot="slotProps"
  >
    <slot v-bind="slotProps"></slot>
  </Form>
</template>

<script setup lang="ts">
import { Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { ZodObject } from "zod";

// Define props
interface Props {
  schema: ReturnType<typeof toTypedSchema<ZodObject<any>>>;
}

defineProps<Props>();

// Define emits
defineEmits<{
  (e: "submit", values: any): void;
}>();
</script>
