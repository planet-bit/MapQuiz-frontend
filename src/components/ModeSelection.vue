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
      <button @click="$emit('start-game')">START</button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
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
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    background-color: #ffffff;
    max-width: 100%;
    position: absolute;
    top: 10%;
    left: 0%;
    text-align: left;
  }
  .mode-selection input[type="checkbox"] {
    margin-right: 5rem;
    width: 5rem;
    height: 5rem;
    accent-color: #007bff;
    cursor: pointer;
  }
  .mode-selection label {
    font-size: 5rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 60rem;
  }
  .mode-selection button {
    padding: 1rem 2rem;
    font-size: 5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    transform: translate(-50%, 0);
    box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  }
  .mode-selection button:hover {
    background-color: #0056b3;
  }
  .challenge-title {
    font-size: 6rem;
    font-weight: bold;
  }
  .challenge-info {
    margin-top: 0;
    margin-bottom: 1rem;
    margin-left: 500px;
    font-size: 3rem;
    list-style-type: disc;
  }
  </style>
  