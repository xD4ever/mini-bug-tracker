<script setup lang="ts">
import type { Ticket } from '../models/Ticket'
defineProps<{ ticket: Ticket }>()
</script>

<template>
  <RouterLink class="ticket-card" :to="{ name: 'ticket-detail', params: { id: ticket.id } }">
    <div class="ticket-card-top"><span class="ticket-id">#{{ ticket.id }}</span><span class="priority-badge" :class="`priority-${ticket.priority}`">{{ ticket.priorityLabel }}</span></div>
    <h3>{{ ticket.title }}</h3>
    <p>{{ ticket.description }}</p>
    <div class="ticket-card-bottom"><span class="status-badge" :class="`status-${ticket.status}`">{{ ticket.statusLabel }}</span><span class="arrow">→</span></div>
  </RouterLink>
</template>
