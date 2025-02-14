<template>
  <!-- 学習モード時に言語一覧を表示 -->
  <div v-if="isLearning">
    <div class="language-list">
      <h3>List of languages in {{ selectedCountry }} 
        <button @click="closeLearning">CLOSE</button>
      </h3>
      <ul>
        <li v-for="(pronunciation, index) in languageData[selectedCountry]" :key="index">
          {{ pronunciation }}
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, watch } from 'vue';
  
  // 親コンポーネントから受け取る国
  const props = defineProps({
    selectedCountry: String,
    isLearning: Boolean
  });
  
  // 親コンポーネントにイベントを送るための関数 を定義する
  const emit = defineEmits(['close-learning']);

   // 親に学習モードを終了するイベントを送る関数
  const closeLearning = () => {
    emit('close-learning');
  };

  // 国ごとの言語の読み方一覧
  const languageData = {
    Russia: [
      "А → A", "Б → B", "В → V", "Г → G", "Д → D", "Е → E", "Ё → Yo", "Ж → Zh", "З → Z",
      "И → I", "Й → Y", "К → K", "Л → L", "М → M", "Н → N", "О → O", "П → P", "Р → R", "С → S",
      "Т → T", "У → U", "Ф → F", "Х → Kh", "Ц → Ts", "Ч → Ch", "Ш → Sh", "Щ → Shch", "Ъ → (Hard sign)",
      "Ы → Y", "Ь → (Soft sign)", "Э → E", "Ю → Yu", "Я → Ya"
    ],
    SouthKorea: [
      "ㅏ → A", "ㅑ → Ya", "ㅓ → Eo", "ㅕ → Yeo", "ㅗ → O", "ㅛ → Yo", "ㅜ → U", "ㅠ → Yu", "ㅡ → Eu", "ㅣ → I", 
      "ㅐ → Ae", "ㅒ → Yae", "ㅔ → E", "ㅖ → Ye", "ㅘ → Wa", "ㅙ → Wae", "ㅚ → Oe", "ㅝ → Weo", "ㅞ → We", "ㅟ → Wi", 
      "ㅢ → Ui", "ㄱ → G/K", "ㅋ → K", "ㄲ → Kk", "ㄴ → N", "ㄷ → D/T", "ㅌ → T", "ㄸ → Tt", "ㄹ → R/L", "ㅁ → M", 
      "ㅂ → B/P", "ㅍ → P", "ㅃ → Pp", "ㅅ → S", "ㅆ → Ss", "ㅇ → Ng", "ㅈ → J", "ㅉ → Jj", "ㅊ → Ch", "ㅎ → H",
    ],
    Bangladesh: [
      "অ → A", "আ → A", "ই → I", "ঈ → I", "উ → U", "ঊ → U", "ঋ → Ri", "এ → E", "ঐ → Oi", "ও → O",
      "ঔ → Ou","ক → K", "খ → Kh", "গ → G", "ঘ → Gh", "ঙ → Ng", "চ → Ch", "ছ → Chh", "জ → J",
      "ঝ → Jh", "ঞ → Ñ","ট → T", "ঠ → Th", "ড → D", "ঢ → Dh", "ণ → N","ত → T", "থ → Th", "দ → D",
      "ধ → Dh", "ন → N","প → P", "ফ → Ph", "ব → B", "ভ → Bh", "ম → M","য → Y", "র → R", "ল → L",
      "শ → Sh", "ষ → Sh", "স → S", "হ → H"
    ]
  };
</script>
  
<style scoped>
  /* 言語リストのウィンドウ */
  .language-list {
    position: relative;
    background-color: rgb(255, 255, 255);
    padding: 10rem;
    font-size: 7rem;
    font-weight: bold !important;
  }

  .language-list ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); /* 列幅の自動調整 */
  grid-auto-flow: column; /* 縦方向（列優先）に配置 */
  grid-template-rows: repeat(11, auto); /* 行数を決める（適宜調整） */
  list-style-type: none;
  
 }

  .language-list ul li {
    font-size: 5rem; /* 文字サイズを調整 */
    font-weight: bold;
    line-height: 1.5;
    padding: 1rem;
    text-align: center;
    background-color: rgb(255, 255, 255);
  }
  /* 閉じるボタン */
  button {
    margin-left: 5%;
    margin-bottom:5%;
    padding: 1rem 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    font-size: 5rem;
    box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  }
  button:hover {
    background-color: #0056b3;
  }
</style>
  