<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <p>让抽象的代码变得直观易懂</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-footer {
  padding: 32px 24px;
  text-align: center;
  border-top: 1px solid var(--border);
  margin-top: 64px;
}

.footer-inner p {
  color: var(--text-muted);
  font-size: 13px;
  margin: 4px 0;
}

.footer-sub {
  font-size: 12px;
}

.footer-sub a {
  color: var(--accent-cyan);
  text-decoration: none;
}

.footer-sub a:hover {
  text-decoration: underline;
}
</style>
