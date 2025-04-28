<template>
    <div class="game-mode-selector">
      <!-- 国選択セクション -->
      <div class="section">
        <h2>学びたい国を選ぼう</h2>
        <select v-model="selectedCountryLocal" @change="onCountryChange">
          <option value="" disabled hidden>Country</option>
          <option v-for="country in countries" :key="country.code" :value="country">
            {{ country.name }}
          </option>
        </select>
      </div>
  
      <!-- ゲームタイプ選択 -->
      <div class="game-type">
        <RadioButtons
          :modelValue="gameType"
          @update:modelValue="updateGameType"
          label="Location"
          value="location"
        />
        <RadioButtons
          :modelValue="gameType"
          @update:modelValue="updateGameType"
          label="Letter"
          value="letter"
        />
      </div>
  
      <!-- モード選択 (地図または学習) -->
      <div class="mode-toggle">
        <ToggleButtons 
          text="Map" 
          :isActive="isViewingStudyMap" 
          :disabled="challengeMode" 
          @click-action="handleToggle('Map')" 
        />
        <ToggleButtons 
          text="Learn" 
          :isActive="isLearning" 
          :disabled="challengeMode" 
          @click-action="handleToggle('Learn')" 
        />
      </div>
  
      <!-- チャレンジモードの選択 -->
      <div class="mode-selection">
        <label>
          <input type="checkbox" v-model="internalChallengeMode" />
          <span class="challenge-title">Challenge Mode</span>
        </label>
        <ul class="challenge-info">
          <li>制限時間10秒</li>
          <li>ヒント無し（地図と言語の表の表示不可）</li>
          <li>ログインユーザーはこのモードのみレコードに記録されます</li>
        </ul>
        
        <NavigationButtons class="start-button" text="START" @click="$emit('start-game')" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import axios from "axios";
  import RadioButtons from "@/components/RadioButtons.vue";
  import ToggleButtons from "@/components/ToggleButtons.vue";
  import NavigationButtons from "@/components/NavigationButtons.vue";
  
  // プロパティの受け取り
  const props = defineProps({
    gameType: String,
    isLearning: Boolean,
    isViewingStudyMap: Boolean,
    challengeMode: Boolean
  });
  
  // イベントの発行
  const emit = defineEmits([
    "update:gameType",
    "update:isLearning",
    "update:isViewingStudyMap",
    "update:challengeMode",
    "country-selected",
    "start-game"
  ]);
  
  // 国データの管理
  const countries = ref([]);
  const selectedCountryLocal = ref('');
  
  // APIから国リストを取得
  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/countries');
      countries.value = response.data.map(item => ({
        code: item.country_code,
        name: item.country_name,
      }));
    } catch (error) {
      console.error('国リストの取得に失敗しました:', error);
    }
  };
  
  // マウント時にAPIリクエスト実行
  onMounted(() => {
    fetchCountries();
  });
  
  // 国が選択されたときに親コンポーネントに通知
  const onCountryChange = () => {
    emit('country-selected', selectedCountryLocal.value);
  };
  
  // ゲームタイプが変更されたとき
  const updateGameType = (value) => {
    emit("update:gameType", value);
  };
  
  // モード（地図、学習）の切り替え処理
  const handleToggle = (button) => {
    if (props.challengeMode) return;
  
    if (button === "Learn") {
      emit("update:isLearning", !props.isLearning);
      emit("update:isViewingStudyMap", false);
    } else if (button === "Map") {
      emit("update:isViewingStudyMap", !props.isViewingStudyMap);
      emit("update:isLearning", false);
    }
  };
  
  // チャレンジモードのチェックボックスの双方向バインディング
  const internalChallengeMode = computed({
    get: () => props.challengeMode,
    set: (val) => emit('update:challengeMode', val)
  });
  </script>
  
  
  <style scoped>
 /* 全体コンテナ */
.game-mode-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* 各セクションのスタイル */
.game-mode-selector > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* ドロップダウン（国選択） */
.dropdown {
  width: 100%;
  text-align: center;
}

.dropdown select {
  width: 80%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
}

/* ゲームタイプ選択 */
.game-type {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
}

.game-type label {
  font-size: 18px;
}

/* ラジオボタン */
.radio-buttons {
  display: flex;
  gap: 10px;
}

.radio-buttons input {
  margin-right: 5px;
}

/* モード選択 */
.mode-toggle {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
}

.mode-toggle button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.mode-toggle button:hover {
  background-color: #45a049;
}

/* スタートボタン */
button.start-game {
  background-color: #FF5733;
  color: white;
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 30px;
  transition: background-color 0.3s;
}

button.start-game:hover {
  background-color: #e84a2d;
}

/* レスポンシブデザイン */
@media (max-width: 600px) {
  .game-mode-selector {
    padding: 15px;
  }

  .game-type,
  .mode-toggle {
    flex-direction: column;
    gap: 10px;
  }

  .dropdown select {
    width: 90%;
  }

  button.start-game {
    width: 100%;
  }
}

  </style>