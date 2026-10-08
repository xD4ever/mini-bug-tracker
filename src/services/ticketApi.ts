import {
  Ticket,
  type CreateTicketDto,
  type PaginatedTicketsDto,
  type TicketFilterDto,
  type UpdateTicketDto,
} from '../models/Ticket'

const API_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Fonction générique de requête HTTP utilisant fetch avec gestion d'erreurs
 */
async function request<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      let errorMessage = `Erreur HTTP ${response.status} (${response.statusText})`
      try {
        const errorData = await response.json()
        errorMessage =
          errorData.detail ||
          errorData['hydra:description'] ||
          errorData.message ||
          errorData.title ||
          errorMessage
      } catch {
        const text = await response.text()
        if (text) errorMessage = text
      }
      throw new Error(errorMessage)
    }

    if (response.status === 204) {
      return null as T
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Une erreur réseau imprévue est survenue.')
  }
}

/**
 * Récupère la liste paginée et filtrée des tickets (GET /tickets)
 */
export async function getTickets(query: TicketFilterDto = {}): Promise<PaginatedTicketsDto> {
  const page = query.page && query.page > 0 ? query.page : 1
  const params = new URLSearchParams({ page: String(page) })

  if (query.status) params.set('status', query.status)
  if (query.priority) params.set('priority', query.priority)
  if (query.title && query.title.trim() !== '') params.set('title', query.title.trim())

  const data = await request<any>(`/tickets?${params.toString()}`)

  // Support des formats de réponse standards REST, API Platform Hydra, et tableaux simples
  const rawItems: any[] = Array.isArray(data)
    ? data
    : data?.member ?? data?.['hydra:member'] ?? data?.items ?? data?.tickets ?? []

  const totalItems = Number(data?.totalItems ?? data?.['hydra:totalItems'] ?? 0)
  const lastUrl = data?.view?.last ?? data?.['hydra:view']?.['hydra:last'] ?? ''
  const parsedLastPage = typeof lastUrl === 'string' ? Number(lastUrl.match(/page=(\d+)/)?.[1]) : NaN
  const perPage = Number(data?.perPage ?? data?.itemsPerPage ?? (rawItems.length || 30))

  const calculatedTotalPages =
    !isNaN(parsedLastPage) && parsedLastPage > 0
      ? parsedLastPage
      : totalItems > 0
      ? Math.ceil(totalItems / perPage)
      : 1

  return {
    items: rawItems.map((item: any) => new Ticket(item)),
    page: Number(data?.page ?? page),
    totalPages: Math.max(1, Number(data?.totalPages ?? calculatedTotalPages)),
    totalItems: totalItems || rawItems.length,
  }
}

/**
 * Récupère un ticket par son identifiant (GET /tickets/:id)
 */
export async function getTicket(id: string): Promise<Ticket> {
  if (!id) throw new Error('Identifiant de ticket requis.')
  const data = await request<any>(`/tickets/${encodeURIComponent(id)}`)
  return new Ticket(data)
}

/**
 * Crée un nouveau ticket (POST /tickets)
 */
export async function createTicket(payload: CreateTicketDto): Promise<Ticket> {
  const data = await request<any>('/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, application/ld+json',
    },
    body: JSON.stringify(payload),
  })
  return new Ticket(data)
}

/**
 * Met à jour partiellement un ticket (PATCH /tickets/:id)
 */
export async function updateTicket(id: string, payload: UpdateTicketDto): Promise<Ticket> {
  if (!id) throw new Error('Identifiant de ticket requis.')
  
  // Tente avec merge-patch+json ou application/json
  try {
    const data = await request<any>(`/tickets/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
        Accept: 'application/json, application/ld+json',
      },
      body: JSON.stringify(payload),
    })
    return new Ticket(data)
  } catch (err: any) {
    // Si merge-patch n'est pas supporté par le serveur de dev, fallback en application/json
    if (err?.message?.includes('415') || err?.message?.includes('Unsupported')) {
      const data = await request<any>(`/tickets/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, application/ld+json',
        },
        body: JSON.stringify(payload),
      })
      return new Ticket(data)
    }
    throw err
  }
}

/**
 * Supprime un ticket (DELETE /tickets/:id)
 */
export async function deleteTicket(id: string): Promise<void> {
  if (!id) throw new Error('Identifiant de ticket requis.')
  await request<void>(`/tickets/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
