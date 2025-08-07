<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="fieldName"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <VeeField
      :name="fieldName"
      v-slot="{ field, errorMessage, meta, handleChange }"
    >
      <component
        :is="inputComponent"
        :modelValue="field.value"
        @update:modelValue="(newValue: any) => field.onChange(newValue)"
        @blur="field.onBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :error="errorMessage || error"
        :helper-text="helperText"
        :type="type"
        :rows="rows"
        :class="inputClasses"
      />
    </VeeField>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Field as VeeField } from "vee-validate";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  component?: "input" | "textarea";
  rows?: number;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  required: false,
  disabled: false,
  component: "input",
  rows: 3,
});

const fieldName = computed(() => props.name);
const inputComponent = computed(() => {
  if (props.component === "textarea") return "BaseTextarea";
  if (props.type === "checkbox") return "BaseCheckbox";
  return "BaseInput";
});

const inputClasses = computed(() => {
  return props.component === "textarea" ? "resize-none" : "";
});
</script>
