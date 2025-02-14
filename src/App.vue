<template>
  <div class ="title-bar-container">
      <!-- TitleBarからのボタンの情報を受け取り、関数実行 -->
    <TitleBar 
      @country-selected="handleCountryChange" 
      @start-game="handleStartGame" 
      @letters-game="handleLettersGame" 
      @learn-language="handleLearnLanguage"
    />
  </div> 
  <div class = "game-container">
    <!-- Gameに情報を渡す -->
    <Game v-if="isGameStarted" :selectedCountry="selectedCountry" :gameType="gameType" />
  </div>
  <div class = "learn-container">
    <!-- LearnButtonに情報を渡し、Closeボタンの情報を受け取り、関数実行 -->
    <LearnButton v-if="selectedCountry" 
    :selectedCountry="selectedCountry"
    :isLearning="isLearning"
    @close-learning="handleCloseLearning" 
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import TitleBar from "./components/TitleBar.vue";
import Game from "./components/Game.vue";
import LearnButton from "./components/LearnButton.vue";

const selectedCountry = ref(null); //選択中の国
const gameType = ref(null); //選択中のゲームタイプ
const isGameStarted = ref(false); //ゲームが始まった時に表示させたいものに使う
const isLearning = ref(false); // Learnボタンの状態を管理

// 国の選択が変更されたときの処理
const handleCountryChange = (country) => {
  console.log('Countryボタンがクリックされました');
  selectedCountry.value = country; // `.value` とrefを使うことで値を追跡
};

// スタートゲームの処理
const handleStartGame = () => {
  console.log('Startボタンがクリックされました');
  gameType.value = "start";
  isGameStarted.value = true;
};

// 文字ゲームの処理
const handleLettersGame = () => {
  console.log('Lettersボタンがクリックされました');
  gameType.value = "letters";
  isGameStarted.value = true;
};

// Learnボタンが押されたときの処理
const handleLearnLanguage = () => {
  console.log('Learnボタンがクリックされました');
  isLearning.value = true; // 学習モードをONにする
};

// 学習モードを閉じる処理
const handleCloseLearning = () => {
  console.log('closeボタンがクリックされました');
  isLearning.value = false; // 学習モードをOFFにする
};

</script>

<style scoped>
.title-bar-container {
  position: absolute;
  top: 0;
  left: 0px;
  height: 15rem;
  width: 100%; 
}
.game-container {
  position: absolute;
  top: 15rem;
  left: 0;
  height:calc(100% - 15rem);
  width: 50%;
  background-color: blue;
}
.learn-container {
  position:absolute;
  top: 15rem;
  left:px;
  height:calc(100% - 15rem);
  width: 50%;
  background-color: rgb(23, 128, 75);
}
</style>