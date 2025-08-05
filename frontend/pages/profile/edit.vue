<template>
  <div class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">Edit Profile</h1>
      
      <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="success" class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">{{ success }}</p>
          </div>
        </div>
      </div>
      
      <form @submit.prevent="onSubmit" class="space-y-6 max-w-3xl">
        <!-- Avatar upload -->
        <div class="flex flex-col items-start space-y-2">
          <label class="block text-sm font-medium text-gray-700">Profile Picture</label>
          <div class="flex items-center space-x-6">
            <div class="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100">
              <img 
                v-if="avatar" 
                :src="avatar" 
                alt="User avatar" 
                class="h-full w-full object-cover"
              />
              <div v-else class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-3xl font-bold">
                {{ username.value?.charAt(0)?.toUpperCase() }}
              </div>
            </div>
            
            <div class="flex space-x-3">
              <label class="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Upload New
                <input 
                  type="file" 
                  accept="image/*" 
                  class="sr-only" 
                  @change="handleAvatarChange" 
                />
              </label>
              
              <button 
                v-if="avatar" 
                type="button" 
                @click="clearAvatar" 
                class="py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <div class="mt-1">
            <input
              id="username"
              v-model="username.value"
              type="text"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <p v-if="username.hasError" class="mt-1 text-sm text-red-600">{{ username.errorMessage }}</p>
        </div>
        
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <div class="mt-1">
            <input
              id="email"
              v-model="email.value"
              type="email"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <p v-if="email.hasError" class="mt-1 text-sm text-red-600">{{ email.errorMessage }}</p>
        </div>
        
        <!-- Bio -->
        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
          <div class="mt-1">
            <textarea
              id="bio"
              v-model="bio.value"
              rows="4"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Tell us a little about yourself..."
            ></textarea>
          </div>
          <p v-if="bio.hasError" class="mt-1 text-sm text-red-600">{{ bio.errorMessage }}</p>
        </div>
        
        <!-- Website -->
        <div>
          <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
          <div class="mt-1">
            <input
              id="website"
              v-model="website.value"
              type="url"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="https://example.com"
            />
          </div>
          <p v-if="website.hasError" class="mt-1 text-sm text-red-600">{{ website.errorMessage }}</p>
        </div>
        
        <!-- Location -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
          <div class="mt-1">
            <input
              id="location"
              v-model="location.value"
              type="text"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="City, Country"
            />
          </div>
          <p v-if="location.hasError" class="mt-1 text-sm text-red-600">{{ location.errorMessage }}</p>
        </div>
        
        <!-- Password section -->
        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
          <p class="text-sm text-gray-500 mb-4">Leave these fields blank if you don't want to change your password</p>
          
          <!-- Current password -->
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
            <div class="mt-1">
              <input
                id="currentPassword"
                v-model="currentPassword.value"
                type="password"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p v-if="currentPassword.hasError" class="mt-1 text-sm text-red-600">{{ currentPassword.errorMessage }}</p>
          </div>
          
          <!-- New password -->
          <div class="mt-4">
            <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
            <div class="mt-1">
              <input
                id="newPassword"
                v-model="newPassword.value"
                type="password"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p v-if="newPassword.hasError" class="mt-1 text-sm text-red-600">{{ newPassword.errorMessage }}</p>
          </div>
          
          <!-- Confirm new password -->
          <div class="mt-4">
            <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div class="mt-1">
              <input
                id="confirmNewPassword"
                v-model="confirmNewPassword.value"
                type="password"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p v-if="confirmNewPassword.hasError" class="mt-1 text-sm text-red-600">{{ confirmNewPassword.errorMessage }}</p>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="flex justify-end space-x-3 pt-6">
          <NuxtLink
            to="/profile"
            class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from '#imports';
import * as z from 'zod';
import { useZodForm } from '~/composables/useZodForm';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const error = ref('');
const success = ref('');
const avatar = ref<string | null>(null);
const avatarFile = ref<File | null>(null);
const isAvatarModified = ref(false);

// Define validation schema with Zod
const profileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  bio: z.string()
    .max(200, 'Bio cannot exceed 200 characters')
    .optional(),
  website: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  location: z.string()
    .max(100, 'Location cannot exceed 100 characters')
    .optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  confirmNewPassword: z.string().optional()
}).refine(
  (data) => {
    // If user is changing password, ensure both fields are filled
    if (data.currentPassword && !data.newPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Please provide a new password",
    path: ["newPassword"],
  }
).refine(
  (data) => {
    // If user is changing password, ensure new password matches confirmation
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  }
);

// Use our custom Zod form composable
const { handleSubmit, createField, isSubmitting, resetForm } = useZodForm(profileSchema);

// Create form fields
const username = createField('username');
const email = createField('email');
const bio = createField('bio');
const website = createField('website');
const location = createField('location');
const currentPassword = createField('currentPassword');
const newPassword = createField('newPassword');
const confirmNewPassword = createField('confirmNewPassword');

// Load current user data
async function loadUserData() {
  try {
    // In a real app, you would fetch the user profile from your API
    // For now, let's use the user data from the auth store
    if (authStore.user) {
      // Set initial values
      username.value.value = authStore.user.username || '';
      email.value.value = authStore.user.email || '';
      bio.value.value = authStore.user.bio || '';
      website.value.value = authStore.user.website || '';
      location.value.value = authStore.user.location || '';
      avatar.value = authStore.user.avatar || null;
    } else {
      // Redirect to login if not logged in
      router.push('/login');
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load user data';
    console.error('Error loading user data:', err);
  }
}

// Handle avatar file change
function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error.value = 'Please select a valid image file';
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      error.value = 'Image size should not exceed 2MB';
      return;
    }
    
    avatarFile.value = file;
    isAvatarModified.value = true;
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      avatar.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    error.value = '';
  }
}

// Clear avatar
function clearAvatar() {
  avatar.value = null;
  avatarFile.value = null;
  isAvatarModified.value = true;
}

// Form submission handler
const onSubmit = handleSubmit(async (values) => {
  try {
    error.value = '';
    success.value = '';
    
    // Create FormData for avatar upload if needed
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && key !== 'confirmNewPassword') {
        formData.append(key, value as string);
      }
    });
    
    if (isAvatarModified.value) {
      if (avatarFile.value) {
        formData.append('avatar', avatarFile.value);
      } else {
        formData.append('removeAvatar', 'true');
      }
    }
    
    // Call your API to update the profile
    // const response = await updateProfile(formData);
    
    console.log('Profile update submitted:', {
      ...values,
      avatar: avatar.value ? '(image data)' : null,
      isAvatarModified: isAvatarModified.value
    });
    
    // For now, just simulate a successful update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the auth store with the new user data
    authStore.updateUserProfile({
      username: values.username,
      email: values.email,
      bio: values.bio,
      website: values.website,
      location: values.location,
      avatar: avatar.value
    });
    
    success.value = 'Profile updated successfully!';
    
    // Reset password fields and avatar modified flag
    currentPassword.value.value = '';
    newPassword.value.value = '';
    confirmNewPassword.value.value = '';
    isAvatarModified.value = false;
  } catch (err: any) {
    error.value = err.message || 'Failed to update profile. Please try again.';
  }
});

// Load user data on component mount
onMounted(() => {
  loadUserData();
});
</script>
