<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts, remove } = useToast()

function getToastClass(type: string) {
  switch (type) {
    case 'success':
      return 'text-bg-success'
    case 'error':
      return 'text-bg-danger'
    case 'warning':
      return 'text-bg-warning'
    default:
      return 'text-bg-primary'
  }
}
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090;" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show align-items-center border-0 shadow mb-2"
        :class="getToastClass(toast.type)"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i v-if="toast.type === 'success'" class="bi bi-check-circle-fill"></i>
            <i v-else-if="toast.type === 'error'" class="bi bi-exclamation-octagon-fill"></i>
            <i v-else-if="toast.type === 'warning'" class="bi bi-exclamation-triangle-fill"></i>
            <i v-else class="bi bi-info-circle-fill"></i>
            <span>{{ toast.message }}</span>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            aria-label="Fermer"
            @click="remove(toast.id)"
          ></button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
