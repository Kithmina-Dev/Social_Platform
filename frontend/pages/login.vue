<template>
  <div class="bg-white py-8 px-6 shadow-xl rounded-lg">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import LoginForm from "~/components/auth/LoginForm.vue";
import { useAuthStore } from "~/stores/auth";
import { onMounted } from "vue";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

onMounted(() => {
  const authStore = useAuthStore();

  if (window.location.pathname === "/login") {
    console.log("Login page loaded directly, ensuring clean auth state");
    authStore.logout();
  }
});
</script>
