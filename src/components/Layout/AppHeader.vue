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
        <template v-if="user">
          <span class="nav-user">{{ user.username }}</span>
          <button class="nav-link logout-btn" @click="handleLogout">退出</button>
        </template>
        <router-link v-else to="/login" class="nav-link">登录</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref(loadUser())

watch(() => router.currentRoute.value, () => {
  user.value = loadUser()
})

function loadUser() {
  const raw = localStorage.getItem('codeviz_user')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

function handleLogout() {
  localStorage.removeItem('codeviz_user')
  user.value = null
  router.push('/login')
}
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

.nav-user {
  font-size: 13px;
  color: var(--accent-cyan);
  font-weight: 600;
  padding: 4px 12px;
  background: var(--color-primary-light);
  border-radius: var(--radius-full);
}

.logout-btn {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s;
}

.logout-btn:hover {
  color: #ef4444;
}
</style>
