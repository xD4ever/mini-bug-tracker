<script setup lang="ts">
import { computed } from 'vue'
import type { TicketStatus } from '../models/Ticket'

interface Props {
  status: TicketStatus
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
})

const defaultLabels: Record<TicketStatus, string> = {
  open: 'Ouvert',
  in_progress: 'En cours',
  resolved: 'Résolu',
}

const badgeClass = computed(() => {
  switch (props.status) {
    case 'open':
      return 'bg-primary-subtle text-primary border border-primary-subtle'
    case 'in_progress':
      return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
    case 'resolved':
      return 'bg-success-subtle text-success border border-success-subtle'
    default:
      return 'bg-secondary-subtle text-secondary border border-secondary-subtle'
  }
})
</script>

<template>
  <span class="badge rounded-pill fw-semibold px-2 py-1" :class="badgeClass">
    {{ label || defaultLabels[status] || status }}
  </span>
</template>
