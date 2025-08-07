<template>
  <div class="bg-white py-8 px-6 shadow-xl rounded-lg">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'

// Set the layout for this page
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
</script>
