<template>
  <div class="register-page">
    <div class="register-card">
      <div class="register-header">
        <div class="register-logo">⟨/⟩</div>
        <h1 class="register-title">创建账号</h1>
        <p class="register-subtitle">注册后即可使用算法可视化平台</p>
      </div>
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label" for="username">用户名</label>
          <input id="username" v-model.trim="username" type="text" class="form-input" placeholder="请输入用户名" autocomplete="username" />
        </div>
        <div class="form-group">
          <label class="form-label" for="password">密码</label>
          <input id="password" v-model="password" type="password" class="form-input" placeholder="请输入密码" autocomplete="new-password" />
        </div>
        <div class="form-group">
          <label class="form-label" for="confirmPassword">确认密码</label>
          <input id="confirmPassword" v-model="confirmPassword" type="password" class="form-input" placeholder="请再次输入密码" autocomplete="new-password" />
        </div>
        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>
        <button type="submit" class="register-btn" :disabled="!username || !password || !confirmPassword">注 册</button>
      </form>
      <p class="register-footer">
        已有账号？<router-link to="/login" class="register-link">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface StoredUser {
  username: string
  password: string
}

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')

function getUsers(): StoredUser[] {
  const raw = localStorage.getItem('codeviz_users')
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

function handleRegister() {
  errorMsg.value = ''

  if (!username.value || !password.value || !confirmPassword.value) {
    errorMsg.value = '请填写所有字段'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '两次密码输入不一致'
    return
  }
  if (password.value.length < 3) {
    errorMsg.value = '密码长度至少 3 位'
    return
  }

  const users = getUsers()
  if (users.some(u => u.username === username.value)) {
    errorMsg.value = '用户名已存在'
    return
  }

  users.push({ username: username.value, password: password.value })
  localStorage.setItem('codeviz_users', JSON.stringify(users))

  router.push({ name: 'login', query: { registered: '1' } })
}
</script>

<style scoped>
.register-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: calc(100vh - 60px - 80px);
}

.register-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: 48px 36px 36px;
  box-shadow: var(--shadow-lg);
}

.register-header {
  text-align: center;
  margin-bottom: 36px;
}

.register-logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  color: var(--accent-cyan);
  font-weight: 700;
  margin-bottom: 12px;
}

.register-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.register-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.register-form {
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

.form-error {
  font-size: 13px;
  color: #ef4444;
  text-align: center;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-glow);
}

.register-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.register-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}

.register-link {
  color: var(--accent-cyan);
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
