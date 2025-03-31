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
import { computed, watch, defineProps, defineEmits } from 'vue';
import NavigationButtons from './NavigationButtons.vue';

const props = defineProps({
  selectedChoice: String,
  correctAnswer: String,
  streakCount: Number,
  challengeMode: Boolean
});

const emit = defineEmits(["next-question", "retry-question", "select-mode", "streak-finalized"]);

const timeUp = computed(() => props.selectedChoice === "TIME_UP");

console.log("初期 selectedChoice:", props.selectedChoice);

// watch を使って selectedChoice や timeUp の変化を監視
watch([() => props.selectedChoice, () => timeUp.value], () => {
  console.log("watchが動作しました");
  if (props.challengeMode && props.selectedChoice !== null && 
      (props.selectedChoice !== props.correctAnswer || timeUp.value)) {
    console.log("Streak finalized event emitted");
    emit("streak-finalized");
  }
}, { immediate: true });
</script>


<style scoped>
.correct-message, .streak-count {
  font-size: 10rem;
  font-weight: bold;
  color: #25b6af;
  text-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
}

/* ボタンを縦に並べる */
.button-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5rem; /* ボタン同士の間隔 */
  margin: 3rem;
}
</style>