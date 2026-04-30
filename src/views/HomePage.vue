<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title"><span class="title-bracket">⟨</span> 算法可视化 <span class="title-bracket">⟩</span></h1>
        <p class="hero-subtitle">让抽象的代码变得直观易懂<br /><span class="hero-inspired">Inspired by 图码 & VisuAlgo</span></p>
        <div class="hero-stats">
          <div class="stat"><span class="stat-number">{{ totalAlgorithms }}</span><span class="stat-label">算法</span></div>
          <div class="stat-divider" />
          <div class="stat"><span class="stat-number">{{ categories.length }}</span><span class="stat-label">类别</span></div>
          <div class="stat-divider" />
          <div class="stat"><span class="stat-number">100%</span><span class="stat-label">交互</span></div>
        </div>
      </div>
    </section>
    <section class="catalog">
      <CategorySection v-for="category in categories" :key="category" :id="category" :title="CATEGORIES[category].label" :icon="CATEGORIES[category].icon" :algorithms="catalogByCategory[category] || []" @select="navigateToAlgorithm" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CategorySection from '../components/Catalog/CategorySection.vue'
import { algorithmRegistry } from '../engine/registry'
import type { CatalogItem, AlgorithmCategory } from '../engine/types'
import { CATEGORIES } from '../engine/types'

const router = useRouter()
const categories = Object.keys(CATEGORIES) as AlgorithmCategory[]
const catalogItems: CatalogItem[] = algorithmRegistry.map((algo) => ({
  id: algo.id,
  name: algo.name,
  slug: algo.id,
  category: algo.category,
  description: algo.description,
  icon: CATEGORIES[algo.category].icon,
}))
const catalogByCategory = computed(() => {
  const map: Record<string, CatalogItem[]> = {}
  for (const cat of categories) map[cat] = catalogItems.filter((item) => item.category === cat)
  return map
})
const totalAlgorithms = computed(() => algorithmRegistry.length)

function navigateToAlgorithm(id: string) {
  const algo = algorithmRegistry.find((a) => a.id === id)
  if (!algo) return
  if (algo.category === 'sort') router.push({ name: 'sort-algorithm', params: { name: id } })
  else if (algo.category === 'data-structure') router.push({ name: 'data-structure', params: { name: id } })
  else if (algo.category === 'search') router.push({ name: 'search-algorithm', params: { name: id } })
}
</script>

<style scoped>
.home-page { padding-top: 60px; }
.hero { position: relative; padding: 80px 24px 60px; max-width: 1400px; margin: 0 auto; }
.hero-content { position: relative; z-index: 1; }
.hero-title { font-family: 'Space Grotesk', sans-serif; font-size: 56px; font-weight: 700; letter-spacing: -0.03em; color: var(--text-primary); margin: 0 0 16px 0; line-height: 1.1; }
.title-bracket { color: var(--accent-cyan); font-weight: 300; }
.hero-subtitle { font-size: 18px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 32px 0; }
.hero-inspired { font-size: 14px; color: var(--text-muted); }
.hero-stats { display: flex; align-items: center; gap: 24px; }
.stat { text-align: center; }
.stat-number { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; color: var(--accent-cyan); }
.stat-label { font-size: 13px; color: var(--text-muted); }
.stat-divider { width: 1px; height: 32px; background: var(--border); }
.catalog { max-width: 1400px; margin: 0 auto; padding: 0 24px 64px; }
@media (max-width: 768px) { .hero { padding: 48px 24px 40px; text-align: center; } .hero-title { font-size: 36px; } .hero-stats { justify-content: center; } }
</style>
