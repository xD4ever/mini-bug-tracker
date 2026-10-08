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
  <nav v-if="totalPages > 1" class="pagination-wrapper" aria-label="Pagination des tickets">
    <div class="pagination-info" v-if="totalItems !== undefined && totalItems > 0">
      <span>Page <strong>{{ currentPage }}</strong> sur <strong>{{ totalPages }}</strong> ({{ totalItems }} ticket{{ totalItems > 1 ? 's' : '' }})</span>
    </div>

    <div class="pagination">
      <button
        type="button"
        class="button button-ghost button-small"
        :disabled="currentPage === 1"
        aria-label="Première page"
        title="Première page"
        @click="goTo(1)"
      >
        «
      </button>

      <button
        type="button"
        class="button button-ghost"
        :disabled="currentPage === 1"
        aria-label="Page précédente"
        @click="goTo(currentPage - 1)"
      >
        ← Précédent
      </button>

      <div class="pagination-numbers">
        <template v-for="(p, index) in pageNumbers" :key="index">
          <span v-if="p === '...'" class="pagination-ellipsis">…</span>
          <button
            v-else
            type="button"
            class="button button-page"
            :class="{ active: p === currentPage }"
            :aria-current="p === currentPage ? 'page' : undefined"
            @click="goTo(Number(p))"
          >
            {{ p }}
          </button>
        </template>
      </div>

      <button
        type="button"
        class="button button-ghost"
        :disabled="currentPage === totalPages"
        aria-label="Page suivante"
        @click="goTo(currentPage + 1)"
      >
        Suivant →
      </button>

      <button
        type="button"
        class="button button-ghost button-small"
        :disabled="currentPage === totalPages"
        aria-label="Dernière page"
        title="Dernière page"
        @click="goTo(totalPages)"
      >
        »
      </button>
    </div>
  </nav>
</template>
