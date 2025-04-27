<template>
    <div class="mode-selection">
      <label>
        <input type="checkbox" v-model="internalChallengeMode" />
        <span class="challenge-title">Challenge Mode</span>
      </label>
      <ul class="challenge-info">
        <li>制限時間10秒</li>
        <li>ヒント無し（地図と言語の表の表示不可）</li>
        <li>ログインユーザーはこのモードのみレコードに記録されます</li>
      </ul>
      
      <NavigationButtons class="start-button" text="START" @click="$emit('start-game')"/>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import NavigationButtons from './NavigationButtons.vue';
  
  const props = defineProps({
    challengeMode: Boolean
  });
  const emit = defineEmits(['update:challengeMode', 'start-game']);
  
  const internalChallengeMode = computed({
    get: () => props.challengeMode,
    set: (val) => emit('update:challengeMode', val)
  });
  </script>
  
  <style scoped>
  .mode-selection {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    background-color: #ffffff;
    position: absolute;
    top: 50px;
    left: 40px;
    text-align: left;
  }
  .mode-selection input[type="checkbox"] {
    width: 1rem;
    accent-color: #007bff;
    cursor: pointer;
  }
  .mode-selection label {
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .challenge-title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .challenge-info {
    font-size: 1rem;
    list-style-type: disc;
  }
  .start-button {
  margin-left: 20px;
  }
</style>
  