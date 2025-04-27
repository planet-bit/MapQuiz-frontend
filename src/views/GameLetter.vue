<template>
  <div class="game-container">
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
      <p class="current-question">{{ currentQuestion.word }}</p>
        <!-- タイマー機能の表示 -->
        <Timer
          :challengeMode="props.challengeMode" 
          :timerActive="timerActive"
          :triggerStopTimer="triggerStopTimer"
          @time-up="TimeUp"
        />
        

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
   
      <AnswerFeedback 
        class="answer-feedback"
        v-if="selectedChoice"
        :selectedChoice="selectedChoice"
        :correctAnswer="currentQuestion.answer"
        :streakCount="currentQuestionIndex - 1"
        :challengeMode="props.challengeMode"
        @next-question="nextQuestion"
        @retry-question="startGame"
        @select-mode="GameReset"
        @streak-finalized="sendStreakData"
      />
  
 
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
  gameType: String
});

const emit = defineEmits(["update:challengeMode"]);

const currentQuestion = ref(""); // 現在の問題
const currentChoices = ref([]); // 現在の選択肢
const selectedChoice = ref(null); // ユーザーの選択
const currentQuestionIndex = ref(1); // 問題番号
const isAnswered = ref(false); // 答えたかどうか
const gameStarted = ref(false); // ゲーム開始の状態
const timerActive = ref(false);
const triggerStopTimer = ref(false);
const questionManager = ref(null);

const challengeMode = computed({
  get: () => props.challengeMode,
  set: (val) => emit("update:challengeMode", val)
});

const updateQuestion = ({ question, choices }) => {
  currentQuestion.value = question;
  currentChoices.value = choices;
};

const StartTimer = () => {
  timerActive.value = false;
  setTimeout(() => timerActive.value = true, 0);
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
  selectedChoice.value = choice ?? "TIME_UP";
  isAnswered.value = true;
  StopTimer();
  if (props.challengeMode) {
    sendAnswerResult();

    if (choice === "TIME_UP" || choice !== currentQuestion.value.answer) {
      return;
    } else {
      nextQuestion();
    }
  }
};

// 次の問題に進む関数
const nextQuestion = () => {
  currentQuestionIndex.value++;
  isAnswered.value = false;
  selectedChoice.value = null;
  if (props.challengeMode) StartTimer();
  if (questionManager.value) questionManager.value.setQuestion();
};

// ゲーム開始時の処理
const startGame = () => {
  currentQuestionIndex.value = 1;
  selectedChoice.value = null;
  isAnswered.value = false;
  gameStarted.value = true;
  if (props.challengeMode) StartTimer();
  if (questionManager.value) questionManager.value.setQuestion();
};

// 問題番号、ユーザーの選択、解答の有無をリセット
const GameReset = () => {
  currentQuestionIndex.value = 1;
  selectedChoice.value = null;
  isAnswered.value = false;
  gameStarted.value = false;
};

// トークンをクッキーから取得
function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? match[1] : null;
}

const updateStreak = async (data) => {
  try {
    const token = getTokenFromCookie();
    if (!token) return;

    const response = await fetch("http://localhost:3000/api/streaks/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`サーバーエラー: ${response.status} - ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("updateStreak エラー:", error);
    throw error;
  }
};

// `streak-finalized` イベントを受け取って、APIに送信
const sendStreakData = async () => {
  const token = getTokenFromCookie();
  if (!token) return;

  const streak = currentQuestionIndex.value - 1;
  const data = {
    game_type: props.gameType,
    country_code: props.selectedCountry.code,
    streak: streak,
    correct_answers: streak,
  };

  try {
    const response = await updateStreak(data);
    console.log("更新成功:", response);
  } catch (error) {
    console.error("更新エラー:", error);
  }
};

const sendAnswerResult = async () => {
  const token = getTokenFromCookie();
  if (!token) return;

  if (selectedChoice.value === null) return;

  const correctAnswer = currentQuestion.value.answer;
  const regionId = currentQuestion.value.region_id;
  const isCorrect = selectedChoice.value === correctAnswer && selectedChoice.value !== "TIME_UP";

  const requestData = {
    region_id: regionId,
    is_correct: isCorrect,
    game_type: props.gameType,
  };

  try {
    await fetch("http://localhost:3000/api/answers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });
    console.log("回答記録完了！");
  } catch (err) {
    console.error("回答記録エラー:", err);
  }
};
</script>


<style scoped>
 .game-container {
  

  
  flex-direction: column; /* 縦並びに */
  align-items: flex-start; /* 左寄せ */
  justify-content: flex-start; /* 上寄せ */
  width: 100vw;
  margin-left: 30px;
 
  }
  .current-question {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .mode-message{
    margin: 50px;
    font-size: 1.5rem;
  }
</style>