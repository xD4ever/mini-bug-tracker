<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import ToastNotification from './components/ToastNotification.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100 bg-body-tertiary">
    <AppHeader />
    <main class="container py-4 flex-grow-1">
      <RouterView />
    </main>
    <ToastNotification />
  </div>
</template>
