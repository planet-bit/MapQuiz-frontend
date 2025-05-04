<template>
  <div class="title-bar-container">
    <!-- TitleBarからのログイン情報を受け取る -->
    <TitleBar @user-logged-in="handleUserLogin" />
  </div>

  <div class="main-container">
    <div class="buttons-container">
      <GameMenu
        v-show="!isGameStarted"
        :countries="countries"
        :gameType="gameType"
        :isLearning="isLearning"
        :isViewingStudyMap="isViewingStudyMap"
        :challengeMode="challengeMode"
        :is-questions-loaded="isQuestionsLoaded"
        @update:gameType="(val) => gameType = val"
        @update:isLearning="(val) => isLearning = val"
        @update:isViewingStudyMap="(val) => isViewingStudyMap = val"
        @country-selected="handleCountrySelected"
        @update:challengeMode="updateChallengeMode"
        @start-game="initializeGame"
      />
    </div>

    <GameLocation
      v-if="gameType === 'location' && isGameStarted"
      v-model:challengeMode="challengeMode"
      :selectedCountry="selectedCountry"
      :gameType="gameType"
      @game-reset="handleGameReset"
    />

    <GameLetter
      v-if="gameType === 'letter' && isGameStarted"
      v-model:challengeMode="challengeMode"
      :selectedCountry="selectedCountry"
      :gameType="gameType"
      @game-reset="handleGameReset"
    />

    <Learn
      v-if="gameType === 'isLearning'&& isGameStarted"
      :selectedCountry="selectedCountry"
      @game-reset="handleGameReset"
    />

    <StudyMap
      :isGameStarted="isGameStarted"
      :selectedCountry="selectedCountry"
      :gameType="gameType"
      @game-reset="handleGameReset"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import TitleBar from "@/views/TitleBar.vue";
import GameLetter from "@/views/GameLetter.vue";
import GameLocation from "@/views/GameLocation.vue";
import Learn from "@/views/Learn.vue";
import StudyMap from "@/components/StudyMap.vue";
import GameMenu from "@/components/GameMenu.vue";
import axios from "axios";
import EventBus from "@/event-bus";

// --- データ定義 ---
const selectedCountry = ref({ code: "", name: "" });
const gameType = ref("");  // 選択中のゲームタイプ
const challengeMode = ref(false);
const isLearning = ref(false);
const isViewingStudyMap = ref(false);
const userId = ref(null);
const isGameStarted = ref(false);

const countries = ref([]);

// --- メソッド定義 ---
// ユーザーログイン情報受け取り
const handleUserLogin = (id) => {
  userId.value = id;
};

// 国選択時に国情報を保存
const handleCountrySelected = (country) => {
  selectedCountry.value = country;
};

// 国リスト取得
const fetchCountries = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/countries");
    countries.value = response.data.map(item => ({
      code: item.country_code,
      name: item.country_name
    }));
  } catch (error) {
    const errorMessage = error.response
      ? `Error: ${error.response.status} - ${error.response.data}`
      : `Error message: ${error.message}`;
    console.error(errorMessage);
  }
};

// StudyMapコンポーネントを閉じる処理
const handleCloseMap = () => {
  isViewingStudyMap.value = false;
};

// マウント時に国リストを取得
onMounted(() => {
  fetchCountries();
});


const updateChallengeMode = (value) => {
  challengeMode.value = value;
};

const initializeGame = () => {
  isGameStarted.value = true;

  // Event Busを使ってstart-gameイベントを発火
  EventBus.emit('start-game');
};


const questionManager = ref(null);

const isQuestionsLoaded = computed(() => {
  return questionManager.value && questionManager.value.questions.length > 0;
});

const handleGameReset = () => {
  isGameStarted.value = false;
};

</script>
  
<style scoped>
.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 100vw;
  width: 100%;
}

  .title-bar-container {
    position: absolute;
    top: 0;
    left: 0px;
    height: 40px;
    width: 100%; 
  }
  .main-container {
    position: absolute;
    top: 40px;
    left: 0;
    height:calc(100% - 40px);
    width: 100%;
    background-color: rgb(255, 255, 255);
  }
  
  @media (max-width: 600px) {
  .title-bar-container {
    height: 30px;
  }

  .main-container {
    top: 30px;
    height: calc(100% - 30px);
  }
  }
</style>