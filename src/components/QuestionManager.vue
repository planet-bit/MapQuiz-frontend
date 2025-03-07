<template>
</template>
  
<script setup>
  import { ref, watch, onMounted } from "vue";

  // 親コンポーネントから国とゲームタイプを受け取る
  const props = defineProps({
    selectedCountry: String,
    gameType: String
  });

  // 親コンポーネントへデータを渡すためのemit
  const emit = defineEmits(["question-updated"]);
  const questions = ref([]);
  
  // API から問題データを取得
  const fetchQuestions = async () => {
    if (!props.selectedCountry) return;
    try {
      const response = await fetch(`http://localhost:3000/api/questions?country=${encodeURIComponent(props.selectedCountry)}`);
      const data = await response.json();
      questions.value = data;
    } catch (error) {
      console.error("データ取得エラー:", error);
    }
  };

  // `selectedCountry` または `gameType` が変更された時に問題を取得
  watch([() => props.selectedCountry, () => props.gameType], (newValues) => {
    const [newCountry, newGameType] = newValues;
    if (newCountry && newGameType) {
      fetchQuestions();
    }
  });
    // 初回マウント時にも問題を取得
  onMounted(() => {
    if (props.selectedCountry && props.gameType) {
      fetchQuestions();
    }
  });

  // 新しい問題をセットし、親にデータを渡す
  const setQuestion = () => {
    if (questions.value.length === 0) return;  // 問題が無ければ終了
    const randomIndex = Math.floor(Math.random() * questions.value.length);
    const question = questions.value[randomIndex];
    const choices = generateChoices(question.answer, questions.value);
    emit("question-updated", {
      question,
      choices
    });
  };

  // 選択肢の生成関数
  const generateChoices = (correctAnswer, allQuestions) => {
    let wrongAnswers = allQuestions
      .map(q => q.answer)
      .filter(answer => answer !== correctAnswer);
    wrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 4);
    const choices = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
    return choices;
  };
  
  // コンポーネント外で呼び出せるように
  defineExpose({
    setQuestion,
    fetchQuestions
  });

</script>
