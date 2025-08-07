<template>
  <div class="w-full">
    <BaseForm
      :schema="postSchema"
      @submit="handleSubmit"
      v-slot="{ errors, isSubmitting }"
    >
      <div class="space-y-4">
        <BaseFormField
          name="content"
          label="What's on your mind?"
          placeholder="Share your thoughts..."
          component="textarea"
          :rows="4"
          required
          :error="errors.content"
        />
        
        <!-- File Upload -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Add Image (Optional)
          </label>
          <FileUpload
            v-model="selectedFile"
            mode="basic"
            accept="image/*"
            :max-file-size="5000000"
            choose-label="Choose Image"
            :auto="true"
            :show-cancel-button="false"
            @select="onFileSelect"
          />
          <p class="text-xs text-gray-500">
            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
        
        <!-- Preview Image -->
        <div v-if="imagePreview" class="relative">
          <img 
            :src="imagePreview" 
            alt="Preview" 
            class="w-full max-h-64 object-cover rounded-lg"
          />
          <button
            @click="removeImage"
            type="button"
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
        
        <div class="flex justify-end space-x-3">
          <BaseButton
            type="button"
            variant="outline"
            @click="clearForm"
            :disabled="isSubmitting"
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            :loading="isSubmitting"
          >
            {{ isSubmitting ? 'Creating Post...' : 'Create Post' }}
          </BaseButton>
        </div>
      </div>
    </BaseForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { usePostsStore } from '~/stores/posts'

// Props
interface Props {
  post?: any // For editing existing posts
}

const props = withDefaults(defineProps<Props>(), {
  post: null
})

// Emits
const emit = defineEmits<{
  'post-created': [post: any]
  'post-updated': [post: any]
}>()

// Store
const postsStore = usePostsStore()

// Form data
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

// Validation schema
const postSchema = toTypedSchema(z.object({
  content: z.string()
    .min(1, 'Post content is required')
    .max(1000, 'Post content must be less than 1000 characters')
}))

// Methods
const onFileSelect = (event: any) => {
  const file = event.files[0]
  if (file) {
    selectedFile.value = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedFile.value = null
  imagePreview.value = null
}

const clearForm = () => {
  selectedFile.value = null
  imagePreview.value = null
  // Reset form will be handled by VeeValidate
}

const handleSubmit = async (values: any) => {
  try {
    const postData = {
      content: values.content,
      image: selectedFile.value || undefined
    }

    let result
    if (props.post) {
      // Update existing post
      result = await postsStore.updatePost(props.post.id, postData)
      emit('post-updated', result)
    } else {
      // Create new post
      result = await postsStore.createPost(postData)
      emit('post-created', result)
    }

    // Clear form
    clearForm()
  } catch (error: any) {
    console.error('Error creating/updating post:', error)
    // Error handling will be done by the store
  }
}
</script>
