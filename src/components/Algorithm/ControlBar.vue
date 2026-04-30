<template>
  <div class="control-bar">
    <div class="control-group playback">
      <button class="control-btn" @click="$emit('reset')" title="重置" aria-label="重置">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.65 6.35A7.96 7.96 0 0012 4C7.58 4 4.01 7.58 4.01 12S7.58 20 12 20c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
      </button>
      <button class="control-btn" :disabled="currentStep <= 0" @click="$emit('step-back')" title="上一步" aria-label="上一步">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
      </button>
      <button class="control-btn control-btn--primary" @click="$emit('toggle-play')" :aria-label="isPlaying ? '暂停' : '播放'">
        <svg v-if="!isPlaying" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <button class="control-btn" :disabled="currentStep >= totalSteps - 1" @click="$emit('step-forward')" title="下一步" aria-label="下一步">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
      </button>
    </div>
    <div class="control-divider" />
    <div class="control-group speed">
      <span class="speed-label">速度</span>
      <input type="range" class="speed-slider" min="0.5" max="3" step="0.25" :value="speed"
        @input="$emit('update-speed', Number(($event.target as HTMLInputElement).value))" aria-label="播放速度" />
      <span class="speed-value">{{ speed }}x</span>
    </div>
    <div class="control-divider" />
    <div class="control-group data" v-if="showCustomInput !== false">
      <button class="control-btn control-btn--secondary" @click="$emit('randomize')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
        <span>随机生成</span>
      </button>
      <div class="custom-input">
        <input type="text" class="input-field" placeholder="自定义: 5,3,8,1" :value="customInput"
          @input="$emit('update-custom-input', ($event.target as HTMLInputElement).value)" @keydown.enter="$emit('apply-custom-input')" />
        <button class="control-btn control-btn--small" @click="$emit('apply-custom-input')">应用</button>
      </div>
    </div>
    <div class="control-group data" v-else>
      <button class="control-btn control-btn--secondary" @click="$emit('randomize')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
        <span>随机生成</span>
      </button>
    </div>
    <div class="step-indicator">
      <span class="step-current">{{ currentStep + 1 }}</span><span class="step-separator">/</span><span class="step-total">{{ totalSteps }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ isPlaying: boolean; currentStep: number; totalSteps: number; speed: number; customInput: string; showCustomInput?: boolean }>()
defineEmits<{
  'toggle-play': []; 'step-forward': []; 'step-back': []; 'reset': [];
  'update-speed': [value: number]; 'randomize': [];
  'update-custom-input': [value: string]; 'apply-custom-input': [];
}>()
</script>

<style scoped>
.control-bar { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm) var(--space-lg); background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-lg); flex-wrap: wrap; }
.control-group { display: flex; align-items: center; gap: var(--space-xs); } .playback { gap: 2px; } .control-divider { width: 1px; height: 24px; background: var(--border-light); }
.control-btn { display: flex; align-items: center; justify-content: center; padding: var(--space-sm); color: var(--text-secondary); border-radius: var(--radius-md); transition: all var(--transition-fast); }
.control-btn:hover:not(:disabled) { color: var(--text-primary); background: var(--bg-tertiary); } .control-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.control-btn--primary { background: var(--color-primary); color: var(--text-inverse); width: 40px; height: 40px; border-radius: var(--radius-full); margin: 0 var(--space-xs); }
.control-btn--primary:hover { background: var(--color-primary-hover); color: var(--text-inverse); box-shadow: var(--shadow-glow); }
.control-btn--secondary { background: var(--bg-tertiary); color: var(--text-primary); padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md); font-size: 13px; font-weight: 500; }
.control-btn--secondary:hover { background: var(--color-primary); color: var(--text-inverse); }
.control-btn--small { padding: var(--space-xs) var(--space-sm); font-size: 12px; font-weight: 600; color: var(--color-primary); background: var(--color-primary-light); border-radius: var(--radius-sm); }
.control-btn--small:hover { background: var(--color-primary); color: var(--text-inverse); }
.speed-label { font-size: 12px; font-weight: 500; color: var(--text-muted); }
.speed-slider { -webkit-appearance: none; appearance: none; width: 100px; height: 4px; background: var(--bg-tertiary); border-radius: var(--radius-full); outline: none; cursor: pointer; }
.speed-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: var(--color-primary); border-radius: 50%; cursor: pointer; transition: transform var(--transition-fast); }
.speed-slider::-webkit-slider-thumb:hover { transform: scale(1.2); box-shadow: 0 0 8px var(--color-primary-glow); }
.speed-value { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--color-primary); min-width: 36px; text-align: center; }
.data { gap: var(--space-sm); } .custom-input { display: flex; align-items: center; gap: var(--space-xs); }
.input-field { font-family: var(--font-mono); font-size: 12px; padding: var(--space-sm) var(--space-md); background: var(--bg-primary); border: 1px solid var(--border-default); border-radius: var(--radius-md); color: var(--text-primary); outline: none; width: 160px; transition: border-color var(--transition-fast); }
.input-field:focus { border-color: var(--color-primary); } .input-field::placeholder { color: var(--text-muted); }
.step-indicator { margin-left: auto; display: flex; align-items: center; gap: var(--space-xs); font-family: var(--font-mono); font-size: 12px; }
.step-current { font-weight: 600; color: var(--color-primary); } .step-separator { color: var(--text-muted); } .step-total { color: var(--text-muted); }
@media (max-width: 900px) { .control-bar { padding: var(--space-sm) var(--space-md); gap: var(--space-sm); } .input-field { width: 120px; } }
@media (max-width: 640px) { .control-bar { flex-direction: column; align-items: stretch; } .control-divider { display: none; } .step-indicator { margin-left: 0; justify-content: center; } .custom-input { flex: 1; } .input-field { flex: 1; } }
</style>
