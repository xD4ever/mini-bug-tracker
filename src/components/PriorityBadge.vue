<script setup lang="ts">
import { computed } from 'vue'
import type { TicketPriority } from '../models/Ticket'

interface Props {
  priority: TicketPriority
  label?: string
  showDot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  showDot: true,
})

const defaultLabels: Record<TicketPriority, string> = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Haute',
}

const badgeClass = computed(() => {
  switch (props.priority) {
    case 'high':
      return 'bg-danger-subtle text-danger border border-danger-subtle'
    case 'medium':
      return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
    case 'low':
      return 'bg-success-subtle text-success border border-success-subtle'
    default:
      return 'bg-secondary-subtle text-secondary border border-secondary-subtle'
  }
})

const dotClass = computed(() => {
  switch (props.priority) {
    case 'high':
      return 'bg-danger'
    case 'medium':
      return 'bg-warning'
    case 'low':
      return 'bg-success'
    default:
      return 'bg-secondary'
  }
})
</script>

<template>
  <span class="badge rounded-pill fw-semibold d-inline-flex align-items-center gap-1 px-2 py-1" :class="badgeClass">
    <span v-if="showDot" class="rounded-circle d-inline-block" :class="dotClass" style="width: 6px; height: 6px;" aria-hidden="true"></span>
    <span>{{ label || defaultLabels[priority] || priority }}</span>
  </span>
</template>
