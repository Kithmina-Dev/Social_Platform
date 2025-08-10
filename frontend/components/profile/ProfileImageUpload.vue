<template>
  <div class="flex items-center space-x-6">
    <div class="relative w-24 h-24">
      <img
        :src="getAvatarSrc(modelValue)"
        class="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
        alt="Profile image"
        @error="handleAvatarError"
      />
      <button
        type="button"
        class="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full"
        @click="triggerFileInput"
      >
        <span class="sr-only">Change image</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        </svg>
      </button>
      <input
        type="file"
        ref="fileInput"
        @change="handleImageUpload"
        accept="image/*"
        class="hidden"
      />
    </div>
    <div>
      <h3 class="font-medium">Profile Photo</h3>
      <p class="text-sm text-gray-500">PNG, JPG or GIF up to 5MB</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Props
interface Props {
  modelValue: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "file-selected"]);

// Refs
const fileInput = ref<HTMLInputElement | null>(null);

// Methods
function triggerFileInput() {
  fileInput.value?.click();
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];

    // Emit the file for parent component
    emit("file-selected", file);

    // Create preview and update v-model
    const reader = new FileReader();
    reader.onload = (e) => {
      emit("update:modelValue", e.target?.result as string);
    };

    reader.readAsDataURL(file);
  }
}

function getAvatarSrc(src: string | null): string {
  if (!src) return "/images/default-avatar.png";

  // Check if $getImageUrl is available (Nuxt plugin)
  const nuxtApp = useNuxtApp();
  return nuxtApp.$getImageUrl
    ? nuxtApp.$getImageUrl(src) || "/images/default-avatar.png"
    : src;
}

function handleAvatarError(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.src = "/images/default-avatar.png";
  }
}
</script>
