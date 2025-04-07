<template>
  
    <div class ="title-bar-container">
        <!-- TitleBarからのボタンの情報を受け取り、関数実行 -->
      <TitleBar 
        :isLoggedIn="isLoggedIn" 
        @user-logged-in="handleUserLogin"
        @country-selected="handleCountrySelected" 
        @toggle-login="toggleLogin"
        @logout="logout"
      >
        <div v-if="selectedCountry.code"  class="buttons-container">
          <RadioButtons v-model="gameType" label="Location" value="location" />
          <RadioButtons v-model="gameType" label="Letter" value="letter" />

          <div class="separator"></div>

          <ToggleButtons text="Map" 
            :isActive="isViewingStudyMap" 
            @click-action="toggleButton('Map')" 
          />
          <ToggleButtons text="Learn" 
            :isActive="isLearning" 
            @click-action="toggleButton('Learn')" 
          />
          
          <div class="separator"></div>
        </div>
  
      </TitleBar>
    </div> 
    <div class = "game-container">
      <GameLocation v-if="gameType === 'location' && isGameStarted" 
        v-model:challengeMode="challengeMode"
        :selectedCountry="selectedCountry" 
        :gameType="gameType" 
        :userId="userId" 
      />    
      <GameLetter v-if="gameType === 'letter' && isGameStarted" 
        v-model:challengeMode="challengeMode"
        :selectedCountry="selectedCountry" 
        :gameType="gameType" 
        :userId="userId" 
      />
    </div>
    <div class = "learn-container">
      <Learn 
        :challengeMode="challengeMode"
        :selectedCountry="selectedCountry"
        :isLearning="isLearning"
        @close-learning="handleCloseLearning" 
      />
      <StudyMap
        :challengeMode="challengeMode"
        :selectedCountry="selectedCountry"
        :isViewingStudyMap="isViewingStudyMap"
        @close-map="handleCloseMap">
      </StudyMap> 
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import TitleBar from "@/views/TitleBar.vue";
  import GameLetter from "@/views/GameLetter.vue";
  import GameLocation from "@/views/GameLocation.vue";
  import Learn from "@/views/Learn.vue";
  import StudyMap from "@/components/StudyMap.vue";
  import ToggleButtons from "@/components/ToggleButtons.vue";
  import RadioButtons from "@/components/RadioButtons.vue";
  
  const selectedCountry = ref({ code: "", name: "" });
  const gameType = ref(null); //選択中のゲームタイプ
  const challengeMode = ref(false)
  const isGameStarted = computed(() => !!gameType.value); // gameType が選択されたら true になる
  const isLearning = ref(false); // Learnボタンの状態を管理
  const isViewingStudyMap = ref(false); // Mapボタンの状態を管理
  const isLoggedIn = ref(false); //ログイン状態を管理
  const userId = ref(null);
  const handleUserLogin = (id) => {
    userId.value = id; // ユーザーIDを保存
  };
  
  const handleCountrySelected = (country) => {
      selectedCountry.value = country;
  };

  const toggleButton = (button) => {
  if (challengeMode.value) {
    return; // challengeModeがtrueの場合はボタンを押せないようにする
  }

  if (button === 'Learn') {
    isLearning.value = !isLearning.value;
    if (isLearning.value) {
      isViewingStudyMap.value = false;
    } else {
      isLearning.value = false; // LearnボタンをオフにしたときにisLearningをfalseにする
    }
  } else if (button === 'Map') {
    isViewingStudyMap.value = !isViewingStudyMap.value;
    if (isViewingStudyMap.value) {
      isLearning.value = false;
    } else {
      isViewingStudyMap.value = false; // MapボタンをオフにしたときにisViewingStudyMapをfalseにする
    }
  }
};
  
  const handleCloseLearning = () => {
    isLearning.value = false; 
  };
  
  const handleCloseMap = () => {
    isViewingStudyMap.value = false;
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