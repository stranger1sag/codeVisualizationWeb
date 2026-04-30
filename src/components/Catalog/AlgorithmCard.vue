<template>
  <router-link :to="cardLink" class="algorithm-card">
    <div class="card-header"><span class="card-icon">{{ algorithm.icon }}</span><span class="card-category">{{ categoryLabel }}</span></div>
    <h3 class="card-title">{{ algorithm.name }}</h3>
    <p class="card-description">{{ algorithm.description }}</p>
    <div class="card-action"><span>开始可视化</span><svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CatalogItem } from '@/engine/types'
import { CATEGORIES } from '@/engine/types'
const props = defineProps<{ algorithm: CatalogItem }>()
const cardLink = computed(() => {
  if (props.algorithm.category === 'sort') return `/sort/${props.algorithm.id}`
  if (props.algorithm.category === 'data-structure') return `/data-structure/${props.algorithm.id}`
  return `/search/${props.algorithm.id}`
})
const categoryLabel = computed(() => CATEGORIES[props.algorithm.category]?.label ?? '')
</script>

<style scoped>
.algorithm-card { display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-lg); background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-lg); text-decoration: none; transition: all var(--transition-base); position: relative; overflow: hidden; }
.algorithm-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--color-primary), transparent); opacity: 0; transition: opacity var(--transition-base); }
.algorithm-card:hover { border-color: var(--color-primary); transform: translateY(-4px); box-shadow: var(--shadow-lg), 0 0 30px rgba(6,182,212,0.1); }
.algorithm-card:hover::before { opacity: 1; }
.card-header { display: flex; align-items: center; justify-content: space-between; }
.card-icon { font-size: 28px; line-height: 1; }
.card-category { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-primary); background: var(--color-primary-light); padding: 3px 8px; border-radius: var(--radius-full); }
.card-title { font-size: 18px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.01em; }
.card-description { font-size: 14px; color: var(--text-secondary); line-height: 1.5; flex: 1; }
.card-action { display: flex; align-items: center; justify-content: center; gap: var(--space-sm); padding-top: var(--space-sm); font-size: 14px; font-weight: 600; color: var(--color-primary); transition: gap var(--transition-fast); }
.algorithm-card:hover .card-action { gap: var(--space-md); }
.arrow-icon { transition: transform var(--transition-fast); }
.algorithm-card:hover .arrow-icon { transform: translateX(4px); }
</style>
