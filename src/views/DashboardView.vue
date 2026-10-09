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
    <section class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
      <div>
        <p class="text-uppercase tracking-wide text-primary fw-bold small mb-1">Suivi des anomalies</p>
        <h1 class="h2 fw-bold mb-1">Tableau de bord</h1>
        <p class="text-secondary mb-0">Visualisez, filtrez et gérez les anomalies de votre projet en temps réel.</p>
      </div>
      <RouterLink class="btn btn-primary d-inline-flex align-items-center gap-1 shadow-sm" to="/tickets/new">
        <i class="bi bi-plus-lg"></i>
        <span>Créer un ticket</span>
      </RouterLink>
    </section>

    <!-- Barre de filtres et recherche connectée à l'API -->
    <FilterBar :model-value="filters" @update:model-value="onFiltersChange" />

    <!-- Message d'erreur -->
    <div v-if="error" class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
      <span>{{ error }}</span>
      <button type="button" class="btn btn-outline-danger btn-sm" @click="loadTickets">
        Réessayer
      </button>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p class="text-secondary mb-0">Chargement des tickets...</p>
    </div>

    <!-- Grille de tickets -->
    <div v-else-if="tickets.length > 0" class="row g-3">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <TicketCard :ticket="ticket" />
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="card border-dashed text-center py-5 my-4 bg-body">
      <div class="card-body">
        <div class="fs-1 text-secondary mb-2">📋</div>
        <h5 class="fw-bold mb-2">Aucun ticket trouvé</h5>
        <p class="text-secondary mb-3">Modifiez vos filtres de recherche ou créez un nouveau ticket.</p>
        <RouterLink class="btn btn-primary btn-sm" to="/tickets/new">
          Créer un ticket
        </RouterLink>
      </div>
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
