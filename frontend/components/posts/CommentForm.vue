<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit" class="space-y-2">
      <Textarea
        v-model="content"
        placeholder="Write a comment..."
        :rows="2"
        :autoResize="true"
        class="w-full"
        :class="{ 'p-invalid': errors.content }"
      />
      <div v-if="errors.content" class="text-red-500 text-xs">
        {{ errors.content }}
      </div>

      <div class="flex justify-end">
        <Button
          type="submit"
          label="Post Comment"
          size="small"
          :loading="isSubmitting"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  postId: string;
}>();

const emit = defineEmits<{
  "comment-added": [comment: any];
}>();

// Form state
const content = ref("");
const errors = ref<{ content?: string }>({});
const isSubmitting = ref(false);

// Methods
const validateForm = () => {
  errors.value = {};

  if (!content.value.trim()) {
    errors.value.content = "Comment cannot be empty";
    return false;
  }

  if (content.value.length > 500) {
    errors.value.content = "Comment must be less than 500 characters";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    isSubmitting.value = true;

    // Emit the comment data to the parent component
    emit("comment-added", {
      content: content.value.trim(),
    });

    // Reset form
    content.value = "";
    errors.value = {};
  } catch (error) {
    console.error("Error submitting comment:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
