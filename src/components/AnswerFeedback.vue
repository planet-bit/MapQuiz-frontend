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
  import {  onMounted, computed, watch } from 'vue';
  import axios from 'axios';
  import NavigationButtons from './NavigationButtons.vue';

  const props = defineProps({
    selectedChoice: String,
    correctAnswer: String,
    regionId: Number,
    streakCount: Number,
    challengeMode: Boolean,
    userId: Number, 
    gameType: String 
  });

  const emit = defineEmits(["next-question", "retry-question", "select-mode", "streak-finalized"]);

  const timeUp = computed(() => props.selectedChoice === "TIME_UP");

  // /api/answersを利用して解答データを記録
  onMounted(async () => {
  const isCorrect = props.selectedChoice === props.correctAnswer;

    // user_id がない場合はリクエストを送らない
    if (!props.userId) {return;}

  const requestData = {
    user_id: props.userId,
    region_id: props.regionId,
    is_correct: isCorrect,
    game_type: props.gameType
  };

  console.log("送信するデータ:", requestData); // 送信するデータの内容

  try {
    await axios.post('http://localhost:3000/api/answers', requestData);
    console.log("回答記録完了！");
  } catch (err) {
    console.error("回答記録エラー:", err);
  }
});


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