<template>
  <div class="code-panel">
    <div class="panel-header">
      <span class="panel-title">源代码</span>
      <span class="panel-lang">C++</span>
    </div>
    <div class="code-body">
      <pre ref="codeRef" class="code-content"><template v-for="(lineContent, index) in codeLines" :key="index"><span
          :class="['code-line', { active: index + 1 === activeLine }]"
        ><span class="line-number">{{ String(index + 1).padStart(2, ' ') }}</span><span class="line-content">{{ lineContent || ' ' }}</span></span></template></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ code: string; activeLine: number }>()

const codeLines = ref<string[]>([])

watch(() => props.code, (c) => { codeLines.value = c.split('\n') }, { immediate: true })

// Auto-scroll disabled to prevent page jumping
</script>

<style scoped>
.code-panel {
  background: var(--code-bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border-bottom: 1px solid var(--border);
}
.panel-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.panel-lang {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--accent-cyan);
  background: rgba(6, 182, 212, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}
.code-body { flex: 1; overflow-y: auto; padding: 8px 0; }
.code-content { margin: 0; padding: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7; white-space: pre; }
.code-line { display: block; padding: 1px 16px; transition: all 0.2s; }
.code-line.active { background: rgba(6, 182, 212, 0.12); border-left: 3px solid var(--accent-cyan); padding-left: 13px; }
.line-number { display: inline-block; width: 32px; color: var(--text-muted); user-select: none; text-align: right; margin-right: 16px; opacity: 0.5; }
.code-line.active .line-number { color: var(--accent-cyan); opacity: 1; }
.line-content { color: var(--text-primary); }
</style>
