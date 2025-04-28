<template>
  <div class="game-container">
    <!-- 問題をランダムで出題するコンポーネント -->
    <QuestionManager ref="questionManager"
      :selectedCountry="selectedCountry"
      :gameType="props.gameType"
      @question-updated="updateQuestion"
    />

      <p class="current-question" v-if="currentQuestion">{{ currentQuestion.word }}</p>

     
        <!-- タイマー表示 -->
        <Timer
          :challengeMode="props.challengeMode"
          :timerActive="timerActive"
          :triggerStopTimer="triggerStopTimer"
          @time-up="TimeUp"
        />

        <!-- 地図の選択肢 -->
        <ChoiceRegions
          v-if="currentQuestion"
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
        <div v-if="currentQuestion">
          <AnswerFeedback
            class="answer-feedback"
            :selectedChoice="selectedChoice"
            :correctAnswer="currentQuestion.answer"
            :streakCount="currentQuestionIndex - 1"
            :challengeMode="props.challengeMode"
            @next-question="nextQuestion"
            @retry-question="startGame"
            @select-mode="GameReset"
            @streak-finalized="sendStreakData"
          />
        </div>
      </div>
   
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import ChoiceRegions from "@/components/ChoiceRegions.vue";
import AnswerFeedback from "@/components/AnswerFeedback.vue";
import Timer from "@/components/Timer.vue";
import QuestionManager from "@/components/QuestionManager.vue";
import EventBus from "@/event-bus";
/* ------------------------- PropsとEmit定義 ------------------------- */
const props = defineProps({
  challengeMode: Boolean,
  selectedCountry: Object,
  gameType: String,
});
const emit = defineEmits(["game-reset"]);

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
  emit("game-reset");
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
const startGame = async () => {
  currentQuestionIndex.value = 1;
  selectedChoice.value = null;
  isAnswered.value = false;
  gameStarted.value = true;

  await nextTick(); // DOMの更新を待つ

  if (props.challengeMode) StartTimer();

  // QuestionManagerがセットされているか確認
  if (questionManager.value) {
    console.log("questionManagerがセットされました");

    // fetchQuestionsメソッドが存在しない場合
    if (typeof questionManager.value.fetchQuestions === 'function') {
      await questionManager.value.fetchQuestions(); // 問題データを取得
    }

    // 問題がロードされた後にsetQuestionを呼ぶ
    if (questionManager.value.questions.length > 0) {
      questionManager.value.setQuestion();
    } else {
    }
  }

  mapKey.value++;
};


// 問題データが更新されるタイミングでのチェック
watch(() => questionManager.value?.questions, (newQuestions) => {
  if (newQuestions.length > 0 && gameStarted.value) {
    questionManager.value.setQuestion();
  }
});



onMounted(() => {
  EventBus.on('start-game', () => {
   startGame()
  });
});

/* ------------------------- API 連携（スコア送信） ------------------------- */

// トークンをクッキーから取得
function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? match[1] : null;
}

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



const updateStreak = async (data) => {
  try {
    const token = getTokenFromCookie(); // 🍪 トークン取得

    if (!token) {
      throw new Error("トークンがありません。ログインが必要です。");
    }

    const response = await fetch("http://localhost:3000/api/streaks/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔐 JWTをヘッダーに追加
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
/* ===== コンテナ全体 ===== */
.game-container {
  flex-direction: column; /* 縦並びに */
  align-items: flex-start; /* 左寄せ */
  justify-content: flex-start; /* 上寄せ */
  width: 100vw;
  margin-left: 30px;
}

/* ===== ゲーム中スタイル ===== */
.current-question {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 50px;
    margin-bottom: 50px;
  }

.answer-feedback {
  position: absolute;
  top: 20%;
  left: 2%;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 40px;
  padding: 40px;
}

.choice-regions {
  position: relative;
  z-index: 1;
}
</style>
