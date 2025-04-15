<template>
  <div class="main-container">
    <!-- 問題をランダムで出題する機能 -->
    <QuestionManager ref="questionManager"
      :selectedCountry="selectedCountry" 
      :gameType="props.gameType"
      @question-updated="updateQuestion"
    />

    <!-- ゲーム開始前 -->
    <div v-if="!gameStarted">
      <!-- バングラデシュのみ特殊表示 -->
      <div v-if="selectedCountry.code === 'bd'" class="mode-message">
        Preparing...
      </div>

      <!-- bd以外のとき -->
      <ModeSelection
        v-if="!gameStarted && selectedCountry.code !== 'bd'"
        :challengeMode="challengeMode"
        @update:challengeMode="val => challengeMode = val"
        @start-game="startGame"
      />
    </div>

    <!-- ゲーム中 -->
    <div v-else>
      <div class="question-grid">

        <!-- タイマー機能の表示 -->
        <Timer
          :challengeMode="props.challengeMode" 
          :timerActive="timerActive"
          :triggerStopTimer="triggerStopTimer"
          @time-up="TimeUp"
        />
        <p class="current-question">{{ currentQuestion.word }}</p>

        <!-- 選択肢ボタン表示 -->
        <ChoiceButtons 
          :choices="currentChoices" 
          :selectedChoice="selectedChoice" 
          :correctAnswer="currentQuestion.answer"
          :isAnswered="isAnswered"
          @answer-selected="checkAnswer"
        />
      </div>
    </div>

    <!-- 解答後のフィードバック表示 -->
    <div class="feedback-grid">
      <AnswerFeedback 
        v-if="selectedChoice"
        :selectedChoice="selectedChoice"
        :correctAnswer="currentQuestion.answer"
        :streakCount="currentQuestionIndex - 1"
        :regionId=currentQuestion.region_id
        :challengeMode="props.challengeMode"
        :gameType="props.gameType"
        :userId="props.userId"
        @next-question="nextQuestion"
        @retry-question="startGame"
        @select-mode="GameReset"
        @streak-finalized="sendStreakData"
        />
      </div>
    </div>
</template>

<script setup>

  import { ref, watch, computed } from "vue";
  import ChoiceButtons from "@/components/ChoiceButtons.vue";
  import AnswerFeedback from "@/components/AnswerFeedback.vue";
  import Timer from "@/components/Timer.vue";
  import QuestionManager from "@/components/QuestionManager.vue";
  import ModeSelection from "@/components/ModeSelection.vue";

  // 親コンポーネントから渡されたプロパティ
  const props = defineProps({
    challengeMode: Boolean,
    selectedCountry: Object,
    gameType: String,
    userId: Number
  });
  const emit = defineEmits(["update:challengeMode"]);

  const currentQuestion = ref(""); // 現在の問題
  const currentChoices = ref([]); // 現在の選択肢
  const selectedChoice = ref(null); // ユーザーの選択
  const currentQuestionIndex = ref(1); // 問題番号
  const isAnswered = ref(false); // 答えたかどうか
  const gameStarted = ref(false); // ゲーム開始の状態
  const timerActive = ref (false);
  const triggerStopTimer = ref(false);
  const questionManager = ref(null);

  const challengeMode = computed({
    get: () => props.challengeMode,
    set: (val) => emit('update:challengeMode', val)
  });

// `streak-finalized` イベントを受け取って、APIに送信
const sendStreakData = async () => {
  if (!props.userId) return;
  const streak = currentQuestionIndex.value - 1;
  // 動的にデータを更新
  const data = {
    "user_id": props.userId, // ログインしたユーザーのIDを使う
    "game_type": props.gameType, // ゲームタイプ（選択に基づく）
    "country_code": props.selectedCountry.code, // 国コード（選択に基づく）
    "streak": streak,// 確定した連続記録
    "correct_answers": streak, // 正解数（連続記録と同じ）
  };

  try {
    const response = await updateStreak(data);
    console.log("更新成功:", response);
  } catch (error) {
    console.error("更新エラー:", error);
  }
};

