<template>
  <div
    class="flex items-center justify-center overflow-hidden bg-gray-200"
    :class="[rounded ? 'rounded-full' : 'rounded-md', sizeClasses, className]"
  >
    <img
      v-if="image"
      :src="getImageSrc(image)"
      :alt="alt || 'Avatar'"
      class="w-full h-full object-cover"
      @error="handleImageError"
    />
    <span v-else class="font-medium text-gray-600" :class="textSizeClasses">
      {{ label || "?" }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  image: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
    validator: (val: string) =>
      ["xs", "sm", "md", "lg", "xl", "2xl"].includes(val),
  },
  rounded: {
    type: Boolean,
    default: true,
  },
  className: {
    type: String,
    default: "",
  },
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "xs":
      return "w-6 h-6";
    case "sm":
      return "w-8 h-8";
    case "md":
      return "w-10 h-10";
    case "lg":
      return "w-12 h-12";
    case "xl":
      return "w-16 h-16";
    case "2xl":
      return "w-24 h-24";
    default:
      return "w-10 h-10";
  }
});

const textSizeClasses = computed(() => {
  switch (props.size) {
    case "xs":
      return "text-xs";
    case "sm":
      return "text-sm";
    case "md":
      return "text-md";
    case "lg":
      return "text-lg";
    case "xl":
      return "text-xl";
    case "2xl":
      return "text-2xl";
    default:
      return "text-md";
  }
});

const { $getImageUrl } = useNuxtApp();

const getImageSrc = (src: string): string => {
  return $getImageUrl ? $getImageUrl(src) || src : src;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img) {
    // Fall back to default avatar image
    img.src = "/images/default-avatar.png";
  }
};
</script>
