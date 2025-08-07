<template>
  <div class="bg-white py-8 px-6 shadow-xl rounded-lg">
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue'

// Set the layout for this page
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
</script>