const updateStreak = async (data) => {
  try {
    console.log("送信データ:", data); // 送信前に確認
    const response = await fetch("http://localhost:3000/api/streaks/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("レスポンスステータス:", response.status); // HTTPステータスを確認

    if (!response.ok) {
      const errorMessage = await response.text(); // サーバーのエラーメッセージを取得
      throw new Error(`サーバーエラー: ${response.status} - ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("updateStreak エラー:", error);
    throw error; // ここでエラーをそのままスロー
  }
};

  const updateQuestion = ({ question, choices }) => {
    currentQuestion.value = question;
    currentChoices.value = choices;
  };

  const StartTimer = () => {
    timerActive.value = false;
    setTimeout(() => timerActive.value = true, 0); // すぐに `false` に戻す
  };

  const StopTimer = () => {
    triggerStopTimer.value = true;
    setTimeout(() => triggerStopTimer.value = false, 0);
  };

  const TimeUp = () => {
    checkAnswer("TIME_UP");
  };

  // 国やゲームタイプが変更されたらゲーム開始画面に戻す
  watch([() => props.selectedCountry, () => props.gameType], () => {
    GameReset();
  });

 
  // 解答を選択したときに呼ばれる関数
  const checkAnswer = (choice) => {
    selectedChoice.value = choice ?? "TIME_UP";  // 時間切れの場合 "TIME_UP" として選択
    isAnswered.value = true;
    StopTimer();
    if (props.challengeMode) {
    sendAnswerResult();

     // チャレンジモードでは間違えたら終了
    if (choice === "TIME_UP" || choice !== currentQuestion.value.answer) {
      return;
    } else {
      nextQuestion();
    }
  }
};

  // 次の問題に進む関数
  const nextQuestion = () => {
   currentQuestionIndex.value++; // 問題番号を進める
    isAnswered.value = false; // 回答済み状態をリセット
    selectedChoice.value = null; // 選択をリセット
    if (props.challengeMode) StartTimer(); // チャレンジモードならタイマーを再スタート
    if (questionManager.value) questionManager.value.setQuestion();
  }

  // ゲーム開始時の処理
  const startGame = () => {
    currentQuestionIndex.value = 1;
    selectedChoice.value = null;
    isAnswered.value = false;
    gameStarted.value = true;
    if (props.challengeMode) StartTimer();
    if (questionManager.value) questionManager.value.setQuestion();
  };

//問題番号、ユーザーの選択、解答の有無をリセット
  const GameReset = () => {
    currentQuestionIndex.value = 1;
    selectedChoice.value = null;
    isAnswered.value = false;
    gameStarted.value = false;
  }

const sendAnswerResult = async () => {
  // props.userId などから正しく取得
  if (!props.userId || selectedChoice.value === null) return;

  const correctAnswer = currentQuestion.value.answer;
  const regionId = currentQuestion.value.region_id;
  const isCorrect = selectedChoice.value === correctAnswer && selectedChoice.value !== "TIME_UP";

  const requestData = {
    user_id: props.userId,
    region_id: regionId,
    is_correct: isCorrect,
    game_type: props.gameType
  };

  try {
    await fetch("http://localhost:3000/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });
    console.log("回答記録完了！");
  } catch (err) {
    console.error("回答記録エラー:", err);
  }
};
</script>

<style scoped>
  .main-container {
    display: grid;
    grid-template-columns: 60% 40%;
    align-items: center; 
    justify-content: center; 
    width: 100%;
    margin: auto;
  }
  
  .question-grid {
    margin-left: 10%;
  }
  .question-grid, .feedback-grid {
    padding: 1.5rem;
    background-color: #ffffff;
    text-align: left;
    margin-top: 10%;
  }
  .current-question {
    font-size: 9rem;
    font-weight: bold;
    margin-top: 6rem;
    margin-bottom: 6rem;
  }
  .mode-message{
    margin: 8.3%;
    font-size: 6rem;
  }
</style>