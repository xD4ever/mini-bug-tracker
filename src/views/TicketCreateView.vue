<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createTicket } from '../services/ticketApi'
import { useToast } from '../composables/useToast'
import type { CreateTicketDto, TicketPriority } from '../models/Ticket'

const router = useRouter()
const { success } = useToast()

const form = reactive<CreateTicketDto>({
  title: '',
  description: '',
  priority: 'medium',
})

const error = ref('')
const saving = ref(false)

async function submit() {
  if (!form.title.trim() || !form.description.trim()) {
    error.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  error.value = ''
  saving.value = true

  try {
    const ticket = await createTicket({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
    })
    success(`Le ticket #${ticket.id} a été créé avec succès !`)
    router.push({ name: 'ticket-detail', params: { id: ticket.id } })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'La création du ticket a échoué.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-10 col-lg-8">
      <RouterLink class="btn btn-link text-decoration-none p-0 mb-3 d-inline-flex align-items-center gap-1 text-secondary" to="/">
        <i class="bi bi-arrow-left"></i>
        <span>Retour au tableau de bord</span>
      </RouterLink>

      <div class="mb-4">
        <p class="text-uppercase tracking-wide text-primary fw-bold small mb-1">Nouvelle anomalie</p>
        <h1 class="h2 fw-bold mb-1">Créer un ticket</h1>
        <p class="text-secondary mb-0">Décrivez le problème pour aider l'équipe à le reproduire et le résoudre rapidement.</p>
      </div>

      <div class="card shadow-sm border">
        <div class="card-body p-4">
          <form @submit.prevent="submit" novalidate>
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <div class="mb-3">
              <label for="ticket-title" class="form-label fw-semibold">
                Titre <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <input
                id="ticket-title"
                v-model="form.title"
                type="text"
                class="form-control"
                required
                minlength="3"
                maxlength="255"
                placeholder="Ex. Le bouton de validation du formulaire est grisé"
                aria-describedby="title-help"
              />
              <div id="title-help" class="form-text">
                Donnez un titre clair et synthétique (au moins 3 caractères).
              </div>
            </div>

            <div class="mb-3">
              <label for="ticket-description" class="form-label fw-semibold">
                Description détaillée <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <textarea
                id="ticket-description"
                v-model="form.description"
                class="form-control"
                required
                minlength="15"
                rows="6"
                placeholder="Décrivez précisément le comportement attendu et les étapes pour reproduire l'anomalie..."
                aria-describedby="desc-help"
              ></textarea>
              <div class="d-flex justify-content-between align-items-center mt-1">
                <small id="desc-help" class="form-text text-secondary mb-0">
                  Fournissez les étapes et le contexte nécessaires.
                </small>
                <small
                  class="fw-semibold"
                  :class="form.description.length >= 15 ? 'text-success' : 'text-secondary'"
                >
                  {{ form.description.length }} caractères (15 minimum)
                </small>
              </div>
            </div>

            <div class="mb-4">
              <label for="ticket-priority" class="form-label fw-semibold">
                Priorité <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <select id="ticket-priority" v-model="form.priority" class="form-select">
                <option value="low">Faible — Impact mineur / cosmétique</option>
                <option value="medium">Moyenne — Impact modéré sur l'usage</option>
                <option value="high">Haute — Blocage critique / panne majeure</option>
              </select>
            </div>

            <div class="d-flex justify-content-end gap-2 pt-2 border-top">
              <RouterLink class="btn btn-outline-secondary" to="/">
                Annuler
              </RouterLink>
              <button
                type="submit"
                class="btn btn-primary d-inline-flex align-items-center gap-2"
                :disabled="saving || !form.title.trim() || form.description.length < 15"
              >
                <span v-if="saving" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span>{{ saving ? 'Création en cours...' : 'Créer le ticket' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
