<template>
  <div class="main-container">
    <!-- 問題をランダムで出題するコンポーネント -->
    <QuestionManager
      ref="questionManager"
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

      <!-- 通常のモード選択 -->
      <div v-else class="mode-selection">
        <label>
          <input type="checkbox" v-model="localChallengeMode" />
          Challenge Mode <br />(10s limit, No hint)
        </label>
        <button @click="startGame">START</button>
      </div>
    </div>

    <!-- ゲーム中 -->
    <div v-else>
      <p class="current-question">{{ currentQuestion.word }}</p>

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
        <div v-if="showAnswerFeedback">
          <AnswerFeedback
            class="answer-feedback"
            v-if="selectedChoice"
            :selectedChoice="selectedChoice"
            :correctAnswer="currentQuestion.answer"
            :regionId=currentQuestion.region_id
            :streakCount="currentQuestionIndex - 1"
            :challengeMode="props.challengeMode"
            :gameType="props.gameType"
            :userId="props.userId"
            @next-question="nextQuestion"
            @retry-question="retryQuestion"
            @select-mode="selectMode"
            @streak-finalized="sendStreakData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import ChoiceRegions from "@/components/ChoiceRegions.vue";
import AnswerFeedback from "@/components/AnswerFeedback.vue";
import Timer from "@/components/Timer.vue";
import QuestionManager from "@/components/QuestionManager.vue";

/* ------------------------- PropsとEmit定義 ------------------------- */
const props = defineProps({
  challengeMode: Boolean,
  selectedCountry: Object,
  gameType: String,
  userId: Number,
});
const emit = defineEmits(["update:challengeMode"]);

/* ------------------------- リアクティブな状態 ------------------------- */
const currentQuestion = ref("");         // 現在の問題
const currentChoices = ref([]);         // 選択肢
const selectedChoice = ref(null);       // ユーザーの選択
const currentQuestionIndex = ref(1);    // 現在の問題番号
const isAnswered = ref(false);          // 回答済みか
const gameStarted = ref(false);         // ゲームが始まっているか
const showAnswerFeedback = ref(false);  // フィードバックを表示するか
const timerActive = ref(false);         // タイマーを動作させるか
const triggerStopTimer = ref(false);    // タイマー停止トリガー
const mapKey = ref(0);                  // 地図のkey（強制再描画用）
const questionManager = ref(null);      // QuestionManagerコンポーネントへの参照
const localChallengeMode = ref(props.challengeMode); // ローカルでのモード管理

/* ------------------------- Watchers ------------------------- */
// チャレンジモード切替時に親に伝える
watch(localChallengeMode, (newVal) => {
  emit("update:challengeMode", newVal);
});

// 国またはモード変更時にリセット
watch([() => props.selectedCountry, () => props.gameType], () => {
  gameStarted.value = false;
  GameReset();
});

/* ------------------------- 初期化 ------------------------- */
onMounted(() => {
  gameStarted.value = false;
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
  showAnswerFeedback.value = true;
};

// ゲーム状態リセット
const GameReset = () => {
  currentQuestionIndex.value = 1;
  selectedChoice.value = null;
  isAnswered.value = false;
};

// モード選択に戻る
const selectMode = () => {
  gameStarted.value = false;
  GameReset();
};

// 回答チェック
const checkAnswer = (choice) => {
  selectedChoice.value = choice ?? "TIME_UP";
  isAnswered.value = true;

  StopTimer();

  if (props.challengeMode) {
    // チャレンジモードでは間違えたら終了
    if (choice !== currentQuestion.value.answer || choice === "TIME_UP") {
      showAnswerFeedback.value = true;
    } else {
      nextQuestion();
    }
  } else {
    showAnswerFeedback.value = true;
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

// 同じ問題をやり直す
const retryQuestion = () => {
  GameReset();
  startGame();
};

// ゲームを開始する
const startGame = () => {
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

// サーバーに streak を送信
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
</script>


  
  <style scoped>
    .main-container {
      align-items: center; 
      justify-content: center; 
      width: 100%;
      margin: 5%;
    }
    .mode-selection {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
      background-color: #ffffff;
      max-width: 100%;
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, 0);
      text-align: left;
    }
    .mode-selection input[type="checkbox"] {
      margin-right: 5rem; 
    }
    .mode-selection label {
      font-size: 5rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 60rem
    }
    .mode-selection button {
      padding: 1rem 2rem;
      font-size: 5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 2rem;
      cursor: pointer;
      transform: translate(-50%, 0);
      box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
    }
    .mode-selection button:hover {
      background-color: #0056b3;
    }
    .mode-selection input[type="checkbox"] {
      width: 5rem;
      height: 5rem;
      accent-color: #007bff; 
      cursor: pointer;
    }
    .current-question {
      font-size: 9rem;
      font-weight: bold;
      margin-top: 6rem;
      margin-bottom: 6rem;
    }

    .game-container{
      position: relative;
    }
    .answer-feedback {
  position: absolute; /* 位置を指定 */
  top: 10%;
  left: 5%;
  z-index: 10; /* より高い値を設定して手前に表示 */
  background-color: rgba(255, 255, 255, 0.600); /* 背景色を白に設定 */
  border-radius: 40px; /* 角を丸くする（値は調整可能） */
  padding: 40px; /* 内側の余白を調整 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 影をつけて立体感を出す */
}

.choice-regions {
  position: relative; /* 位置を指定 */
  z-index: 1; /* 低い値を設定して後ろに表示 */
}

.mode-message{
  font-size: 6rem;
}
  </style>