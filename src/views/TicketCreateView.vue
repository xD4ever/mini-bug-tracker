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
  <section class="form-page">
    <RouterLink class="back-link" to="/">
      ← Retour au tableau de bord
    </RouterLink>

    <div class="form-header">
      <p class="eyebrow">Nouvelle anomalie</p>
      <h1>Créer un ticket</h1>
      <p class="muted">Décrivez le problème pour aider l'équipe à le reproduire et le résoudre rapidement.</p>
    </div>

    <form class="form-card" @submit.prevent="submit" novalidate>
      <div v-if="error" class="alert alert-error" role="alert">
        {{ error }}
      </div>

      <div class="form-group">
        <label for="ticket-title">
          Titre <span class="required" aria-hidden="true">*</span>
        </label>
        <input
          id="ticket-title"
          v-model="form.title"
          type="text"
          required
          minlength="3"
          maxlength="255"
          placeholder="Ex. Le bouton de validation du formulaire est grisé"
          aria-describedby="title-help"
        />
        <small id="title-help" class="form-help">
          Donnez un titre clair et synthétique (au moins 3 caractères).
        </small>
      </div>

      <div class="form-group">
        <label for="ticket-description">
          Description détaillée <span class="required" aria-hidden="true">*</span>
        </label>
        <textarea
          id="ticket-description"
          v-model="form.description"
          required
          minlength="15"
          rows="6"
          placeholder="Décrivez précisément le comportement attendu et les étapes pour reproduire l'anomalie..."
          aria-describedby="desc-help"
        ></textarea>
        <div class="form-field-footer">
          <small id="desc-help" class="form-help">
            Fournissez les étapes et le contexte nécessaires.
          </small>
          <small
            class="char-counter"
            :class="{ 'char-valid': form.description.length >= 15 }"
          >
            {{ form.description.length }} caractères (15 minimum)
          </small>
        </div>
      </div>

      <div class="form-group">
        <label for="ticket-priority">
          Priorité <span class="required" aria-hidden="true">*</span>
        </label>
        <select id="ticket-priority" v-model="form.priority">
          <option value="low">Faible — Impact mineur / cosmétique</option>
          <option value="medium">Moyenne — Impact modéré sur l'usage</option>
          <option value="high">Haute — Blocage critique / panne majeure</option>
        </select>
      </div>

      <div class="form-actions">
        <RouterLink class="button button-ghost" to="/">
          Annuler
        </RouterLink>
        <button
          type="submit"
          class="button button-primary"
          :disabled="saving || !form.title.trim() || form.description.length < 15"
        >
          <span v-if="saving" class="button-spinner" aria-hidden="true"></span>
          {{ saving ? 'Création en cours...' : 'Créer le ticket' }}
        </button>
      </div>
    </form>
  </section>
</template>
