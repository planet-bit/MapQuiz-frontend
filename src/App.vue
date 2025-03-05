<template>
  <div class ="title-bar-container">
      <!-- TitleBarからのボタンの情報を受け取り、関数実行 -->
    <TitleBar 
      :isLoggedIn="isLoggedIn" 
      @country-selected="handleCountryChange" 
      @toggle-login="toggleLogin"
      @logout="logout"
    >
      <div v-if="selectedCountry"  class="buttons-container">
        <MyButtons text="Location" :isActive="gameType === 'start'" @click-action="handleLocationGame"/>
        <MyButtons text="Letters" :isActive="gameType === 'letters'" @click-action="handleLettersGame" />
        <MyButtons text="Learn" :isActive="isLearning" @click-action="handleLearnLanguage" />
        <MyButtons text="Map" :isActive="isViewingMap" @click-action="handleViewMap" />
      </div>

    </TitleBar>
  </div> 

  <div class = "game-container">
    <!-- Gameに情報を渡す -->
    <Game v-if="isGameStarted" :selectedCountry="selectedCountry" :gameType="gameType" />
  </div>
  <div class = "learn-container">
    <Learn 
      :selectedCountry="selectedCountry"
      :isLearning="isLearning"
      @close-learning="handleCloseLearning" 
    />
    <Map
      :selectedCountry="selectedCountry"
      :isViewingMap="isViewingMap"
      @close-map="handleCloseMap">
    </Map> 
  </div>
</template>

<script setup>
import { ref } from "vue";
import TitleBar from "./views/TitleBar.vue";
import Game from "./views/Game.vue";
import Learn from "./views/Learn.vue";
import Map from "./views/Map.vue";
import MyButtons from "./components/MyButtons.vue";

const selectedCountry = ref(null); //選択中の国
const gameType = ref(null); //選択中のゲームタイプ
const isGameStarted = ref(false); //ゲームが始まった時に表示させたいものに使う
const isLearning = ref(false); // Learnボタンの状態を管理
const isViewingMap = ref(false); // Mapボタンの状態を管理
const isLoggedIn = ref(false); //ログイン状態を管理

const handleCountryChange = (country) => {
  selectedCountry.value = country;
};

const handleLocationGame = () => {
  gameType.value = "start";
  isGameStarted.value = true;
};

const handleLettersGame = () => {
  gameType.value = "letters";
  isGameStarted.value = true;
};

const handleLearnLanguage = () => {
  isLearning.value = !isLearning.value;
  if (isLearning.value === true) {
    isViewingMap.value = false;
  };
};

const handleCloseLearning = () => {
  isLearning.value = false; 
};

const handleViewMap = () => {
  isViewingMap.value = !isViewingMap.value;
  if (isViewingMap.value === true) {
    isLearning.value = false;
  };
};

const handleCloseMap = () => {
  isViewingMap.value = false;
};

const toggleLogin = () => {
  isLoggedIn.value = !isLoggedIn.value;
};

const logout = () => {
  isLoggedIn.value = false;
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
  background-color: rgb(255, 255, 255);
}
.learn-container {
  position:absolute;
  top: 15rem;
  height:calc(100% - 15rem);
  width: 50%;
  background-color: rgb(255, 255, 255);
}
</style>