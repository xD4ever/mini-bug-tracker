<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmModal from '../components/ConfirmModal.vue'
import PriorityBadge from '../components/PriorityBadge.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useToast } from '../composables/useToast'
import { deleteTicket, getTicket, updateTicket } from '../services/ticketApi'
import type { Ticket, TicketPriority, TicketStatus } from '../models/Ticket'

const route = useRoute()
const router = useRouter()
const { success, error: toastError } = useToast()

const ticket = ref<Ticket | null>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const showDeleteModal = ref(false)
const deleting = ref(false)

async function loadTicket() {
  loading.value = true
  error.value = ''
  try {
    ticket.value = await getTicket(String(route.params.id))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ticket introuvable.'
  } finally {
    loading.value = false
  }
}

async function handleUpdateField(
  field: 'status' | 'priority',
  value: TicketStatus | TicketPriority,
) {
  if (!ticket.value || saving.value) return
  saving.value = true
  try {
    const updated = await updateTicket(ticket.value.id, { [field]: value })
    ticket.value = updated
    success(
      field === 'status'
        ? `Statut mis à jour : ${updated.statusLabel}`
        : `Priorité mise à jour : ${updated.priorityLabel}`,
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'La mise à jour a échoué.'
    toastError(msg)
  } finally {
    saving.value = false
  }
}

function promptDelete() {
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!ticket.value) return
  deleting.value = true
  try {
    await deleteTicket(ticket.value.id)
    showDeleteModal.value = false
    success(`Le ticket #${ticket.value.id} a été supprimé.`)
    router.push('/')
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'La suppression a échoué.'
    toastError(msg)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadTicket()
})
</script>

<template>
  <section class="detail-page">
    <RouterLink class="back-link" to="/">
      ← Retour au tableau de bord
    </RouterLink>

    <!-- Message d'erreur -->
    <div v-if="error" class="alert alert-error" role="alert">
      <span>{{ error }}</span>
      <button type="button" class="button button-ghost button-small" @click="loadTicket">
        Réessayer
      </button>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="empty-state">
      <span class="loader" aria-hidden="true"></span>
      <p>Chargement du ticket...</p>
    </div>

    <!-- Vue détaillée du ticket -->
    <template v-else-if="ticket">
      <div class="detail-header">
        <div class="detail-header-info">
          <div class="detail-tags">
            <span class="ticket-id">#{{ ticket.id }}</span>
            <PriorityBadge :priority="ticket.priority" :label="ticket.priorityLabel" />
            <StatusBadge :status="ticket.status" :label="ticket.statusLabel" />
          </div>
          <h1>{{ ticket.title }}</h1>
        </div>
        <button
          type="button"
          class="button button-danger"
          :disabled="deleting"
          @click="promptDelete"
        >
          🗑️ Supprimer le ticket
        </button>
      </div>

      <div class="detail-layout">
        <!-- Contenu principal -->
        <article class="detail-card">
          <h2 class="section-title">Description de l'anomalie</h2>
          <div class="description-box">
            <p class="description">{{ ticket.description }}</p>
          </div>

          <dl class="ticket-metadata">
            <div class="meta-item">
              <dt>Créé le</dt>
              <dd>{{ ticket.formattedCreatedAt }}</dd>
            </div>
            <div class="meta-item">
              <dt>Dernière modification</dt>
              <dd>{{ ticket.formattedUpdatedAt }}</dd>
            </div>
          </dl>
        </article>

        <!-- Panneau de contrôle des propriétés -->
        <aside class="detail-card controls">
          <h2 class="section-title">Propriétés</h2>

          <div class="control-group">
            <label for="detail-status">Statut actuel</label>
            <select
              id="detail-status"
              :value="ticket.status"
              :disabled="saving"
              @change="handleUpdateField('status', ($event.target as HTMLSelectElement).value as TicketStatus)"
            >
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
            </select>
          </div>

          <div class="control-group">
            <label for="detail-priority">Niveau de priorité</label>
            <select
              id="detail-priority"
              :value="ticket.priority"
              :disabled="saving"
              @change="handleUpdateField('priority', ($event.target as HTMLSelectElement).value as TicketPriority)"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>

          <div v-if="saving" class="saving-indicator">
            <span class="loader small-loader" aria-hidden="true"></span>
            <span>Mise à jour en cours...</span>
          </div>
        </aside>
      </div>

      <!-- Dialogue modal de confirmation de suppression -->
      <ConfirmModal
        :show="showDeleteModal"
        title="Supprimer définitivement ce ticket ?"
        :message="`Êtes-vous sûr de vouloir supprimer le ticket #${ticket.id} (${ticket.title}) ? Cette action est irréversible.`"
        confirm-text="Oui, supprimer"
        cancel-text="Annuler"
        :danger="true"
        @confirm="confirmDelete"
        @cancel="showDeleteModal = false"
      />
    </template>
  </section>
</template>
