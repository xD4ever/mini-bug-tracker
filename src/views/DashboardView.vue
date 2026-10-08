<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import FilterBar from '../components/FilterBar.vue'
import PaginationBar from '../components/PaginationBar.vue'
import TicketCard from '../components/TicketCard.vue'
import { getTickets } from '../services/ticketApi'
import type { Ticket, TicketFilterDto } from '../models/Ticket'

const tickets = ref<Ticket[]>([])
const loading = ref(true)
const error = ref('')
const page = ref(1)
const totalPages = ref(1)
const totalItems = ref<number | undefined>(undefined)

const filters = reactive<TicketFilterDto>({
  title: '',
  status: '',
  priority: '',
})

async function loadTickets() {
  loading.value = true
  error.value = ''
  try {
    const result = await getTickets({
      page: page.value,
      title: filters.title,
      status: filters.status,
      priority: filters.priority,
    })
    tickets.value = result.items
    totalPages.value = result.totalPages
    totalItems.value = result.totalItems
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Impossible de charger les tickets. Veuillez vérifier la connexion.'
  } finally {
    loading.value = false
  }
}

function onFiltersChange(newFilters: TicketFilterDto) {
  filters.title = newFilters.title || ''
  filters.status = newFilters.status || ''
  filters.priority = newFilters.priority || ''
  page.value = 1
  loadTickets()
}

function onPageChange(newPage: number) {
  page.value = newPage
  loadTickets()
}

onMounted(() => {
  loadTickets()
})
</script>

<template>
  <div class="dashboard-container">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Suivi des anomalies</p>
        <h1>Tableau de bord</h1>
        <p class="muted">Visualisez, filtrez et gérez les anomalies de votre projet en temps réel.</p>
      </div>
      <RouterLink class="button button-primary" to="/tickets/new">
        + Créer un ticket
      </RouterLink>
    </section>

    <!-- Barre de filtres et recherche connectée à l'API -->
    <FilterBar :model-value="filters" @update:model-value="onFiltersChange" />

    <!-- Message d'erreur -->
    <div v-if="error" class="alert alert-error" role="alert">
      <span>{{ error }}</span>
      <button type="button" class="button button-ghost button-small" @click="loadTickets">
        Réessayer
      </button>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="empty-state">
      <span class="loader" aria-hidden="true"></span>
      <p>Chargement des tickets...</p>
    </div>

    <!-- Grille de tickets -->
    <div v-else-if="tickets.length > 0" class="ticket-grid">
      <TicketCard
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
      />
    </div>

    <!-- État vide -->
    <div v-else class="empty-state">
      <span class="empty-icon" aria-hidden="true">📋</span>
      <strong>Aucun ticket trouvé</strong>
      <span>Modifiez vos filtres de recherche ou créez un nouveau ticket.</span>
      <RouterLink class="button button-primary button-small" to="/tickets/new">
        Créer un ticket
      </RouterLink>
    </div>

    <!-- Pagination réutilisable connectée à l'API -->
    <PaginationBar
      v-if="!loading && totalPages > 1"
      :current-page="page"
      :total-pages="totalPages"
      :total-items="totalItems"
      @update:current-page="onPageChange"
    />
  </div>
</template>
