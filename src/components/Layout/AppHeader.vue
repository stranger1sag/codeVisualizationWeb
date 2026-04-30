<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">⟨/⟩</span>
        <span class="logo-text">算法可视化</span>
      </router-link>
      <nav class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <a href="https://github.com/stranger1sag/codeVisualizationWeb" target="_blank" class="nav-link">GitHub</a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
  z-index: 100;
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-icon {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  color: var(--accent-cyan);
  font-weight: 700;
}

.logo-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--accent-cyan);
}

.nav-link.router-link-active {
  color: var(--accent-cyan);
}
</style>
