<template>
  <div class="main-container">

    <!-- ゲーム開始前のモード選択 -->
    <div v-if="!gameStarted" class="mode-selection">
      <label>
        <input type="checkbox" v-model="challengeMode" /> Challenge Mode <br> (10s limit)
      </label>
      <button @click="startGame">START</button> 
    </div>

    <!-- ゲームが開始された後の表示 -->
    <div v-else>
      <div class="question-grid">
        <div v-if="gameStarted && challengeMode" class="timer">
          Time Left: {{ timeLeft }}s
        </div>
        <p class="current-question">{{ currentQuestion.word }}</p>
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
          @end-challenge="endChallenge"
          @select-mode="selectMode"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, watch, onMounted } from "vue";
import ChoiceButtons from "./ChoiceButtons.vue";
import AnswerFeedback from "./AnswerFeedback.vue";

// 親コンポーネントから渡されたプロパティ
const props = defineProps({
  selectedCountry: String,
  gameType: String
});

// 問題と選択肢、状態管理用の変数
const currentQuestion = ref(""); // 現在の問題
const currentChoices = ref([]); // 現在の選択肢
const selectedChoice = ref(null); // ユーザーの選択
const correctChoice = ref(null); // 正解
const currentQuestionIndex = ref(1); // 問題番号
const isAnswered = ref(false); // 答えたかどうか
const gameStarted = ref(false); // ゲーム開始の状態
const challengeMode = ref(false); // チャレンジモードの状態
const showAnswerFeedback = ref(false);  // フィードバック表示用

// 問題をランダムに取得する関数
const loadQuestion = (selectedCountry, gameType) => {
  const key = `${selectedCountry}-${gameType}`; // 国とゲームタイプでキーを作成
  const questions = groups[key] || []; // 対応する問題リストを取得
  if (questions.length > 0) {
    const randomIndex = Math.floor(Math.random() * questions.length); // ランダムに問題を選択
    return questions[randomIndex];
  }
  return "";
};

// 選択肢を生成する関数
const generateChoices = (correctAnswer, allQuestions) => {
  // 正解以外の選択肢をランダムに取得
  let wrongAnswers = allQuestions
    .map(q => q.answer)
    .filter(answer => answer !== correctAnswer);

  // ダミー選択肢をランダムに選んで取得（足りなければそのまま）
  wrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 4);

  // 正解とダミー選択肢を混ぜる
  const choices = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
  return choices;
};

// 新しい問題をセットする関数
const setQuestion = () => {
  if (props.selectedCountry && props.gameType) {
    const question = loadQuestion(props.selectedCountry, props.gameType);
    currentQuestion.value = question;
    selectedChoice.value = null; 
    isAnswered.value = false; // 新しい問題に切り替える時にリセット

    if (question) {
      const key = `${props.selectedCountry}-${props.gameType}`;
      const allQuestions = groups[key] || [];
      currentChoices.value = generateChoices(question.answer, allQuestions);
    }
  }
};

// 国やゲームタイプが変更されたらゲーム開始画面に戻す
watch([() => props.selectedCountry, () => props.gameType], () => {
  gameStarted.value = false; // チャレンジ選択画面に戻る
  clearInterval(timer); // タイマー停止
  timeLeft.value = 10; // タイマーをリセット
  currentQuestionIndex.value = 1; // 問題番号をリセット
  selectedChoice.value = ""
});

onMounted(() => {
  gameStarted.value = false; // 初回も選択画面にする
});

const selectMode = () => {
  gameStarted.value = false; // チャレンジ選択画面に戻る
  clearInterval(timer); // タイマー停止
  timeLeft.value = 10; // タイマーをリセット
  currentQuestionIndex.value = 1; // 問題番号をリセット
  selectedChoice.value = ""
}

// 解答を選択したときに呼ばれる関数
const checkAnswer = (choice) => {
  selectedChoice.value = choice ?? "TIME_UP";  // 時間切れの場合 "TIME_UP" として選択
  isAnswered.value = true;
  clearInterval(timer); // タイマーを止める

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
  if (challengeMode.value) startTimer(); // チャレンジモードならタイマーを再スタート
  setQuestion(); // 新しい問題をセット
};

