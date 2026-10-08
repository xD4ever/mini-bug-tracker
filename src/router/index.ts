import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
    { path: '/tickets/new', name: 'ticket-create', component: () => import('../views/TicketCreateView.vue') },
    { path: '/tickets/:id', name: 'ticket-detail', component: () => import('../views/TicketDetailView.vue') },
  ],
})

export default router
