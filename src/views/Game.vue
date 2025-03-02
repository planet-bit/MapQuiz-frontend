<template>
  <div class="main-container">
    <!-- 問題をランダムで出題する機能 -->
    <QuestionManager ref="questionManager"
      :selectedCountry="selectedCountry" 
      :gameType="gameType"
      @question-updated="updateQuestion"
    />

    <!-- ゲーム開始前のモード選択の表示 -->
    <div v-if="!gameStarted" class="mode-selection">
      <label>
        <input type="checkbox" v-model="challengeMode" /> Challenge Mode <br> (10s limit)
      </label>
      <button @click="startGame">START</button> 
    </div>

    <!-- ゲームが開始された後の表示 -->
    <div v-else>
      <div class="question-grid">

        <!-- タイマー機能の表示 -->
        <Timer
          :challengeMode="challengeMode" 
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
      <div v-if="showAnswerFeedback">
        <AnswerFeedback 
          v-if="selectedChoice"
          :selectedChoice="selectedChoice"
          :correctAnswer="currentQuestion.answer"
          :streakCount="currentQuestionIndex - 1"
          :challengeMode="challengeMode"
          @next-question="nextQuestion"
          @retry-question="retryQuestion"
          @select-mode="selectMode"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

  import { ref, watch, onMounted } from "vue";
  import ChoiceButtons from "../components/ChoiceButtons.vue";
  import AnswerFeedback from "../components/AnswerFeedback.vue";
  import Timer from "../components/Timer.vue";
  import QuestionManager from "../components/QuestionManager.vue";

  // 親コンポーネントから渡されたプロパティ
  const props = defineProps({
    selectedCountry: String,
    gameType: String
  });

  const currentQuestion = ref(""); // 現在の問題
  const currentChoices = ref([]); // 現在の選択肢
  const selectedChoice = ref(null); // ユーザーの選択
  const currentQuestionIndex = ref(1); // 問題番号
  const isAnswered = ref(false); // 答えたかどうか
  const gameStarted = ref(false); // ゲーム開始の状態
  const challengeMode = ref(false); // チャレンジモードの状態
  const showAnswerFeedback = ref(false);  // フィードバック表示用
  const timerActive = ref (false);
  const triggerStopTimer = ref(false);
  const questionManager = ref(null);

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
    showAnswerFeedback.value = true; 
  };
  
  //問題番号、ユーザーの選択、解答の有無をリセット
  const GameReset = () => {
    currentQuestionIndex.value = 1;
    selectedChoice.value = null;
    isAnswered.value = false;
  }

  // 国やゲームタイプが変更されたらゲーム開始画面に戻す
  watch([() => props.selectedCountry, () => props.gameType], () => {
    gameStarted.value = false; 
    GameReset();
  });

  onMounted(() => {
    gameStarted.value = false; // 初回も選択画面にする
  });

  const selectMode = () => {
    gameStarted.value = false;
    GameReset();
  }

  // 解答を選択したときに呼ばれる関数
  const checkAnswer = (choice) => {
    selectedChoice.value = choice ?? "TIME_UP";  // 時間切れの場合 "TIME_UP" として選択
    isAnswered.value = true;
    StopTimer();
    // チャレンジモード時の解答チェック
    if (challengeMode.value && (choice !== currentQuestion.value.answer || choice === "TIME_UP")) {
      showAnswerFeedback.value = true; // フィードバック表示
    } else if (challengeMode.value && choice === currentQuestion.value.answer) {
      nextQuestion(); // 正解の場合次の問題に進む
    } else {
      showAnswerFeedback.value = true; // 不正解の場合フィードバックを表示
    }
  };

  // 次の問題に進む関数
  const nextQuestion = () => {
   currentQuestionIndex.value++; // 問題番号を進める
    isAnswered.value = false; // 回答済み状態をリセット
    selectedChoice.value = null; // 選択をリセット
    if (challengeMode.value) StartTimer(); // チャレンジモードならタイマーを再スタート
    if (questionManager.value) {
      console.log("Calling setQuestion in nextQuestion");
      questionManager.value.setQuestion();
    };
  }

  // ゲーム開始時の処理
  const startGame = () => {
    gameStarted.value = true;
    if (challengeMode.value) StartTimer();
    if (questionManager.value) {
      questionManager.value.setQuestion();
    }
  };

  const retryQuestion = () => {
    GameReset();
    startGame();
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
    font-size: 7rem;
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
</style>