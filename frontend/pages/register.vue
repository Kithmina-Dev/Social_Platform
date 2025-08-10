<template>
  <div class="bg-white py-8 px-6 shadow-xl rounded-lg">
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
</script>
