<template>
  <div class="mb-6">
    <div class="border-b border-gray-200">
      <nav class="flex -mb-px">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('tab-change', tab.id)"
          :class="[
            modelValue === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define tabs
const tabs = [
  { id: "posts", label: "Posts" },
  { id: "media", label: "Media" },
  { id: "likes", label: "Likes" },
];

// Props and emits
interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
defineEmits(["tab-change"]);
</script>
