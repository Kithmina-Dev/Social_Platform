<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2"
        >Username</label
      >
      <BaseInput
        :modelValue="username"
        @update:modelValue="$emit('update:username', $event)"
        placeholder="Your username"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2"
        >Display Name</label
      >
      <BaseInput
        :modelValue="displayName"
        @update:modelValue="$emit('update:displayName', $event)"
        placeholder="Your display name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  username: string;
  displayName: string;
}

const props = defineProps<Props>();
defineEmits(["update:username", "update:displayName"]);
</script>
