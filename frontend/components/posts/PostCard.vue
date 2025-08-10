<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Post Header -->
    <div class="p-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <BaseAvatar
            :image="post.author.avatar"
            :label="post.author.username.charAt(0).toUpperCase()"
            size="normal"
          />
          <div>
            <h3 class="font-semibold text-gray-900">
              {{ post.author.username }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ formatDate(post.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Post Actions Menu -->
        <div v-if="isAuthor" class="relative">
          <Button
            icon="pi pi-ellipsis-v"
            text
            rounded
            @click="toggleMenu"
            aria-haspopup="true"
            aria-controls="post_menu"
          />
          <Menu id="post_menu" ref="menu" :model="menuItems" :popup="true" />
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <div class="p-4">
      <p class="text-gray-900 whitespace-pre-wrap">{{ post.content }}</p>

      <!-- Post Image -->
      <div v-if="postImage" class="mt-4">
        <img
          :src="postImage"
          :alt="post.content"
          class="w-full max-h-96 object-cover rounded-lg"
          @error="handleImageError"
        />
      </div>
    </div>

    <!-- Post Actions -->
    <div class="px-4 py-3 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Like Button -->
          <button
            @click="handleLike"
            class="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
            :class="{ 'text-red-500': post.isLiked }"
          >
            <i
              class="pi"
              :class="post.isLiked ? 'pi-heart-fill' : 'pi-heart'"
            ></i>
            <span class="text-sm">{{ post.likes }}</span>
          </button>

          <!-- Comment Button -->
          <button
            @click="toggleComments"
            class="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <i class="pi pi-comment"></i>
            <span class="text-sm">{{ post.comments }}</span>
          </button>
        </div>

        <!-- Share Button -->
        <button
          @click="handleShare"
          class="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
        >
          <i class="pi pi-share-alt"></i>
          <span class="text-sm">Share</span>
        </button>
      </div>
    </div>

    <!-- Comments Section -->
    <div v-if="showComments" class="border-t border-gray-100">
      <CommentSection :post-id="post.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  post: {
    id: string;
    content: string;
    imageUrl?: string;
    author: {
      id: string;
      username: string;
      avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    files?: Array<{
      id: string;
      filename: string;
      path: string;
      mimetype: string;
      size: number;
    }>;
  };
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "post-updated": [post: any];
  "post-deleted": [postId: string];
}>();

// Stores
const authStore = useAuthStore();
const postsStore = usePostsStore();

// Local state
const showComments = ref(false);
const menu = ref();

// Computed
const isAuthor = computed(() => {
  return authStore.currentUser?.id === props.post.author.id;
});

// Get the first image from the post files or use imageUrl if available
const postImage = computed(() => {
  // First check if the post has an imageUrl property (backward compatibility)
  if (props.post.imageUrl) {
    return props.post.imageUrl;
  }

  // Then check if post has files
  if (
    props.post.files &&
    Array.isArray(props.post.files) &&
    props.post.files.length > 0
  ) {
    // Get the first file which should be an image
    const file = props.post.files[0];
    if (!file) return null;

    console.log("Found file in post:", file);
    console.log("File path:", file.path);

    // URL to the file
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBaseUrl || "http://localhost:3000";

    // Update path construction to match the backend's static file serving
    // The backend serves files at /uploads/filename.png
    // Extract just the filename
    const filename = file.path.split("/").pop();
    const imageUrl = `${baseUrl}/uploads/${filename}`;
    console.log("Constructed image URL:", imageUrl);
    return imageUrl;
  }

  return null;
});
const menuItems = computed(() => [
  {
    label: "Edit",
    icon: "pi pi-pencil",
    command: () => handleEdit(),
  },
  {
    label: "Delete",
    icon: "pi pi-trash",
    command: () => handleDelete(),
  },
]);

// Methods
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

const toggleMenu = (event: Event) => {
  menu.value?.toggle(event);
};

const handleLike = async () => {
  await postsStore.likePost(props.post.id);
};

const toggleComments = () => {
  showComments.value = !showComments.value;
};

const handleShare = () => {
  // Implement share functionality
  if (navigator.share) {
    navigator.share({
      title: "Check out this post",
      text: props.post.content,
      url: window.location.href,
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  }
};

const handleImageError = (e: Event) => {
  console.error("Failed to load image:", e);
  // Set a fallback or hide the image container
  const imgElement = e.target as HTMLImageElement;
  imgElement.style.display = "none";
};

const handleEdit = () => {
  // Emit edit event - parent component can handle opening edit modal
  emit("post-updated", props.post);
};

const handleDelete = async () => {
  try {
    await postsStore.deletePost(props.post.id);
    emit("post-deleted", props.post.id);
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};
</script>
