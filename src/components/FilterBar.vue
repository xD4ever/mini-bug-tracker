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
  <form class="filter-bar" @submit.prevent="applySearch" role="search" aria-label="Filtres des tickets">
    <div class="search-field">
      <span class="search-icon" aria-hidden="true">🔍</span>
      <input
        v-model="searchInput"
        type="search"
        placeholder="Rechercher par mot-clé (titre)..."
        aria-label="Rechercher un ticket par titre"
        @input="onInput"
        @keydown.enter.prevent="applySearch"
      />
      <button
        type="submit"
        class="button button-primary button-small search-button"
        title="Lancer la recherche"
        aria-label="Rechercher"
      >
        Rechercher
      </button>
    </div>

    <div class="filter-selects">
      <select
        v-model="status"
        aria-label="Filtrer par statut"
        @change="onSelectChange"
      >
        <option value="">Tous les statuts</option>
        <option value="open">Ouvert</option>
        <option value="in_progress">En cours</option>
        <option value="resolved">Résolu</option>
      </select>

      <select
        v-model="priority"
        aria-label="Filtrer par priorité"
        @change="onSelectChange"
      >
        <option value="">Toutes les priorités</option>
        <option value="high">Haute</option>
        <option value="medium">Moyenne</option>
        <option value="low">Faible</option>
      </select>

      <button
        v-show="hasActiveFilters"
        type="button"
        class="button button-ghost reset-button"
        title="Effacer les filtres"
        @click="reset"
      >
        ✕ Réinitialiser
      </button>
    </div>
  </form>
</template>
