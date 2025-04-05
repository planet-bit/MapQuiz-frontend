<template>
  <div class="main-container">
      <!-- 問題をランダムで出題する機能 -->
    <QuestionManager ref="questionManager"
      :selectedCountry="selectedCountry" 
      :gameType="gameType"
      @question-updated="updateQuestion"
    />
  
    <!-- ゲーム開始前のモード選択の表示 -->
    <div v-if="!gameStarted">
      <!-- bd（バングラデシュ）のとき -->
      <div v-if="selectedCountry.code === 'bd'" class="mode-message">
        Preparing...
      </div>

      <!-- bd以外のとき -->
      <div v-else class="mode-selection">
      <label>
        <input type="checkbox" v-model="challengeMode" /> Challenge Mode <br> (10s limit)
      </label>
      <button @click="startGame">START</button> 
    </div>
  </div>

  
      <!-- ゲームが開始された後の表示 -->
    <div v-else>
      <!-- タイマー機能の表示 -->    
      <p class="current-question">{{ currentQuestion.word }}</p>
      <div class="game-container">

        <Timer
          :challengeMode="challengeMode" 
          :timerActive="timerActive"
          :triggerStopTimer="triggerStopTimer"
          @time-up="TimeUp"
        />

        <ChoiceRegions class="choice-regions"
          :selectedChoice="selectedChoice"
          :correctAnswer="currentQuestion.answer"
          :isAnswered="isAnswered"
          :selectedCountry="selectedCountry"
          :gameStarted="gameStarted"
          :key="mapKey"
          @answer-selected="checkAnswer"
        />
        <div v-if="showAnswerFeedback" >
          <AnswerFeedback class="answer-feedback"
            v-if="selectedChoice"
              :selectedChoice="selectedChoice"
              :correctAnswer="currentQuestion.answer"
              :streakCount="currentQuestionIndex - 1"
              :challengeMode="challengeMode"
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
  
    // 親コンポーネントから渡されたプロパティ
    const props = defineProps({
      selectedCountry: Object,
      gameType: String,
      userId: Number
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
    
    console.log(currentQuestion)
   
     // `streak-finalized` イベントを受け取って、APIに送信
    const sendStreakData = async () => {
      if (!props.userId) return; // ログインしていなければ処理を中断
      console.log("props.userId:", props.userId);
      const streak = currentQuestionIndex.value - 1;
      // 動的にデータを更新
      const data = {
        "user_id": props.userId, // ログインしたユーザーのIDを使う
        "game_type": props.gameType, // ゲームタイプ（選択に基づく）
        "country_code": props.selectedCountry.code, // 国コード（選択に基づく）
        "streak": streak, // 確定した連続記録
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
  console.log("選択された解答:", choice);

  StopTimer();
  console.log("タイマー停止後");

  // チャレンジモード時の解答チェック
  if (challengeMode.value) {
    console.log("チャレンジモード:", challengeMode.value);
    if (choice !== currentQuestion.value.answer || choice === "TIME_UP") {
      console.log("不正解または時間切れ");
      showAnswerFeedback.value = true; // フィードバック表示
    } else if (choice === currentQuestion.value.answer) {
      console.log("正解");
      nextQuestion(); // 正解の場合次の問題に進む
    }
  } else {
    console.log("通常モード");
    showAnswerFeedback.value = true; // 不正解の場合フィードバックを表示
    console.log("showAnswerFeedback.value:", showAnswerFeedback.value);

  }
};
    const mapKey = ref(0); // 地図のキーを管理するリアクティブ変数
    // 次の問題に進む関数
    const nextQuestion = () => {
     currentQuestionIndex.value++; // 問題番号を進める
      isAnswered.value = false; // 回答済み状態をリセット
      selectedChoice.value = null; // 選択をリセット
      mapKey.value++; // `key` の値を変えることで強制的に `ChoiceRegions` を再作成
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
      mapKey.value++; // `key` の値を変えることで強制的に `ChoiceRegions` を再作成
    };
  
    const retryQuestion = () => {
      GameReset();
      startGame();
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