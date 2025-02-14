<template>
  <!-- エラー回避 -->
  <div v-if="choices.length">
    <button class="choice-button"
      v-for="choice in choices"
      :key="choice"
      :disabled="isAnswered"
       @click="$emit('answer-selected', choice)"
      :class="{
        'correct': choice === correctAnswer && (isAnswered || selectedChoice === choice),
        'incorrect': selectedChoice === choice && choice !== correctAnswer
      }">
      {{ choice }}
    </button>
  </div>
</template>
  
<script setup>
  defineProps({
    choices: Array,
    selectedChoice: String,
    correctAnswer: String,
    isAnswered: Boolean
  });

  defineEmits(["answer-selected"]);
</script>

<style scoped>
  .choice-button {
    display: block;
    margin: 1rem;
    padding: 0.5rem;
    background-color: lightblue;
    border: none;
    cursor: pointer;
    font-size: 6rem;
    border-radius: 2rem;
    margin-bottom: 3rem;
    text-align: left;
  }
  .choice-button:hover {
    background-color: rgb(122, 201, 228);
  }
  .choice-button:disabled {
    color: inherit; /* 文字色を元の状態にする */
    
  }
  .correct {
    background-color: lightgreen;
  }
  .incorrect {
    background-color: lightcoral;
  }
  /* 解答後のボタンにホバーしても色が変わらないように */
  .choice-button.correct:hover {
    background-color: lightgreen !important; /* 正解の色を強制的に保持 */
  }
  .choice-button.incorrect:hover {
    background-color: lightcoral !important; /* 正解の色を強制的に保持 */
  }
  .choice-button:disabled:hover {
    background-color: lightblue; /* もともとの選択肢の色を保持 */
  }
</style>