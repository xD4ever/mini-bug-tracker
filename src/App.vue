<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import ToastNotification from './components/ToastNotification.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="page-shell">
      <RouterView />
    </main>
    <ToastNotification />
  </div>
</template>
