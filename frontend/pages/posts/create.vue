<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Create a New Post</h1>
    
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
    
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Title field -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <div class="mt-1">
          <input
            id="title"
            v-model="title.value"
            type="text"
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Give your post a title"
          />
        </div>
        <p v-if="title.hasError" class="mt-1 text-sm text-red-600">{{ title.errorMessage }}</p>
      </div>
      
      <!-- Content field -->
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
        <div class="mt-1">
          <textarea
            id="content"
            v-model="content.value"
            rows="5"
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="What's on your mind?"
          ></textarea>
        </div>
        <p v-if="content.hasError" class="mt-1 text-sm text-red-600">{{ content.errorMessage }}</p>
      </div>
      
      <!-- Image upload field -->
      <div>
        <label for="imageFile" class="block text-sm font-medium text-gray-700">Image (optional)</label>
        <div class="mt-1 flex items-center">
          <span v-if="imagePreview" class="mr-4">
            <img :src="imagePreview" alt="Preview" class="h-20 w-20 object-cover rounded-md" />
          </span>
          <span class="relative h-12">
            <input 
              id="imageFile"
              ref="imageInput"
              type="file" 
              accept="image/*"
              @change="handleImageChange"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div class="px-4 py-2 border border-gray-300 rounded-md flex items-center bg-white hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16" />
              </svg>
              Upload Image
            </div>
          </span>
          <button 
            v-if="imageFile" 
            @click.prevent="clearImage" 
            type="button"
            class="ml-2 text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>
      
      <!-- Tags field -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
        <div class="mt-1">
          <input
            id="tags"
            v-model="tags.value"
            type="text"
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="technology, news, lifestyle"
          />
        </div>
        <p v-if="tags.hasError" class="mt-1 text-sm text-red-600">{{ tags.errorMessage }}</p>
      </div>
      
      <!-- Visibility toggle -->
      <div class="flex items-center">
        <input
          id="published"
          v-model="published.value"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label for="published" class="ml-2 block text-sm text-gray-900">
          Publish immediately
        </label>
      </div>
      
      <!-- Action buttons -->
      <div class="flex justify-end gap-4">
        <NuxtLink
          to="/"
          class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {{ isSubmitting ? 'Creating...' : 'Create Post' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import { useRouter } from '#imports';
import * as z from 'zod';
// @ts-ignore
import { useZodForm } from '~/composables/useZodForm';

const router = useRouter();
const error = ref('');
const imageInput = ref<HTMLInputElement | null>(null);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

// Define validation schema with Zod
const postSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters'),
  tags: z.string()
    .transform(value => value.split(',').map(tag => tag.trim()).filter(Boolean)),
  published: z.boolean().default(true)
});

// Use our custom Zod form composable
const { handleSubmit, createField, isSubmitting } = useZodForm(postSchema);

// Create form fields
const title = createField('title');
const content = createField('content');
const tags = createField('tags');
const published = createField('published');

// Handle image upload
function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error.value = 'Please select a valid image file';
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'Image size should not exceed 5MB';
      return;
    }
    
    imageFile.value = file;
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    error.value = '';
  }
}

// Clear selected image
function clearImage() {
  imageFile.value = null;
  imagePreview.value = null;
  if (imageInput.value) {
    imageInput.value.value = '';
  }
}

// Form submission handler
const onSubmit = handleSubmit(async (values) => {
  try {
    error.value = '';
    
    // Create FormData for image upload
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('tags', JSON.stringify(values.tags));
    formData.append('published', String(values.published));
    
    if (imageFile.value) {
      formData.append('imageFile', imageFile.value);
    }
    
    // Call your API to create the post
    // const response = await createPost(formData);
    
    console.log('Post creation submitted:', {
      ...values,
      imageFile: imageFile.value ? imageFile.value.name : null
    });
    
    // For now, just simulate a successful post creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to the home page or the new post
    router.push('/');
  } catch (err: any) {
    error.value = err.message || 'Failed to create post. Please try again.';
  }
});
</script>
