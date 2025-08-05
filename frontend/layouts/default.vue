<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
</script>
