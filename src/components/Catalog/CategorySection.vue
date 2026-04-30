<template>
  <section class="category-section" :id="id">
    <div class="section-header"><span class="section-icon">{{ icon }}</span><h2 class="section-title">{{ title }}</h2></div>
    <div class="card-grid"><AlgorithmCard v-for="item in algorithms" :key="item.id" :algorithm="item" /></div>
  </section>
</template>

<script setup lang="ts">
import AlgorithmCard from './AlgorithmCard.vue'
import type { CatalogItem } from '@/engine/types'
defineProps<{ id: string; title: string; icon: string; algorithms: CatalogItem[] }>()
</script>

<style scoped>
.category-section { padding: var(--space-2xl) 0; }
.section-header { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-xl); }
.section-icon { font-size: 24px; }
.section-title { font-size: 24px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.02em; }
.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-lg); }
@media (max-width: 640px) { .card-grid { grid-template-columns: 1fr; } }
</style>
