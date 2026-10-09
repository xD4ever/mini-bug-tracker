<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  totalItems?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:currentPage': [page: number]
  pageChange: [page: number]
}>()

function goTo(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
    emit('pageChange', page)
  }
}

const pageNumbers = computed(() => {
  const current = props.currentPage
  const total = props.totalPages
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) {
      pages.push('...')
    }
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (current < total - 2) {
      pages.push('...')
    }
    pages.push(total)
  }
  return pages
})
</script>

<template>
  <nav v-if="totalPages > 1" class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-4" aria-label="Pagination des tickets">
    <div class="text-secondary small" v-if="totalItems !== undefined && totalItems > 0">
      <span>Page <strong class="text-body-emphasis">{{ currentPage }}</strong> sur <strong class="text-body-emphasis">{{ totalPages }}</strong> ({{ totalItems }} ticket{{ totalItems > 1 ? 's' : '' }})</span>
    </div>

    <ul class="pagination pagination-sm mb-0">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button
          type="button"
          class="page-link"
          :disabled="currentPage === 1"
          aria-label="Première page"
          title="Première page"
          @click="goTo(1)"
        >
          «
        </button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button
          type="button"
          class="page-link"
          :disabled="currentPage === 1"
          aria-label="Page précédente"
          @click="goTo(currentPage - 1)"
        >
          Précédent
        </button>
      </li>

      <template v-for="(p, index) in pageNumbers" :key="index">
        <li v-if="p === '...'" class="page-item disabled">
          <span class="page-link">…</span>
        </li>
        <li
          v-else
          class="page-item"
          :class="{ active: p === currentPage }"
        >
          <button
            type="button"
            class="page-link"
            :aria-current="p === currentPage ? 'page' : undefined"
            @click="goTo(Number(p))"
          >
            {{ p }}
          </button>
        </li>
      </template>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button
          type="button"
          class="page-link"
          :disabled="currentPage === totalPages"
          aria-label="Page suivante"
          @click="goTo(currentPage + 1)"
        >
          Suivant
        </button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button
          type="button"
          class="page-link"
          :disabled="currentPage === totalPages"
          aria-label="Dernière page"
          title="Dernière page"
          @click="goTo(totalPages)"
        >
          »
        </button>
      </li>
    </ul>
  </nav>
</template>