// ゲーム開始時の処理
const startGame = () => {
  gameStarted.value = true;
  setQuestion(); // ゲーム開始時に問題をセット
  if (challengeMode.value) startTimer(); // チャレンジモードならタイマーを開始
};

// タイマーの設定
const timeLeft = ref(10);
let timer = null;

const startTimer = () => {
  timeLeft.value = 10; // 10秒に設定
  timer = setInterval(() => {
    timeLeft.value--; // 秒数を減らす
    if (timeLeft.value <= 0) {
      clearInterval(timer); // タイマー停止
      checkAnswer("TIME_UP"); // 時間切れの処理
    }
  }, 1000);
};

const retryQuestion = () => {
    currentQuestionIndex.value = 1; // 問題番号を1にリセットする
    resetQuestion(); 
};

const resetQuestion = () => {
  selectedChoice.value = null; // 選択肢をリセット
  correctChoice.value = null; // 正解をリセット
  setQuestion(); // 新しい問題をセット
};

// チャレンジモードを終了する処理
const endChallenge = () => {
  gameStarted.value = false;
  currentQuestionIndex.value = 1; // 問題番号をリセット
  startGame(); // ゲーム再スタート
};
const groups = {
  "Russia-start": [
    {word: "test1", answer: "test1"},
    {word: "test2", answer: "test2"},
    {word: "test3", answer: "test3"},
    {word: "test4", answer: "test4"},
    {word: "test5", answer: "test5"},
    {word: "test6", answer: "test6"}
  ],
  "Russia-letters": [
    { "word": "Москва", "answer": "Moscow" },
    { "word": "Санкт-Петербург", "answer": "Saint Petersburg" },
    { "word": "Севастополь", "answer": "Sevastopol" },
    { "word": "Республика Адыгея", "answer": "Adygea Republic" },
    { "word": "Республика Алтай", "answer": "Altai Republic" },
    { "word": "Республика Башкортостан", "answer": "Bashkortostan Republic" },
    { "word": "Республика Бурятия", "answer": "Buryatia Republic" },
    { "word": "Республика Дагестан", "answer": "Dagestan Republic" },
    { "word": "Республика Ингушетия", "answer": "Ingushetia Republic" },
    { "word": "Кабардино-Балкарская Республика", "answer": "Kabardino-Balkaria Republic" },
    { "word": "Республика Калмыкия", "answer": "Kalmykia Republic" },
    { "word": "Карачаево-Черкесская Республика", "answer": "Karachay-Cherkess Republic" },
    { "word": "Республика Карелия", "answer": "Karelia Republic" },
    { "word": "Республика Коми", "answer": "Komi Republic" },
    { "word": "Республика Крым", "answer": "Crimea Republic" },
    { "word": "Республика Марий Эл", "answer": "Mari El Republic" },
    { "word": "Республика Мордовия", "answer": "Mordovia Republic" },
    { "word": "Республика Саха (Якутия)", "answer": "Sakha Republic (Yakutia)" },
    { "word": "Республика Северная Осетия — Алания", "answer": "North Ossetia-Alania Republic" },
    { "word": "Республика Татарстан", "answer": "Tatarstan Republic" },
    { "word": "Республика Тыва", "answer": "Tuva Republic" },
    { "word": "Удмуртская Республика", "answer": "Udmurt Republic" },
    { "word": "Республика Хакасия", "answer": "Khakassia Republic" },
    { "word": "Чеченская Республика", "answer": "Chechen Republic" },
    { "word": "Чувашская Республика", "answer": "Chuvash Republic" },
    { "word": "Алтайский край", "answer": "Altai Krai" },
    { "word": "Забайкальский край", "answer": "Zabaykalsky Krai" },
    { "word": "Камчатский край", "answer": "Kamchatka Krai" },
    { "word": "Краснодарский край", "answer": "Krasnodar Krai" },
    { "word": "Красноярский край", "answer": "Krasnoyarsk Krai" },
    { "word": "Пермский край", "answer": "Perm Krai" },
    { "word": "Приморский край", "answer": "Primorsky Krai" },
    { "word": "Ставропольский край", "answer": "Stavropol Krai" },
    { "word": "Хабаровский край", "answer": "Khabarovsk Krai" },
    { "word": "Амурская область", "answer": "Amur Oblast" },
    { "word": "Архангельская область", "answer": "Arkhangelsk Oblast" },
    { "word": "Астраханская область", "answer": "Astrakhan Oblast" },
    { "word": "Белгородская область", "answer": "Belgorod Oblast" },
    { "word": "Брянская область", "answer": "Bryansk Oblast" },
    { "word": "Владимирская область", "answer": "Vladimir Oblast" },
    { "word": "Волгоградская область", "answer": "Volgograd Oblast" },
    { "word": "Вологодская область", "answer": "Vologda Oblast" },
    { "word": "Воронежская область", "answer": "Voronezh Oblast" },
    { "word": "Ивановская область", "answer": "Ivanovo Oblast" },
    { "word": "Иркутская область", "answer": "Irkutsk Oblast" },
    { "word": "Калининградская область", "answer": "Kaliningrad Oblast" },
    { "word": "Калужская область", "answer": "Kaluga Oblast" },
    { "word": "Кемеровская область", "answer": "Kemerovo Oblast" },
    { "word": "Кировская область", "answer": "Kirov Oblast" },
    { "word": "Костромская область", "answer": "Kostroma Oblast" },
    { "word": "Курганская область", "answer": "Kurgan Oblast" },
    { "word": "Курская область", "answer": "Kursk Oblast" },
    { "word": "Ленинградская область", "answer": "Leningrad Oblast" },
    { "word": "Липецкая область", "answer": "Lipetsk Oblast" },
    { "word": "Магаданская область", "answer": "Magadan Oblast" },
    { "word": "Московская область", "answer": "Moscow Oblast" },
    { "word": "Мурманская область", "answer": "Murmansk Oblast" },
    { "word": "Нижегородская область", "answer": "Nizhny Novgorod Oblast" },
    { "word": "Новгородская область", "answer": "Novgorod Oblast" },
    { "word": "Новосибирская область", "answer": "Novosibirsk Oblast" },
    { "word": "Омская область", "answer": "Omsk Oblast" },
    { "word": "Оренбургская область", "answer": "Orenburg Oblast" },
    { "word": "Орловская область", "answer": "Oryol Oblast" },
    { "word": "Пензенская область", "answer": "Penza Oblast" },
    { "word": "Псковская область", "answer": "Pskov Oblast" },
    { "word": "Ростовская область", "answer": "Rostov Oblast" },
    { "word": "Рязанская область", "answer": "Ryazan Oblast" },
    { "word": "Самарская область", "answer": "Samara Oblast" },
    { "word": "Саратовская область", "answer": "Saratov Oblast" },
    { "word": "Сахалинская область", "answer": "Sakhalin Oblast" },
    { "word": "Свердловская область", "answer": "Sverdlovsk Oblast" },
    { "word": "Смоленская область", "answer": "Smolensk Oblast" },
    { "word": "Тамбовская область", "answer": "Tambov Oblast" },
    { "word": "Тверская область", "answer": "Tver Oblast" },
    { "word": "Томская область", "answer": "Tomsk Oblast" },
    { "word": "Тульская область", "answer": "Tula Oblast" },
    { "word": "Тюменская область", "answer": "Tyumen Oblast" },
    { "word": "Ульяновская область", "answer": "Ulyanovsk Oblast" },
    { "word": "Челябинская область", "answer": "Chelyabinsk Oblast" },
    { "word": "Ярославская область", "answer": "Yaroslavl Oblast" }
  ],
  "SouthKorea-start": [
    {word: "test1", answer: "test1"},
    {word: "test2", answer: "test2"},
    {word: "test3", answer: "test3"},
    {word: "test4", answer: "test4"},
    {word: "test5", answer: "test5"},
    {word: "test6", answer: "test6"}
  ],
  "SouthKorea-letters": [
    { word: "서울", answer: "Seoul" },
    { word: "부산", answer: "Busan" },
    { word: "인천", answer: "Incheon" },
    {word: "대구", answer: "Daegu"},
    {word: "광주", answer: "Gwangju"},
    {word: "test6", answer: "test6"}
  ],
  "Bangladesh-start": [
    {word: "test1", answer: "test1"},
    {word: "test2", answer: "test2"},
    {word: "test3", answer: "test3"},
    {word: "test4", answer: "test4"},
    {word: "test5", answer: "test5"},
    {word: "test6", answer: "test6"}
  ],
  "Bangladesh-letters": [
    { "word": "ঢাকা", "answer": "Dhaka" },
    { "word": "চট্টগ্রাম", "answer": "Chattogram" },
    { "word": "খুলনা", "answer": "Khulna" },
    { "word": "রাজশাহী", "answer": "Rajshahi" },
    { "word": "সিলেট", "answer": "Sylhet" },
    { "word": "বরিশাল", "answer": "Barishal" },
    { "word": "রংপুর", "answer": "Rangpur" },
    { "word": "কুমিল্লা", "answer": "Cumilla" },
    { "word": "নারায়ণগঞ্জ", "answer": "Narayanganj" },
    { "word": "বগুড়া", "answer": "Bogra" },
    { "word": "ময়মনসিংহ", "answer": "Mymensingh" },
    { "word": "গাজীপুর", "answer": "Gazipur" },
    { "word": "টাঙ্গাইল", "answer": "Tangail" },
    { "word": "ফরিদপুর", "answer": "Faridpur" },
    { "word": "কুষ্টিয়া", "answer": "Kushtia" },
    { "word": "যশোর", "answer": "Jashore" },
    { "word": "নোয়াখালী", "answer": "Noakhali" },
    { "word": "চাঁদপুর", "answer": "Chandpur" },
    { "word": "কক্সবাজার", "answer": "Cox's Bazar" },
    { "word": "ফেনী", "answer": "Feni" },
    { "word": "লক্ষ্মীপুর", "answer": "Lakshmipur" },
    { "word": "দিনাজপুর", "answer": "Dinajpur" },
    { "word": "ঠাকুরগাঁও", "answer": "Thakurgaon" },
    { "word": "পাবনা", "answer": "Pabna" },
    { "word": "শরীয়তপুর", "answer": "Shariatpur" },
    { "word": "গোপালগঞ্জ", "answer": "Gopalganj" },
    { "word": "মাদারীপুর", "answer": "Madaripur" },
    { "word": "সাতক্ষীরা", "answer": "Satkhira" },
    { "word": "পিরোজপুর", "answer": "Pirojpur" },
    { "word": "ঝালকাঠি", "answer": "Jhalokathi" },
    { "word": "ভোলা", "answer": "Bhola" },
    { "word": "বরগুনা", "answer": "Barguna" },
    { "word": "নেত্রকোণা", "answer": "Netrokona" },
    { "word": "সুনামগঞ্জ", "answer": "Sunamganj" },
    { "word": "মৌলভীবাজার", "answer": "Moulvibazar" },
    { "word": "হবিগঞ্জ", "answer": "Habiganj" },
    { "word": "গাইবান্ধা", "answer": "Gaibandha" },
    { "word": "কুড়িগ্রাম", "answer": "Kurigram" },
    { "word": "নওগাঁ", "answer": "Naogaon" },
    { "word": "জয়পুরহাট", "answer": "Joypurhat" },
    { "word": "নাটোর", "answer": "Natore" },
    { "word": "চুয়াডাঙ্গা", "answer": "Chuadanga" },
    { "word": "মেহেরপুর", "answer": "Meherpur" },
    { "word": "মাগুরা", "answer": "Magura" },
    { "word": "ঝিনাইদহ", "answer": "Jhenaidah" },
    { "word": "শেরপুর", "answer": "Sherpur" },
    { "word": "বাগেরহাট", "answer": "Bagerhat" },
    { "word": "বান্দরবান", "answer": "Bandarban" },
    { "word": "খাগড়াছড়ি", "answer": "Khagrachhari" }
  ],
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

  .timer {
    margin-left: 10%;
    font-size: 6rem;
    font-weight: bold;
  }
  .question-grid, .feedback-grid {
    padding: 1.5rem;
    background-color: #ffffff;
    text-align: left;
    margin-top: 10%;
  }
  .current-question {
    margin-left: 10%;
    font-size: 9rem;
    font-weight: bold;
    margin-top: 6rem;
    margin-bottom: 6rem;
  }
</style>