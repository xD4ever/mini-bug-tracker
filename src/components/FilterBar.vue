<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { TicketFilterDto, TicketPriority, TicketStatus } from '../models/Ticket'

const props = defineProps<{
  modelValue: TicketFilterDto
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TicketFilterDto]
}>()

const searchInput = ref(props.modelValue.title || '')
const status = ref<TicketStatus | ''>(props.modelValue.status || '')
const priority = ref<TicketPriority | ''>(props.modelValue.priority || '')

let debounceTimer: ReturnType<typeof setTimeout> | undefined

// Synchronisation quand le parent modifie modelValue (ex: réinitialisation externe)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal.title !== searchInput.value) searchInput.value = newVal.title || ''
    if (newVal.status !== status.value) status.value = newVal.status || ''
    if (newVal.priority !== priority.value) priority.value = newVal.priority || ''
  },
  { deep: true },
)

const hasActiveFilters = computed(() => {
  return Boolean(searchInput.value || status.value || priority.value)
})

function applySearch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  emit('update:modelValue', {
    ...props.modelValue,
    title: searchInput.value.trim(),
    status: status.value,
    priority: priority.value,
    page: 1,
  })
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    applySearch()
  }, 300)
}

function onSelectChange() {
  applySearch()
}

function reset() {
  if (debounceTimer) clearTimeout(debounceTimer)
  searchInput.value = ''
  status.value = ''
  priority.value = ''
  emit('update:modelValue', {
    title: '',
    status: '',
    priority: '',
    page: 1,
  })
}
</script>

<template>
  <form class="card border shadow-sm mb-4" @submit.prevent="applySearch" role="search" aria-label="Filtres des tickets">
    <div class="card-body">
      <div class="row g-2 align-items-center">
        <!-- Champ de recherche -->
        <div class="col-12 col-md-5 col-lg-6">
          <div class="input-group">
            <span class="input-group-text bg-body-secondary border-end-0">
              <i class="bi bi-search text-secondary"></i>
            </span>
            <input
              v-model="searchInput"
              type="search"
              class="form-control border-start-0"
              placeholder="Rechercher par mot-clé (titre)..."
              aria-label="Rechercher un ticket par titre"
              @input="onInput"
              @keydown.enter.prevent="applySearch"
            />
            <button
              type="submit"
              class="btn btn-primary d-none d-sm-inline-block"
              title="Lancer la recherche"
              aria-label="Rechercher"
            >
              Rechercher
            </button>
          </div>
        </div>

        <!-- Filtre statut -->
        <div class="col-12 col-sm-6 col-md-3 col-lg-3">
          <select
            v-model="status"
            class="form-select"
            aria-label="Filtrer par statut"
            @change="onSelectChange"
          >
            <option value="">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
          </select>
        </div>

        <!-- Filtre priorité -->
        <div class="col-12 col-sm-6 col-md-3 col-lg-2">
          <select
            v-model="priority"
            class="form-select"
            aria-label="Filtrer par priorité"
            @change="onSelectChange"
          >
            <option value="">Toutes les priorités</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>
        </div>

        <!-- Bouton réinitialiser -->
        <div v-show="hasActiveFilters" class="col-12 col-lg-1 text-lg-end">
          <button
            type="button"
            class="btn btn-outline-secondary w-100 d-inline-flex align-items-center justify-content-center gap-1"
            title="Effacer les filtres"
            @click="reset"
          >
            <i class="bi bi-x-lg"></i>
            <span class="d-lg-none">Effacer</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
