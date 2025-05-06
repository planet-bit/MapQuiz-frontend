<template>
  <div v-if="selectedChoice !== null || timeUp">
    <p v-if="selectedChoice === correctAnswer" class="correct-message">Correct!</p>
    <p v-else class="streak-count">Streak: {{ streakCount }}</p>

    <div v-if="selectedChoice === correctAnswer">
      <NavigationButtons text="NEXT" @click="$emit('next-question')"/>
    </div>

    <div v-if="!challengeMode && selectedChoice !== correctAnswer" class="button-group">
      <NavigationButtons text="RETRY" @click="$emit('retry-question')"/>
      <NavigationButtons text="SELECT MODE" @click="$emit('select-mode')"/>
    </div>

    <div v-if="challengeMode && (selectedChoice !== correctAnswer || timeUp)" class="button-group">
      <NavigationButtons text="RETRY" @click="$emit('retry-question')"/>
      <NavigationButtons text="SELECT MODE" @click="$emit('select-mode')"/>
    </div>
  </div>
</template>

<script setup>
  import { computed, watch } from 'vue';
  import NavigationButtons from './NavigationButtons.vue';

  const props = defineProps({
    selectedChoice: String,
    correctAnswer: String,
    streakCount: Number,
    challengeMode: Boolean
  });

  const emit = defineEmits(["next-question", "retry-question", "select-mode", "streak-finalized"]);

  const timeUp = computed(() => props.selectedChoice === "TIME_UP");

  // watch を使って selectedChoice や timeUp の変化を監視
  watch([() => props.selectedChoice, () => timeUp.value], () => {
    if (props.challengeMode && props.selectedChoice !== null && 
      (props.selectedChoice !== props.correctAnswer || timeUp.value)) {
      emit("streak-finalized");
    }
  }, { immediate: true });
</script>

<style scoped>
.correct-message, .streak-count {
  font-size: 2rem;
  font-weight: bold;
  color: #25b6af;
}

/* ボタンを縦に並べる */
.button-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px; /* ボタン同士の間隔 */
  margin: 20px; 
}

@media (max-width: 600px) {
  .correct-message, .streak-count {
  font-size: 1.5rem;
}
}
</style>