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
      <div v-if="show" class="modal d-block bg-dark bg-opacity-50" tabindex="-1" role="dialog" aria-modal="true" :aria-label="title" @click.self="emit('cancel')">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-header border-bottom-0 pb-0">
              <h5 class="modal-title fw-bold">{{ title }}</h5>
              <button type="button" class="btn-close" aria-label="Close" @click="emit('cancel')"></button>
            </div>
            <div class="modal-body py-3">
              <p class="text-secondary mb-0">{{ message }}</p>
            </div>
            <div class="modal-footer border-top-0 pt-0">
              <button type="button" class="btn btn-outline-secondary" @click="emit('cancel')">
                {{ cancelText }}
              </button>
              <button
                type="button"
                class="btn"
                :class="danger ? 'btn-danger' : 'btn-primary'"
                @click="emit('confirm')"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
