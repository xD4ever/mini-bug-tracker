<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: { title: string; status: string; priority: string } }>()
const emit = defineEmits<{ 'update:modelValue': [value: { title: string; status: string; priority: string }] }>()

const searchInput = ref(props.modelValue.title)
const status = ref(props.modelValue.status)
const priority = ref(props.modelValue.priority)

let debounceTimer: ReturnType<typeof setTimeout> | undefined

// Sync when parent updates modelValue (e.g. external reset)
watch(() => props.modelValue, (newVal) => {
  searchInput.value = newVal.title
  status.value = newVal.status
  priority.value = newVal.priority
}, { deep: true })

function applySearch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  emit('update:modelValue', {
    title: searchInput.value.trim(),
    status: status.value,
    priority: priority.value,
  })
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    applySearch()
  }, 400)
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
  })
}
</script>

<template>
  <form class="filter-bar" @submit.prevent="applySearch">
    <div class="search-field">
      <span class="search-icon">🔍</span>
      <input
        v-model="searchInput"
        type="search"
        placeholder="Rechercher un ticket..."
        aria-label="Rechercher un ticket"
        @input="onInput"
        @keydown.enter.prevent="applySearch"
      />
      <button
        type="submit"
        class="button button-primary button-small search-button"
        title="Rechercher"
        aria-label="Rechercher"
      >
        Rechercher
      </button>
    </div>
    <select v-model="status" aria-label="Filtrer par statut" @change="onSelectChange">
      <option value="">Tous les statuts</option>
      <option value="open">Ouverts</option>
      <option value="in_progress">En cours</option>
      <option value="resolved">Résolus</option>
    </select>
    <select v-model="priority" aria-label="Filtrer par priorité" @change="onSelectChange">
      <option value="">Toutes les priorités</option>
      <option value="high">Haute</option>
      <option value="medium">Moyenne</option>
      <option value="low">Faible</option>
    </select>
    <button type="button" class="button button-ghost" @click="reset">Réinitialiser</button>
  </form>
</template>
