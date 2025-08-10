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

    <VeeField :name="fieldName" v-slot="{ field, errorMessage, meta }">
      <template v-if="component === 'textarea'">
        <textarea
          v-bind="field"
          :id="fieldName"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :rows="rows"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
          :class="{ 'border-red-500': errorMessage || error }"
        ></textarea>
      </template>
      <template v-else>
        <input
          v-bind="field"
          :id="fieldName"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': errorMessage || error }"
        />
      </template>
      <p v-if="errorMessage || error" class="mt-1 text-sm text-red-600">
        {{ errorMessage || error }}
      </p>
      <p
        v-if="helperText && !errorMessage && !error"
        class="mt-1 text-sm text-gray-500"
      >
        {{ helperText }}
      </p>
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
</script>
