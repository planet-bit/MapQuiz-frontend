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
        <RadioButtons v-model="gameType" label="Location" value="location" />
        <RadioButtons v-model="gameType" label="Letter" value="letter" />
        <div class="separator"></div>
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
import { ref, computed } from "vue";
import TitleBar from "@/views/TitleBar.vue";
import Game from "@/views/Game.vue";
import Learn from "@/views/Learn.vue";
import Map from "@/views/Map.vue";
import MyButtons from "@/components/MyButtons.vue";
import RadioButtons from "@/components/RadioButtons.vue";

const selectedCountry = ref(null); //選択中の国
const gameType = ref(null); //選択中のゲームタイプ
const isGameStarted = computed(() => !!gameType.value); // gameType が選択されたら true になる
const isLearning = ref(false); // Learnボタンの状態を管理
const isViewingMap = ref(false); // Mapボタンの状態を管理
const isLoggedIn = ref(false); //ログイン状態を管理

const handleCountryChange = (country) => {
  selectedCountry.value = country;
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
.buttons-container{
  display: flex;
  flex-wrap: nowrap;      /* 要素が折り返さない */
  align-items: center;    /* 垂直方向の中央揃え */
  overflow-x: auto;
}
.separator {
  display: inline-block;
  width: 1rem;
  height: 7.5rem;
  background-color: #00000085;
  vertical-align: middle;
  margin: 0 10rem;
  border-radius: 0.5rem;
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