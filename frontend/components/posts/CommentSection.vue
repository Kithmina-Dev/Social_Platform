<template>
  <div class="p-4">
    <!-- Comment Form -->
    <div class="mb-4">
      <div class="flex space-x-3">
        <BaseAvatar
          :image="currentUser?.avatar"
          :label="currentUser?.username?.charAt(0).toUpperCase()"
          size="normal"
        />
        <div class="flex-1">
          <BaseForm
            :schema="commentSchema"
            @submit="handleSubmitComment"
            v-slot="{ errors, isSubmitting }"
          >
            <div class="space-y-2">
              <BaseFormField
                name="content"
                placeholder="Write a comment..."
                component="textarea"
                :rows="2"
                required
                :error="errors.content"
              />
              <div class="flex justify-end">
                <BaseButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  :loading="isSubmitting"
                >
                  {{ isSubmitting ? "Posting..." : "Post Comment" }}
                </BaseButton>
              </div>
            </div>
          </BaseForm>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div class="space-y-4">
      <div v-if="isLoading" class="text-center py-4">
        <div
          class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
        ></div>
        <p class="mt-2 text-sm text-gray-600">Loading comments...</p>
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-4">
        <p class="text-sm text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex space-x-3"
        >
          <BaseAvatar
            :image="comment.author.avatar"
            :label="comment.author.username.charAt(0).toUpperCase()"
            size="normal"
          />
          <div class="flex-1">
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-sm text-gray-900">
                  {{ comment.author.username }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(comment.createdAt) }}
                </span>
              </div>
              <p class="text-sm text-gray-700">{{ comment.content }}</p>
            </div>

            <!-- Comment Actions -->
            <div class="flex items-center space-x-4 mt-2 ml-3">
              <button
                @click="handleLikeComment(comment.id)"
                class="text-xs text-gray-500 hover:text-red-500 transition-colors"
                :class="{ 'text-red-500': comment.isLiked }"
              >
                <i
                  class="pi"
                  :class="comment.isLiked ? 'pi-heart-fill' : 'pi-heart'"
                ></i>
                <span class="ml-1">{{ comment.likes }}</span>
              </button>

              <button
                v-if="isCommentAuthor(comment)"
                @click="handleDeleteComment(comment.id)"
                class="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Comments -->
      <div v-if="hasMoreComments && !isLoading" class="text-center">
        <BaseButton
          @click="loadMoreComments"
          variant="outline"
          size="sm"
          :loading="isLoadingMore"
        >
          Load More Comments
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useRuntimeConfig } from "nuxt/app";

// Props
interface Props {
  postId: string;
}

const props = defineProps<Props>();

// Store
const authStore = useAuthStore();

// Local state
const comments = ref<any[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const currentPage = ref(1);
const hasMoreComments = ref(true);
const pageSize = 10;

// Computed
const currentUser = computed(() => authStore.currentUser);

// Validation schema
const commentSchema = toTypedSchema(
  z.object({
    content: z
      .string()
      .min(1, "Comment content is required")
      .max(500, "Comment must be less than 500 characters"),
  })
);

// Methods
const fetchComments = async (page = 1) => {
  try {
    isLoading.value = true;
    const config = useRuntimeConfig();

    const response = await $fetch<{ comments: any[]; hasMore: boolean }>(
      `/posts/${props.postId}/comments`,
      {
        baseURL: config.public.apiBaseUrl as string,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        params: {
          page,
          limit: pageSize,
        },
      }
    );

    if (page === 1) {
      comments.value = response.comments;
    } else {
      comments.value.push(...response.comments);
    }

    hasMoreComments.value = response.hasMore;
    currentPage.value = page;
  } catch (err: any) {
    console.error("Error fetching comments:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadMoreComments = async () => {
  if (isLoadingMore.value || !hasMoreComments.value) return;

  try {
    isLoadingMore.value = true;
    await fetchComments(currentPage.value + 1);
  } finally {
    isLoadingMore.value = false;
  }
};

const handleSubmitComment = async (values: any) => {
  try {
    const config = useRuntimeConfig();

    const newComment = await $fetch(`/posts/${props.postId}/comments`, {
      baseURL: config.public.apiBaseUrl as string,
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body: {
        content: values.content,
      },
    });

    // Add the new comment to the beginning of the list
    comments.value.unshift(newComment);
  } catch (err: any) {
    console.error("Error creating comment:", err);
  }
};

const handleLikeComment = async (commentId: string) => {
  try {
    const config = useRuntimeConfig();

    await $fetch(`/comments/${commentId}/like`, {
      baseURL: config.public.apiBaseUrl as string,
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    // Update the comment's like status
    const comment = comments.value.find((c) => c.id === commentId);
    if (comment) {
      comment.isLiked = !comment.isLiked;
      comment.likes += comment.isLiked ? 1 : -1;
    }
  } catch (err: any) {
    console.error("Error liking comment:", err);
  }
};

const handleDeleteComment = async (commentId: string) => {
  try {
    const config = useRuntimeConfig();

    await $fetch(`/comments/${commentId}`, {
      baseURL: config.public.apiBaseUrl as string,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    // Remove the comment from the list
    comments.value = comments.value.filter((c) => c.id !== commentId);
  } catch (err: any) {
    console.error("Error deleting comment:", err);
  }
};

const isCommentAuthor = (comment: any) => {
  return currentUser.value?.id === comment.author.id;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Lifecycle
onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchComments();
  }
});
</script>
