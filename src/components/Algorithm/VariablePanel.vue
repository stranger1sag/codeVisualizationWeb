<template>
  <div class="variable-panel">
    <div class="panel-header">
      <span class="panel-title">变量</span>
    </div>
    <div class="variables-grid">
      <div v-for="(value, name) in variables" :key="name" class="variable-item">
        <span class="var-name">{{ name }}</span>
        <span class="var-equals">=</span>
        <span class="var-value">{{ value }}</span>
      </div>
      <div v-if="Object.keys(variables).length === 0" class="no-vars">暂无变量</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ variables: Record<string, number | string> }>()
const variables = props.variables
</script>

<style scoped>
.variable-panel { background: var(--surface-elevated); border: 1px solid var(--border); border-radius: 12px; overflow: visible; }
.panel-header { display: flex; align-items: center; padding: 10px 16px; border-bottom: 1px solid var(--border); }
.panel-title { font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600; color: var(--text-primary); }
.variables-grid { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 16px; overflow: visible; }
.variable-item { display: flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 4px 10px; background: var(--card-bg); border-radius: 6px; border: 1px solid var(--border); }
.var-name { color: var(--accent-cyan); }
.var-equals { color: var(--text-muted); }
.var-value { color: var(--text-primary); font-weight: 600; }
.no-vars { font-size: 12px; color: var(--text-muted); padding: 4px 0; }
</style>
