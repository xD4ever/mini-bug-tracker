<script setup lang="ts">
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
</script>

<template>
  <span class="status-badge" :class="`status-${status}`">
    {{ label || defaultLabels[status] || status }}
  </span>
</template>
