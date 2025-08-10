<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
    <textarea
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
      rows="4"
      class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Tell us about yourself..."
    ></textarea>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
defineEmits(["update:modelValue"]);
</script>
