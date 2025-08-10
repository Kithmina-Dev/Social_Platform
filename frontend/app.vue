<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">

const authStore = useAuthStore();

onMounted(async () => {
  // Initialize authentication state on app mount
  try {
    console.log("App mounted, initializing auth state");
    await authStore.initializeAuth();
    console.log(
      "Auth initialization complete, authenticated:",
      authStore.isAuthenticated
    );
  } catch (error) {
    console.error("Error initializing auth state:", error);
  }
});
</script>

<style>
/* Global styles */
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

#app {
  min-height: 100vh;
}
</style>
