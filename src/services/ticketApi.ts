import { Ticket, type TicketPriority, type TicketStatus } from '../models/Ticket'

const API_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, options)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `La requête a échoué (${response.status})`)
  }
  return response.status === 204 ? null : response.json()
}

export interface TicketQuery {
  page: number
  status?: string
  priority?: string
  title?: string
}

export interface TicketPage {
  items: Ticket[]
  page: number
  totalPages: number
}

export async function getTickets(query: TicketQuery): Promise<TicketPage> {
  const params = new URLSearchParams({ page: String(query.page) })
  if (query.status) params.set('status', query.status)
  if (query.priority) params.set('priority', query.priority)
  if (query.title) params.set('title', query.title)
  const data = await request(`/tickets?${params}`)
  const rawItems = Array.isArray(data)
    ? data
    : (data?.member ?? data?.['hydra:member'] ?? data?.items ?? data?.tickets ?? [])
  const totalItems = Number(data?.totalItems ?? data?.['hydra:totalItems'] ?? 0)
  const lastUrl = data?.view?.last ?? data?.['hydra:view']?.['hydra:last'] ?? ''
  const parsedLastPage = typeof lastUrl === 'string' ? Number(lastUrl.match(/page=(\d+)/)?.[1]) : NaN
  const perPage = Number(data?.perPage ?? data?.itemsPerPage ?? (rawItems.length || 30))
  const calculatedTotalPages = !isNaN(parsedLastPage) && parsedLastPage > 0
    ? parsedLastPage
    : (totalItems ? Math.ceil(totalItems / perPage) : 1)

  return {
    items: rawItems.map((item: Record<string, unknown>) => new Ticket(item)),
    page: Number(data?.page ?? query.page),
    totalPages: Number(data?.totalPages ?? calculatedTotalPages),
  }
}

export async function getTicket(id: string) {
  return new Ticket(await request(`/tickets/${encodeURIComponent(id)}`))
}

export async function createTicket(payload: { title: string; description: string; priority: TicketPriority }) {
  return new Ticket(await request('/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }))
}

export async function updateTicket(id: string, payload: Partial<{ status: TicketStatus; priority: TicketPriority }>) {
  return new Ticket(await request(`/tickets/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/merge-patch+json' },
    body: JSON.stringify(payload),
  }))
}

export async function deleteTicket(id: string) {
  await request(`/tickets/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
