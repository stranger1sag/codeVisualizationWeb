<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">⟨/⟩</div>
        <h1 class="login-title">算法可视化</h1>
        <p class="login-subtitle">登录以继续使用</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="username">用户名</label>
          <input id="username" v-model.trim="username" type="text" class="form-input" placeholder="请输入用户名" autocomplete="username" />
        </div>
        <div class="form-group">
          <label class="form-label" for="password">密码</label>
          <input id="password" v-model="password" type="password" class="form-input" placeholder="请输入密码" autocomplete="current-password" />
        </div>
        <p v-if="successMsg" class="form-success">{{ successMsg }}</p>
        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>
        <button type="submit" class="login-btn" :disabled="!username || !password">登 录</button>
      </form>
      <p class="login-footer">
        没有账号？<router-link to="/register" class="login-link">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface StoredUser {
  username: string
  password: string
}

const router = useRouter()
const route = useRoute()
const username = ref('')
const password = ref('')
const errorMsg = ref('')
const successMsg = ref('')

onMounted(() => {
  if (route.query.registered === '1') {
    successMsg.value = '注册成功，请登录'
  }
})

function getUsers(): StoredUser[] {
  const raw = localStorage.getItem('codeviz_users')
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

function handleLogin() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码'
    return
  }

  const users = getUsers()
  const found = users.find(u => u.username === username.value)
  if (!found) {
    errorMsg.value = '用户不存在，请先注册'
    return
  }
  if (found.password !== password.value) {
    errorMsg.value = '密码错误'
    return
  }

  localStorage.setItem('codeviz_user', JSON.stringify({ username: username.value }))
  router.replace('/')
}
</script>

<style scoped>
.login-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: calc(100vh - 60px - 80px);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: 48px 36px 36px;
  box-shadow: var(--shadow-lg);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  color: var(--accent-cyan);
  font-weight: 700;
  margin-bottom: 12px;
}

.login-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-input {
  height: 44px;
  padding: 0 14px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-success {
  font-size: 13px;
  color: #22c55e;
  text-align: center;
}

.form-error {
  font-size: 13px;
  color: #ef4444;
  text-align: center;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}

.login-link {
  color: var(--accent-cyan);
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

.login-btn {
  height: 44px;
  background: var(--color-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast), box-shadow var(--transition-fast);
}

.login-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-glow);
}

.login-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
