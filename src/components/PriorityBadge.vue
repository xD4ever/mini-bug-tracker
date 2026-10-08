<script setup lang="ts">
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
</script>

<template>
  <span class="priority-badge" :class="`priority-${priority}`">
    <span v-if="showDot" class="priority-dot" :class="`priority-${priority}`" aria-hidden="true"></span>
    <span class="priority-text">{{ label || defaultLabels[priority] || priority }}</span>
  </span>
</template>
