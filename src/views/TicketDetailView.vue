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
  <div class="row justify-content-center">
    <div class="col-12 col-xl-10">
      <RouterLink class="btn btn-link text-decoration-none p-0 mb-3 d-inline-flex align-items-center gap-1 text-secondary" to="/">
        <i class="bi bi-arrow-left"></i>
        <span>Retour au tableau de bord</span>
      </RouterLink>

      <!-- Message d'erreur -->
      <div v-if="error" class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
        <span>{{ error }}</span>
        <button type="button" class="btn btn-outline-danger btn-sm" @click="loadTicket">
          Réessayer
        </button>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="text-secondary mb-0">Chargement du ticket...</p>
      </div>

      <!-- Vue détaillée du ticket -->
      <template v-else-if="ticket">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="badge bg-secondary-subtle text-secondary fw-semibold">#{{ ticket.id }}</span>
              <PriorityBadge :priority="ticket.priority" :label="ticket.priorityLabel" />
              <StatusBadge :status="ticket.status" :label="ticket.statusLabel" />
            </div>
            <h1 class="h2 fw-bold mb-0">{{ ticket.title }}</h1>
          </div>
          <button
            type="button"
            class="btn btn-outline-danger d-inline-flex align-items-center gap-2"
            :disabled="deleting"
            @click="promptDelete"
          >
            <i class="bi bi-trash"></i>
            <span>Supprimer le ticket</span>
          </button>
        </div>

        <div class="row g-4">
          <!-- Contenu principal -->
          <div class="col-12 col-lg-8">
            <div class="card shadow-sm border h-100">
              <div class="card-body p-4">
                <h2 class="h5 fw-bold mb-3">Description de l'anomalie</h2>
                <div class="p-3 bg-body-tertiary rounded mb-4 text-break" style="white-space: pre-wrap; font-family: inherit; line-height: 1.6;">
                  {{ ticket.description }}
                </div>

                <div class="row g-3 pt-3 border-top">
                  <div class="col-12 col-sm-6">
                    <span class="text-secondary small d-block">Créé le</span>
                    <span class="fw-medium">{{ ticket.formattedCreatedAt }}</span>
                  </div>
                  <div class="col-12 col-sm-6">
                    <span class="text-secondary small d-block">Dernière modification</span>
                    <span class="fw-medium">{{ ticket.formattedUpdatedAt }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panneau de contrôle des propriétés -->
          <div class="col-12 col-lg-4">
            <div class="card shadow-sm border">
              <div class="card-body p-4">
                <h2 class="h5 fw-bold mb-3">Propriétés</h2>

                <div class="mb-3">
                  <label for="detail-status" class="form-label fw-semibold">Statut actuel</label>
                  <select
                    id="detail-status"
                    class="form-select"
                    :value="ticket.status"
                    :disabled="saving"
                    @change="handleUpdateField('status', ($event.target as HTMLSelectElement).value as TicketStatus)"
                  >
                    <option value="open">Ouvert</option>
                    <option value="in_progress">En cours</option>
                    <option value="resolved">Résolu</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="detail-priority" class="form-label fw-semibold">Niveau de priorité</label>
                  <select
                    id="detail-priority"
                    class="form-select"
                    :value="ticket.priority"
                    :disabled="saving"
                    @change="handleUpdateField('priority', ($event.target as HTMLSelectElement).value as TicketPriority)"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>

                <div v-if="saving" class="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-0 mt-3" role="status">
                  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span>Mise à jour en cours...</span>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  </div>
</template>
