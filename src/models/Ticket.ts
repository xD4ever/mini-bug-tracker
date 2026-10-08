export type TicketStatus = 'open' | 'in_progress' | 'resolved'
export type TicketPriority = 'low' | 'medium' | 'high'

/**
 * Interface brute représentant les données reçues de l'API REST / Hydra
 */
export interface TicketRawData {
  id?: string | number
  '@id'?: string
  title?: string
  description?: string
  status?: TicketStatus | string
  priority?: TicketPriority | string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

/**
 * DTO pour la création d'un ticket (POST)
 */
export interface CreateTicketDto {
  title: string
  description: string
  priority: TicketPriority
}

/**
 * DTO pour la mise à jour partielle d'un ticket (PATCH)
 */
export interface UpdateTicketDto {
  title?: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
}

/**
 * DTO pour le filtrage et la pagination (GET /tickets)
 */
export interface TicketFilterDto {
  page?: number
  title?: string
  status?: TicketStatus | ''
  priority?: TicketPriority | ''
}

/**
 * DTO représentant la réponse paginée de l'API
 */
export interface PaginatedTicketsDto {
  items: Ticket[]
  page: number
  totalPages: number
  totalItems?: number
}

/**
 * Classe modèle représentant un Ticket avec méthodes de formatage et logique métier
 */
export class Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt?: string
  updatedAt?: string

  constructor(data: TicketRawData = {}) {
    const rawId = String(data.id ?? data['@id'] ?? '')
    this.id = rawId.includes('/') ? rawId.split('/').pop() || rawId : rawId
    this.title = String(data.title ?? '')
    this.description = String(data.description ?? '')
    this.status = (data.status as TicketStatus) || 'open'
    this.priority = (data.priority as TicketPriority) || 'medium'
    this.createdAt = data.createdAt ? String(data.createdAt) : undefined
    this.updatedAt = data.updatedAt ? String(data.updatedAt) : undefined
  }

  /**
   * Libellé lisible de la priorité
   */
  get priorityLabel(): string {
    const labels: Record<TicketPriority, string> = {
      low: 'Faible',
      medium: 'Moyenne',
      high: 'Haute',
    }
    return labels[this.priority] || this.priority
  }

  /**
   * Libellé lisible du statut
   */
  get statusLabel(): string {
    const labels: Record<TicketStatus, string> = {
      open: 'Ouvert',
      in_progress: 'En cours',
      resolved: 'Résolu',
    }
    return labels[this.status] || this.status
  }

  /**
   * Date de création formatée pour affichage
   */
  get formattedCreatedAt(): string {
    if (!this.createdAt) return '—'
    try {
      const date = new Date(this.createdAt)
      return isNaN(date.getTime()) ? this.createdAt : date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return this.createdAt
    }
  }

  /**
   * Date de mise à jour formatée pour affichage
   */
  get formattedUpdatedAt(): string {
    if (!this.updatedAt) return '—'
    try {
      const date = new Date(this.updatedAt)
      return isNaN(date.getTime()) ? this.updatedAt : date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return this.updatedAt
    }
  }

  /**
   * Classe CSS associée à la priorité
   */
  get priorityClass(): string {
    return `priority-${this.priority}`
  }

  /**
   * Classe CSS associée au statut
   */
  get statusClass(): string {
    return `status-${this.status}`
  }

  /**
   * Indique si le ticket est résolu
   */
  get isResolved(): boolean {
    return this.status === 'resolved'
  }

  /**
   * Indique si le ticket est de haute priorité
   */
  get isHighPriority(): boolean {
    return this.priority === 'high'
  }
}
