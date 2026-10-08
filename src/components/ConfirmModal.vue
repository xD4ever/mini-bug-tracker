<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmation',
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  danger: true,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="modal-backdrop" @click.self="emit('cancel')">
        <div class="modal-dialog" role="dialog" aria-modal="true" :aria-label="title">
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-message">{{ message }}</p>
          <div class="modal-actions">
            <button type="button" class="button button-ghost" @click="emit('cancel')">
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="button"
              :class="danger ? 'button-danger' : 'button-primary'"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
