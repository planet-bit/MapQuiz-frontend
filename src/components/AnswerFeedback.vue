<template>
  <div v-if="selectedChoice !== null || timeUp">
    <p v-if="selectedChoice === correctAnswer" class="correct-message">Correct!</p>
    <p v-else class="streak-count">Streak: {{ streakCount }}</p>

    <div v-if="selectedChoice === correctAnswer">
      <GameButtons text="NEXT" @click="$emit('next-question')"/>
    </div>

    <div v-if="!challengeMode && selectedChoice !== correctAnswer" class="button-group">
      <button 
        class="retry-button" 
        @click="$emit('retry-question')"
      >
        RETRY
      </button>

      <button 
        class="select-mode-button" 
        @click="$emit('select-mode')"
      >
        SELECT MODE
      </button>
    </div>

    <div v-if="challengeMode && (selectedChoice !== correctAnswer || timeUp)" class="button-group">
      <button 
        class="retry-button" 
        @click="$emit('retry-question')"
      >
        RETRY
      </button>

      <button 
        class="select-mode-button" 
        @click="$emit('select-mode')"
      >
        SELECT MODE
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import GameButtons from './GameButtons.vue';

defineProps({
  selectedChoice: String,
  correctAnswer: String,
  streakCount: Number,
  challengeMode: Boolean
});

defineEmits(["next-question", "retry-question", "select-mode" ]);

const timeUp = computed(() => props.selectedChoice === "TIME_UP");

</script>

<style scoped>
.correct-message, .streak-count {
  font-size: 10rem;
  font-weight: bold;
  color: #25b6af;
  text-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
}

.retry-button, 
.select-mode-button {
  padding: 1rem 2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  font-size: 5rem;
  box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
}

.retry-button:hover, 
.select-mode-button:hover {
  background-color: #0056b3;
}

/* ボタンを縦に並べる */
.button-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5rem; /* ボタン同士の間隔 */
  margin-top: 3rem;
}
</style>