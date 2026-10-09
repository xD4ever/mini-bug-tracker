<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header class="navbar navbar-expand-lg border-bottom sticky-top bg-body">
    <div class="container">
      <RouterLink class="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary" to="/">
        <span class="badge bg-primary rounded-pill p-1 d-inline-flex align-items-center justify-content-center" style="width: 24px; height: 24px;">
          <i class="bi bi-check-lg text-white fs-6"></i>
        </span>
        <span>Bug<span class="text-body-emphasis">Board</span></span>
      </RouterLink>

      <div class="d-flex align-items-center gap-2 ms-auto">
        <RouterLink class="nav-link px-2 d-none d-sm-inline-block text-secondary" to="/">
          Tableau de bord
        </RouterLink>
        <RouterLink class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1" to="/tickets/new">
          <i class="bi bi-plus-lg"></i>
          <span>Nouveau ticket</span>
        </RouterLink>
        <button
          class="btn btn-outline-secondary btn-sm rounded-circle d-inline-flex align-items-center justify-content-center"
          style="width: 34px; height: 34px;"
          type="button"
          :title="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'"
          :aria-label="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'"
          @click="toggleTheme"
        >
          <i v-if="isDark" class="bi bi-sun-fill text-warning"></i>
          <i v-else class="bi bi-moon-stars-fill"></i>
        </button>
      </div>
    </div>
  </header>
</template>
