<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <p>让抽象的代码变得直观易懂</p>
      <p class="footer-sub">Inspired by <a href="https://www.totuma.cn" target="_blank">图码</a> &amp; <a href="https://visualgo.net" target="_blank">VisuAlgo</a></p>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-footer {
  padding: 24px 24px;
  text-align: center;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
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
