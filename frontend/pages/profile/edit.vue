<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">Edit Profile</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- Profile Image -->
        <div class="flex items-center space-x-6">
          <div class="relative w-24 h-24">
            <img
              :src="profileImage || '/default-avatar.png'"
              class="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              alt="Profile image"
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

        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Username</label
            >
            <BaseInput v-model="profile.username" placeholder="Your username" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Display Name</label
            >
            <BaseInput
              v-model="profile.displayName"
              placeholder="Your display name"
            />
          </div>
        </div>

        <!-- Bio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Bio</label
          >
          <textarea
            v-model="profile.bio"
            rows="4"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Email</label
            >
            <BaseInput
              v-model="profile.email"
              type="email"
              placeholder="Your email"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Website</label
            >
            <BaseInput
              v-model="profile.website"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-4">
          <BaseButton type="button" variant="secondary" @click="$router.back()">
            Cancel
          </BaseButton>
          <BaseButton type="submit" :loading="isLoading">
            Save Changes
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import BaseInput from "~/components/base/BaseInput.vue";
import BaseButton from "~/components/base/BaseButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const fileInput = ref<HTMLInputElement | null>(null);
const profileImage = ref<string | null>(null);
const isLoading = ref(false);

// Set page meta
definePageMeta({
  layout: "default",
  middleware: "auth",
});

const profile = reactive({
  username: "",
  displayName: "",
  bio: "",
  email: "",
  website: "",
});

onMounted(() => {
  // Load user profile data
  if (authStore.currentUser) {
    profile.username = authStore.currentUser.username;
    profile.email = authStore.currentUser.email;
    // Add other fields when your user object has them
  }
});

function triggerFileInput() {
  fileInput.value?.click();
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      profileImage.value = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  }
}

async function updateProfile() {
  try {
    isLoading.value = true;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Implement actual API call to update profile

    // Show success message
    alert("Profile updated successfully");

    // Redirect back to profile
    router.push("/profile");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile");
  } finally {
    isLoading.value = false;
  }
}
</script>
