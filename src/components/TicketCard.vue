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
    class="card h-100 text-decoration-none shadow-sm ticket-card-hover border transition"
    :to="{ name: 'ticket-detail', params: { id: ticket.id } }"
    :aria-label="`Ticket #${ticket.id}: ${ticket.title}`"
  >
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge bg-secondary-subtle text-secondary fw-semibold">#{{ ticket.id }}</span>
        <PriorityBadge :priority="ticket.priority" :label="ticket.priorityLabel" />
      </div>

      <h5 class="card-title text-body-emphasis mb-2 fs-6 fw-bold text-truncate" :title="ticket.title">
        {{ ticket.title }}
      </h5>
      <p class="card-text text-secondary small flex-grow-1 text-truncate-2">
        {{ ticket.description }}
      </p>

      <div class="d-flex justify-content-between align-items-center pt-2 mt-auto border-top">
        <StatusBadge :status="ticket.status" :label="ticket.statusLabel" />
        <i class="bi bi-arrow-right text-primary"></i>
      </div>
    </div>
  </RouterLink>
</template>
