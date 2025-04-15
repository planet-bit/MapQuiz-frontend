<template>
  <div class="main-container">
    <!-- 問題をランダムで出題するコンポーネント -->
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
      <p class="current-question" v-if="currentQuestion">{{ currentQuestion.word }}</p>

      <div class="game-container">
        <!-- タイマー表示 -->
        <Timer
          :challengeMode="props.challengeMode"
          :timerActive="timerActive"
          :triggerStopTimer="triggerStopTimer"
          @time-up="TimeUp"
        />

        <!-- 地図の選択肢 -->
        <ChoiceRegions
          class="choice-regions"
          :selectedChoice="selectedChoice"
          :correctAnswer="currentQuestion.answer"
          :isAnswered="isAnswered"
          :selectedCountry="selectedCountry"
          :gameStarted="gameStarted"
          :key="mapKey"
          @answer-selected="checkAnswer"
        />

        <!-- 回答フィードバック表示 -->
        <div >
          <AnswerFeedback
            class="answer-feedback"
            :selectedChoice="selectedChoice"
            :correctAnswer="currentQuestion.answer"
            :regionId=currentQuestion.region_id
            :streakCount="currentQuestionIndex - 1"
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import ChoiceRegions from "@/components/ChoiceRegions.vue";
import AnswerFeedback from "@/components/AnswerFeedback.vue";
import Timer from "@/components/Timer.vue";
import QuestionManager from "@/components/QuestionManager.vue";
import ModeSelection from "@/components/ModeSelection.vue";

/* ------------------------- PropsとEmit定義 ------------------------- */
const props = defineProps({
  challengeMode: Boolean,
  selectedCountry: Object,
  gameType: String,
  userId: Number,
});
const emit = defineEmits(["update:challengeMode"]);

/* ------------------------- リアクティブな状態 ------------------------- */
const currentQuestion = ref(null);         // 現在の問題
const currentChoices = ref([]);         // 選択肢
const selectedChoice = ref(null);       // ユーザーの選択
const currentQuestionIndex = ref(1);    // 現在の問題番号
const isAnswered = ref(false);          // 回答済みか
const gameStarted = ref(false);         // ゲームが始まっているか
const timerActive = ref(false);         // タイマーを動作させるか
const triggerStopTimer = ref(false);    // タイマー停止トリガー
const mapKey = ref(0);                  // 地図のkey（強制再描画用）
const questionManager = ref(null);      // QuestionManagerコンポーネントへの参照
const challengeMode = computed({
    get: () => props.challengeMode,
    set: (val) => emit('update:challengeMode', val)
  });

/* ------------------------- Watchers ------------------------- */


// 国またはモード変更時にリセット
watch([() => props.selectedCountry, () => props.gameType], () => {
  GameReset();
});

/* ------------------------- ゲーム関連関数 ------------------------- */
// QuestionManager からの出題を反映
const updateQuestion = ({ question, choices }) => {
  currentQuestion.value = question;
  currentChoices.value = choices;
};

// タイマー制御
const StartTimer = () => {
  timerActive.value = false;
  setTimeout(() => (timerActive.value = true), 0);
};
const StopTimer = () => {
  triggerStopTimer.value = true;
  setTimeout(() => (triggerStopTimer.value = false), 0);
};

// 時間切れ時の処理
const TimeUp = () => {
  checkAnswer("TIME_UP");
};

// ゲーム状態リセット
const GameReset = () => {
  currentQuestionIndex.value = 1;
  selectedChoice.value = null;
  isAnswered.value = false;
  gameStarted.value = false;
};

// 回答チェック
const checkAnswer = (choice) => {
  selectedChoice.value = choice ?? "TIME_UP";
  isAnswered.value = true;

  StopTimer();
  if (props.challengeMode) {
    sendAnswerResult();

    // チャレンジモードでは間違えたら終了
    if (choice === "TIME_UP" || choice !== currentQuestion.value.answer) {
    } else {
      nextQuestion();
    }
  }
};

// 次の問題に進む
const nextQuestion = () => {
  currentQuestionIndex.value++;
  isAnswered.value = false;
  selectedChoice.value = null;
  mapKey.value++;

  if (props.challengeMode) StartTimer();
  if (questionManager.value) questionManager.value.setQuestion();
};

// ゲームを開始する
const startGame = () => {
  currentQuestionIndex.value = 1;
  selectedChoice.value = null;
  isAnswered.value = false;
  gameStarted.value = true;
  if (props.challengeMode) StartTimer();
  if (questionManager.value) questionManager.value.setQuestion();
  mapKey.value++;
};

/* ------------------------- API 連携（スコア送信） ------------------------- */
const sendStreakData = async () => {
  if (!props.userId) return;
  const streak = currentQuestionIndex.value - 1;
  const data = {
    user_id: props.userId,
    game_type: props.gameType,
    country_code: props.selectedCountry.code,
    streak,
    correct_answers: streak,
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
    const response = await fetch("http://localhost:3000/api/streaks/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
/* ===== コンテナ全体 ===== */
.main-container {
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 5%;
}

.game-container {
  position: relative;
}

/* ===== ゲーム中スタイル ===== */
.current-question {
  font-size: 9rem;
  font-weight: bold;
  margin-top: 6rem;
  margin-bottom: 6rem;
}

.answer-feedback {
  position: absolute;
  top: 10%;
  left: 5%;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 40px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.choice-regions {
  position: relative;
  z-index: 1;
}
</style>
