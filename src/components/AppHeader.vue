<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">✓</span>
        <span>Bug<span class="brand-accent">Board</span></span>
      </RouterLink>
      <nav>
        <RouterLink to="/">Tableau de bord</RouterLink>
        <RouterLink class="button button-primary button-small" to="/tickets/new">+ Nouveau ticket</RouterLink>
        <button
          class="theme-toggle-btn"
          type="button"
          :title="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'"
          :aria-label="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'"
          @click="toggleTheme"
        >
          <span v-if="isDark" class="theme-icon">☀️</span>
          <span v-else class="theme-icon">🌙</span>
        </button>
      </nav>
    </div>
  </header>
</template>
