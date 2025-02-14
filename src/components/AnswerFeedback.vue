<template>
    <div v-if="selectedChoice">
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
        v-if="selectedChoice !== correctAnswer" 
        class="retry-button" 
        @click="$emit('retry-question')"
      >
        RETRY
      </button>
    </div>
</template>
  
<script setup>
  defineProps({
    selectedChoice: String,
    correctAnswer: String,
    streakCount: Number
  });
  
  defineEmits(["next-question", "retry-question"]);
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

  .next-button, .retry-button {
    padding: 1rem 2rem;
    background-color: #007bff;;
    color: white;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    font-size: 5rem;
    box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  }
  .next-button:hover , .retry-button:hover {
    background-color: #0056b3;
  }
</style>
  