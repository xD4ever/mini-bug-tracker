<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import FilterBar from '../components/FilterBar.vue'
import TicketCard from '../components/TicketCard.vue'
import { getTickets } from '../services/ticketApi'
import type { Ticket } from '../models/Ticket'

const tickets = ref<Ticket[]>([])
const loading = ref(true)
const error = ref('')
const page = ref(1)
const totalPages = ref(1)
const filters = ref({ title: '', status: '', priority: '' })
async function load() {
  loading.value = true; error.value = ''
  try {
    const result = await getTickets({ page: page.value, ...filters.value })
    tickets.value = result.items; totalPages.value = result.totalPages
  } catch (err) { error.value = err instanceof Error ? err.message : 'Impossible de charger les tickets.' }
  finally { loading.value = false }
}
watch(filters, () => { page.value = 1; load() }, { deep: true })
onMounted(load)
</script>

<template>
  <section class="page-heading"><div><p class="eyebrow">Suivi des anomalies</p><h1>Tableau de bord</h1><p class="muted">Visualisez et gérez les tickets de votre équipe.</p></div><RouterLink class="button button-primary" to="/tickets/new">+ Créer un ticket</RouterLink></section>
  <FilterBar v-model="filters" />
  <div v-if="error" class="alert alert-error">{{ error }}</div>
  <div v-if="loading" class="empty-state"><span class="loader"></span>Chargement des tickets...</div>
  <div v-else-if="tickets.length" class="ticket-grid"><TicketCard v-for="ticket in tickets" :key="ticket.id" :ticket="ticket" /></div>
  <div v-else class="empty-state"><strong>Aucun ticket trouvé</strong><span>Modifiez vos filtres ou créez un nouveau ticket.</span></div>
  <div v-if="totalPages > 1" class="pagination"><button class="button button-ghost" :disabled="page === 1" @click="page--; load()">← Précédent</button><span>Page {{ page }} sur {{ totalPages }}</span><button class="button button-ghost" :disabled="page === totalPages" @click="page++; load()">Suivant →</button></div>
</template>
