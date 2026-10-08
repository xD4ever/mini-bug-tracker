export type TicketStatus = 'open' | 'in_progress' | 'resolved'
export type TicketPriority = 'low' | 'medium' | 'high'

export class Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt?: string
  updatedAt?: string

  constructor(data: Record<string, unknown>) {
    const rawId = String(data.id ?? data['@id'] ?? '')
    this.id = rawId.includes('/') ? rawId.split('/').pop() || rawId : rawId
    this.title = String(data.title ?? '')
    this.description = String(data.description ?? '')
    this.status = (data.status as TicketStatus) || 'open'
    this.priority = (data.priority as TicketPriority) || 'medium'
    this.createdAt = data.createdAt as string | undefined
    this.updatedAt = data.updatedAt as string | undefined
  }

  get priorityLabel() {
    return { low: 'Faible', medium: 'Moyenne', high: 'Haute' }[this.priority]
  }

  get statusLabel() {
    return { open: 'Ouvert', in_progress: 'En cours', resolved: 'Résolu' }[this.status]
  }
}
