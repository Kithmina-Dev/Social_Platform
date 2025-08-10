<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">Edit Profile</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <!-- Error message display -->
      <div
        v-if="errorMessage"
        class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6"
      >
        {{ errorMessage }}
      </div>

      <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- Profile Image Component -->
        <ProfileImageUpload
          v-model="profileImage"
          @file-selected="handleFileSelected"
        />

        <!-- Basic Information Component -->
        <ProfileBasicInfo
          :username="profile.username"
          :displayName="profile.displayName"
          @update:username="profile.username = $event"
          @update:displayName="profile.displayName = $event"
        />

        <!-- Bio Component -->
        <ProfileBioSection v-model="profile.bio" />

        <!-- Contact Information Component -->
        <ProfileContactInfo
          :email="profile.email"
          :website="profile.website"
          @update:email="profile.email = $event"
          @update:website="profile.website = $event"
        />

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
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const profileImage = ref<string | null>(null);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const avatarFile = ref<File | null>(null);

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

onMounted(async () => {
  try {
    // Load user profile data
    if (authStore.currentUser) {
      profile.username = authStore.currentUser.username;
      profile.email = authStore.currentUser.email;
      profile.displayName = authStore.currentUser.displayName || "";
      profile.bio = authStore.currentUser.bio || "";
      profile.website = authStore.currentUser.website || "";

      // Set initial profile image if available
      if (authStore.currentUser.avatar) {
        profileImage.value = authStore.currentUser.avatar;
      }
    }
  } catch (error) {
    console.error("Error loading profile data:", error);
    errorMessage.value = "Failed to load profile data. Please try again.";
  }
});

// Handle file selection from ProfileImageUpload component
function handleFileSelected(file: File) {
  avatarFile.value = file;
}

async function updateProfile() {
  try {
    isLoading.value = true;
    errorMessage.value = null;

    // Validate required fields
    if (!profile.username) {
      errorMessage.value = "Username is required";
      return;
    }

    if (!profile.email) {
      errorMessage.value = "Email is required";
      return;
    }

    // Prepare profile data including avatar if changed
    const profileData = {
      ...profile,
      avatar: avatarFile.value || undefined,
    };

    // Call the store method to update the profile
    await profileStore.updateProfile(profileData);

    // Show success notification (could use a toast component)
    alert("Profile updated successfully");

    // Redirect back to profile
    router.push(`/profile/${profile.username}`);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    errorMessage.value =
      error?.data?.message || "Failed to update profile. Please try again.";
  } finally {
    isLoading.value = false;
  }
}
</script>
