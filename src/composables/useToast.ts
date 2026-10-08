import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const toasts = ref<Toast[]>([])
let counter = 0

export function useToast() {
  function show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 4000) {
    const id = ++counter
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  function success(message: string, duration = 4000) {
    show(message, 'success', duration)
  }

  function error(message: string, duration = 5000) {
    show(message, 'error', duration)
  }

  function info(message: string, duration = 4000) {
    show(message, 'info', duration)
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    remove,
  }
}
