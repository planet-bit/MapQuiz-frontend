<template>
  <div class="game-mode-selector">
    <!-- ① 国選択 -->
    <div class="section">
      <h3>①学びたい国を選ぼう</h3>
      <select v-model="selectedCountryLocal" @change="onCountryChange" class="country-select">
        <option value="" disabled hidden>選択してください</option>
        <option v-for="country in countries" :key="country.code" :value="country">
          {{ country.name }}
        </option>
      </select>
    </div>

    <!-- ② モード選択 -->
    <div class="mode-buttons">
      <h3>②モードを選ぼう</h3>
      <div>
        <RadioButtons
          :modelValue="selectedMode"
          @update:modelValue="selectMode"
          label="クイズで遊ぶ"
          value="quiz"
        />
        <RadioButtons
          :modelValue="selectedMode"
          @update:modelValue="selectMode"
          label="学習する"
          value="learn"
        />
      </div>
    </div>

    <!-- ③ クイズ／学習の種類 -->
    <div class="wrapper">
      <!-- クイズ設定 -->
      <div v-if="selectedMode === 'quiz'" class="game-type">
        <h3>③クイズの種類を選択</h3>
        <div class="radio-group">
          <RadioButtons
            :modelValue="gameType"
            @update:modelValue="updateGameType"
            label="地域当てクイズ"
            value="location"
          />
          <RadioButtons
            :modelValue="gameType"
            @update:modelValue="updateGameType"
            label="読み当てクイズ"
            value="letter"
          />
        </div>

        <div class="mode-selection">
          <label>
            <input type="checkbox" v-model="internalChallengeMode" />
            <span>Challenge Mode</span>
          </label>
          <ul class="challenge-info">
            <li>制限時間10秒</li>
            <li>ログインユーザーは成績を記録されます</li>
          </ul>
        </div>
      </div>

      <!-- 学習設定 -->
      <div v-if="selectedMode === 'learn'">
        <h3>③学習の種類を選択</h3>
        <div>
          <RadioButtons
            :modelValue="gameType"
            @update:modelValue="updateGameType"
            label="地図"
            value="isMapViewing"
          />
          <RadioButtons
            :modelValue="gameType"
            @update:modelValue="updateGameType"
            label="言語の読み方表"
            value="isLearning"
          />
        </div>
      </div>
    </div>

    <!-- スタートボタン -->
    <NavigationButtons text="START" @click="handleStart" />
    <p v-if="message" class="error-message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import RadioButtons from "@/components/RadioButtons.vue";
import NavigationButtons from "@/components/NavigationButtons.vue";

// props / emits
const props = defineProps({
  gameType: String,
  challengeMode: Boolean,
});
const emit = defineEmits([
  "update:gameType",
  "update:challengeMode",
  "country-selected",
  "start-game",
]);

// 状態管理
const countries = ref([]);
const selectedCountryLocal = ref("");
const selectedMode = ref("quiz");
const message = ref("");

// チャレンジモードとのバインディング
const internalChallengeMode = computed({
  get: () => props.challengeMode,
  set: (val) => emit("update:challengeMode", val),
});

// イベント関数
const handleStart = () => {
  if (!selectedCountryLocal.value) {
    message.value = "国名を選択してください。";
    return;
  }

  if (!props.gameType) {
    message.value = selectedMode.value === "quiz"
      ? "クイズの種類を選んでください。"
      : "学習の種類を選んでください。";
    return;
  }

  message.value = "";
  emit("start-game");
};

const fetchCountries = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/countries");
    countries.value = response.data.map((item) => ({
      code: item.country_code,
      name: item.country_name,
    }));
  } catch (error) {
    console.error("国リストの取得に失敗しました:", error);
  }
};

onMounted(fetchCountries);

const onCountryChange = () => {
  emit("country-selected", selectedCountryLocal.value);
};

const updateGameType = (value) => {
  emit("update:gameType", value);
};

const selectMode = (mode) => {
  selectedMode.value = mode;
  updateGameType(null);
};
</script>

<style scoped>
.game-mode-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 500px;
  max-width: 98vw;
  margin: 0 auto;
  padding: 20px;
}

.section,
.mode-buttons,
.wrapper {
  width: 100%;
  max-width: 98vw;
  background-color: rgb(184, 223, 210);
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}

.country-select {
  font-size: 1rem;
}

.wrapper {
  height: 13rem;
}

.game-type {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mode-selection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* challenge-info はリストらしく block 表示に */
.challenge-info {
  margin-left: 1rem;
  padding-left: 1rem;
  list-style-type: disc;
  text-align: left;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
