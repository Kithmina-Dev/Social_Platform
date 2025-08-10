<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
    <!-- Cover Photo -->
    <div class="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>

    <!-- Profile Info -->
    <div class="relative p-6">
      <!-- Avatar -->
      <div class="absolute -top-16 left-6">
        <div class="w-32 h-32 bg-white rounded-full p-1 shadow-md">
          <img
            :src="profile.avatar || '/images/default-avatar.png'"
            alt="Profile"
            class="w-full h-full rounded-full object-cover"
            @error="handleAvatarError"
          />
        </div>
      </div>

      <!-- Action Buttons (right side) -->
      <div class="flex justify-end">
        <div v-if="isOwnProfile" class="space-x-3">
          <BaseButton variant="outline" @click="$router.push('/profile/edit')">
            Edit Profile
          </BaseButton>
        </div>
        <div v-else class="space-x-3">
          <BaseButton variant="primary">Follow</BaseButton>
          <BaseButton variant="outline">Message</BaseButton>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="mt-6">
        <h1 class="text-2xl font-bold">
          {{ profile.displayName || profile.username }}
        </h1>
        <p class="text-gray-500">@{{ profile.username }}</p>

        <p v-if="profile.bio" class="mt-3">{{ profile.bio }}</p>

        <div class="flex items-center mt-4 space-x-4">
          <div class="flex items-center text-gray-600">
            <svg
              class="h-5 w-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span
              >Joined
              {{
                formatDate(profile.createdAt || new Date().toISOString())
              }}</span
            >
          </div>
          <div v-if="profile.location" class="flex items-center text-gray-600">
            <svg
              class="h-5 w-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{{ profile.location }}</span>
          </div>
          <div v-if="profile.website" class="flex items-center text-blue-600">
            <svg
              class="h-5 w-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <a
              :href="profile.website"
              target="_blank"
              rel="noopener noreferrer"
              >{{ formatWebsite(profile.website) }}</a
            >
          </div>
        </div>

        <!-- Profile Stats -->
        <ProfileStats :stats="stats" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const placeholderAvatar = ref("/images/default-avatar.png");

// Props
interface ProfileStats {
  postsCount: number;
  followingCount: number;
  followersCount: number;
}

interface Props {
  profile: any;
  isOwnProfile: boolean;
  stats: ProfileStats;
}

const props = defineProps<Props>();

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatWebsite(url: string): string {
  // Remove http/https and trailing slash for display
  return url.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");
}

function handleAvatarError(e: Event) {
  // Use placeholder if avatar fails to load
  const img = e.target as HTMLImageElement;
  img.src = placeholderAvatar.value;
}
</script>
