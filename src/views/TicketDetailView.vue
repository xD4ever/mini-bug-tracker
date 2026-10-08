<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteTicket, getTicket, updateTicket } from '../services/ticketApi'
import type { Ticket, TicketPriority, TicketStatus } from '../models/Ticket'
const route = useRoute(); const router = useRouter(); const ticket = ref<Ticket>(); const error = ref(''); const saving = ref(false)
async function load() { try { ticket.value = await getTicket(String(route.params.id)) } catch (err) { error.value = err instanceof Error ? err.message : 'Ticket introuvable.' } }
async function update(field: 'status' | 'priority', value: TicketStatus | TicketPriority) { if (!ticket.value) return; saving.value = true; try { ticket.value = await updateTicket(ticket.value.id, { [field]: value } as Partial<{ status: TicketStatus; priority: TicketPriority }>) } catch (err) { error.value = err instanceof Error ? err.message : 'La mise à jour a échoué.' } finally { saving.value = false } }
async function remove() { if (!ticket.value || !confirm('Supprimer ce ticket définitivement ?')) return; try { await deleteTicket(ticket.value.id); router.push('/') } catch (err) { error.value = err instanceof Error ? err.message : 'La suppression a échoué.' } }
onMounted(load)
</script>

<template>
  <section class="detail-page"><RouterLink class="back-link" to="/">← Retour au tableau de bord</RouterLink><div v-if="error" class="alert alert-error">{{ error }}</div><div v-if="!ticket && !error" class="empty-state"><span class="loader"></span>Chargement...</div><template v-else-if="ticket"><div class="detail-header"><div><span class="ticket-id">#{{ ticket.id }}</span><h1>{{ ticket.title }}</h1></div><button class="button button-danger" @click="remove">Supprimer</button></div><div class="detail-layout"><article class="detail-card"><h2>Description</h2><p class="description">{{ ticket.description }}</p><dl><div><dt>Créé le</dt><dd>{{ ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('fr-FR') : '—' }}</dd></div><div><dt>Mis à jour le</dt><dd>{{ ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString('fr-FR') : '—' }}</dd></div></dl></article><aside class="detail-card controls"><h2>Propriétés</h2><label>Statut<select :value="ticket.status" :disabled="saving" @change="update('status', ($event.target as HTMLSelectElement).value as TicketStatus)"><option value="open">Ouvert</option><option value="in_progress">En cours</option><option value="resolved">Résolu</option></select></label><label>Priorité<select :value="ticket.priority" :disabled="saving" @change="update('priority', ($event.target as HTMLSelectElement).value as TicketPriority)"><option value="low">Faible</option><option value="medium">Moyenne</option><option value="high">Haute</option></select></label></aside></div></template></section>
</template>
