<template>
     <div v-if="selectedChoice !== null || timeUp">
      <p v-if="selectedChoice === correctAnswer" class="correct-message">Correct!</p>
      <p v-else class="streak-count">Streak: {{ streakCount }}</p>

      <button 
        v-if="selectedChoice === correctAnswer" 
        class="next-button" 
        @click="$emit('next-question')"
      >
        NEXT
      </button>
  
      <button 
        v-if="!challengeMode && selectedChoice !== correctAnswer" 
        class="retry-button" 
        @click="$emit('retry-question')"
      >
        RETRY
      </button>

      <button 
        v-if="challengeMode && (selectedChoice !== correctAnswer || timeUp)" 
        class="game-over-button" 
        @click="$emit('end-challenge')"
      >
      RETRY
      </button>

    </div>
</template>
  
<script setup>
  import { computed } from 'vue';
  defineProps({
    selectedChoice: String,
    correctAnswer: String,
    streakCount: Number,
    challengeMode: Boolean
  });
  
  defineEmits(["next-question", "retry-question"]);
  const timeUp = computed(() => props.selectedChoice === "TIME_UP");
  
</script>
  
<style scoped>
  .correct-message {
    font-size: 10rem;
    font-weight: bold;
    color: #25b6af;
    text-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  }
  .streak-count {
    font-size: 10rem;
    font-weight: bold;
    color: #25b6af;
    text-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  }

  .next-button, .retry-button, .game-over-button {
    padding: 1rem 2rem;
    background-color: #007bff;;
    color: white;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    font-size: 5rem;
    box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  }
  .next-button:hover , .retry-button:hover, .game-over-button:hover {
    background-color: #0056b3;
  }
</style>
  