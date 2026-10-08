<script setup lang="ts">
import type { Ticket } from '../models/Ticket'
import PriorityBadge from './PriorityBadge.vue'
import StatusBadge from './StatusBadge.vue'

defineProps<{
  ticket: Ticket
}>()
</script>

<template>
  <RouterLink
    class="ticket-card"
    :to="{ name: 'ticket-detail', params: { id: ticket.id } }"
    :aria-label="`Ticket #${ticket.id}: ${ticket.title}`"
  >
    <div class="ticket-card-top">
      <span class="ticket-id">#{{ ticket.id }}</span>
      <PriorityBadge :priority="ticket.priority" :label="ticket.priorityLabel" />
    </div>

    <h3 class="ticket-title">{{ ticket.title }}</h3>
    <p class="ticket-description">{{ ticket.description }}</p>

    <div class="ticket-card-bottom">
      <StatusBadge :status="ticket.status" :label="ticket.statusLabel" />
      <span class="arrow" aria-hidden="true">→</span>
    </div>
  </RouterLink>
</template>
