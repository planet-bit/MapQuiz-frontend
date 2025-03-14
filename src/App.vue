<template>
  <div class ="title-bar-container">
      <!-- TitleBarからのボタンの情報を受け取り、関数実行 -->
    <TitleBar 
      :isLoggedIn="isLoggedIn" 
      @country-selected="handleCountrySelected" 
      @toggle-login="toggleLogin"
      @logout="logout"
    >
      <div v-if="selectedCountry.code"  class="buttons-container">
        <RadioButtons v-model="gameType" label="Location" value="location" />
        <RadioButtons v-model="gameType" label="Letter" value="letter" />
        <div class="separator"></div>
        <ToggleButtons text="Learn" :isActive="isLearning" @click-action="toggleButton('Learn')" />
        <ToggleButtons text="Map" :isActive="isViewingMap" @click-action="toggleButton('Map')" />
        <div class="separator"></div>
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
import ToggleButtons from "@/components/ToggleButtons.vue";
import RadioButtons from "@/components/RadioButtons.vue";

const selectedCountry = ref({ code: "", name: "" });
const gameType = ref(null); //選択中のゲームタイプ
const isGameStarted = computed(() => !!gameType.value); // gameType が選択されたら true になる
const isLearning = ref(false); // Learnボタンの状態を管理
const isViewingMap = ref(false); // Mapボタンの状態を管理
const isLoggedIn = ref(false); //ログイン状態を管理

const handleCountrySelected = (country) => {
    selectedCountry.value = country;
};
const toggleButton = (button) => {
    if (button === 'Learn') {
      isLearning.value = !isLearning.value;
      if (isLearning.value) {
        isViewingMap.value = false;
      }
    } else if (button === 'Map') {
      isViewingMap.value = !isViewingMap.value;
      if (isViewingMap.value) {
        isLearning.value = false;
      }
    }
  };

const handleCloseLearning = () => {
  isLearning.value = false; 
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
  height: 240px;
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
  width: 12px;
  height: 110px;
  background-color: #00000085;
  vertical-align: middle;
  margin: 0 160px;
  border-radius: 6px;
}
.game-container {
  position: absolute;
  top: 240px;
  left: 0;
  height:calc(100% - 240px);
  width: 50%;
  background-color: rgb(255, 255, 255);
}
.learn-container {
  position:absolute;
  top: 240px;
  height:calc(100% - 240px);
  width: 50%;
  background-color: rgb(255, 255, 255);
}
</style>