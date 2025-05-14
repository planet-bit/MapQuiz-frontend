<template>
</template>
  
<script setup>
  import { ref, watch, onMounted } from "vue";

  // 親コンポーネントから国とゲームタイプを受け取る
  const props = defineProps({
    selectedCountry: Object,
    gameType: String
  });

  // 親コンポーネントへデータを渡すためのemit
  const emit = defineEmits(["question-updated"]);
  const questions = ref([]);
  
  // APIから問題データを取得する非同期関数
  const fetchQuestions = async () => {
    if (!props.selectedCountry.code) return;
    try {
      // APIにリクエストを送信。`encodeURIComponent`で選択された国をURLエンコード
      const response = await fetch(`/server/api/questions?countryCode=${encodeURIComponent(props.selectedCountry.code)}`);

      // responseをJSON形式に変換し、questionsに格納
      const data = await response.json();
      questions.value = data;
    } catch (error) {
      console.error("データ取得エラー:", error);
    }
  };

  // `selectedCountry` または `gameType` が変更された時に問題を取得
  watch([() => props.selectedCountry.code, () => props.gameType], (newValues) => {
    const [newCountry, newGameType] = newValues;
    if (newCountry && newGameType) {
      fetchQuestions();
    }
  });

  // 初回マウント時にも問題を取得
  onMounted(() => {
    if (props.selectedCountry.code && props.gameType) {
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
      regionId: question.region_id,
      question,
      choices
    });
  };

  // 選択肢の生成関数
  const generateChoices = (correctAnswer, allQuestions) => {
    let wrongAnswers = allQuestions
      .map(q => q.answer)
      .filter(answer => answer !== correctAnswer);
    wrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 7);
    const choices = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
    return choices;
  };
  
  // コンポーネント外で呼び出せるように
  defineExpose({
  setQuestion,
  questions,
});

</script>
