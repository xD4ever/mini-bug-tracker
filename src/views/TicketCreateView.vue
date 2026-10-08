<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createTicket } from '../services/ticketApi'
import type { TicketPriority } from '../models/Ticket'
const router = useRouter()
const form = reactive<{ title: string; description: string; priority: TicketPriority }>({ title: '', description: '', priority: 'medium' })
const error = ref(''); const saving = ref(false)
async function submit() {
  error.value = ''; saving.value = true
  try { const ticket = await createTicket(form); router.push({ name: 'ticket-detail', params: { id: ticket.id } }) }
  catch (err) { error.value = err instanceof Error ? err.message : 'La création a échoué.' } finally { saving.value = false }
}
</script>

<template>
  <section class="form-page"><RouterLink class="back-link" to="/">← Retour au tableau de bord</RouterLink><p class="eyebrow">Nouvelle anomalie</p><h1>Créer un ticket</h1><p class="muted">Décrivez le problème pour aider l’équipe à le résoudre rapidement.</p>
    <form class="form-card" @submit.prevent="submit"><div v-if="error" class="alert alert-error">{{ error }}</div><label>Titre<input v-model="form.title" required minlength="3" maxlength="255" placeholder="Ex. Le bouton de connexion ne répond plus" /></label><label>Description<textarea v-model="form.description" required minlength="15" rows="6" placeholder="Décrivez les étapes pour reproduire le problème..."></textarea><small>{{ form.description.length }} caractères (15 minimum)</small></label><label>Priorité<select v-model="form.priority"><option value="low">Faible</option><option value="medium">Moyenne</option><option value="high">Haute</option></select></label><div class="form-actions"><RouterLink class="button button-ghost" to="/">Annuler</RouterLink><button class="button button-primary" :disabled="saving">{{ saving ? 'Création...' : 'Créer le ticket' }}</button></div></form>
  </section>
</template>
