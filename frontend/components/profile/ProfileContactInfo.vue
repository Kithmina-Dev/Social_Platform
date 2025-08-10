<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
      <BaseInput
        :modelValue="email"
        @update:modelValue="$emit('update:email', $event)"
        type="email"
        placeholder="Your email"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2"
        >Website</label
      >
      <BaseInput
        :modelValue="website"
        @update:modelValue="$emit('update:website', $event)"
        placeholder="https://yourwebsite.com"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  email: string;
  website: string;
}

const props = defineProps<Props>();
defineEmits(["update:email", "update:website"]);
</script>
