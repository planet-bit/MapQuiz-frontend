<template>
  <div class="game-mode-selector">
    <!-- 国選択 -->
    <div class="section">
      <h3>①学びたい国を選ぼう</h3>
      <select v-model="selectedCountryLocal" @change="onCountryChange" class="country-select">
        <option value="" disabled hidden>選択してください</option>
        <option v-for="country in countries" :key="country.code" :value="country">
          {{ country.name }}
        </option>
      </select>
    </div>
   
    <!-- モード選択 -->
    <div class="mode-buttons">
  <h3>②モードを選ぼう</h3>
  <div class="radio-group">
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
          <span class="challenge-title">Challenge Mode</span>
        </label>
        <ul class="challenge-info">
          <li>制限時間10秒</li>
          <li>ログインユーザーは成績を記録されます</li>
        </ul>
      </div>
    </div>

    <!-- 学習設定 -->
    <div v-if="selectedMode === 'learn'" class="mode-toggle">
      <h3>学習表示形式を選択</h3>
      <div class="radio-group">
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
    <NavigationButtons
      text="START"
      :disabled="!selectedCountryLocal || !gameType
      
      "
      @click="$emit('start-game')"
    />
  </div> 
</template>

  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import axios from "axios";
  import RadioButtons from "@/components/RadioButtons.vue";
  import NavigationButtons from "@/components/NavigationButtons.vue";
  
  // プロパティの受け取り
  const props = defineProps({
    gameType: String,

  });
  
  // イベントの発行
  const emit = defineEmits([
    "update:gameType",
    "update:challengeMode",
    "country-selected",
    "start-game"
  ]);
  
  // 国データの管理
  const countries = ref([]);
  const selectedCountryLocal = ref('');
  const selectedMode = ref('quiz')

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
  const selectMode =(mode) => {
  selectedMode.value = mode
}
  
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
  width: 500px;
  max-width: 98vw;
  margin: 0 auto;
  padding: 20px;
}

.mode-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  background-color: rgb(184, 223, 210);
  border-radius: 4px;
  width: 500px;
  max-width: 98vw;
  padding: 10px;
}


.section {
  width: 100%;
  text-align: center;
  background-color: rgb(184, 223, 210);
  border-radius: 4px;
  width: 500px;
  max-width: 98vw;
  padding: 10px;
}

.country-select{
  font-size: 1rem;
}

.wrapper {
  width: 100%;
  text-align: center;
  background-color: rgb(184, 223, 210);
  border-radius: 4px;
  width: 500px;
  max-width: 98vw;
  height:13rem;
  padding: 10px;
}

.game-type,
.mode-toggle {
  display: flex;
  flex-direction: column; 
  align-items: center;
 
}

.radio-group {
  display: flex;
  gap: 1rem; /* ボタンの間に余白を作る */
}
.mode-selection {
  display: flex;
  flex-direction: column; 
  align-items:baseline
}

.challenge-info {
  display: flex;
  flex-direction: column; 
  align-items:baseline
}



</style>