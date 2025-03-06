<template>
  <div v-if="isLearning">
    <div class="language-list">
      List of languages in {{ selectedCountry }}
      <GameButtons class="learn-close-button" text="CLOSE" @click="$emit('close-learning')"/>
      <ul>
        <li v-for="(pronunciation, index) in languageList" :key="index">
          {{ pronunciation.letters }}
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, watch } from 'vue';
  import GameButtons from '@/components/GameButtons.vue';
  
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
  
  const languageList = ref([]);

  // 国ごとのデータを API から取得する関数
const fetchLanguageData = async () => {
  if (!props.selectedCountry) return;
  try {
    const response = await fetch(`http://localhost:3000/api/letters/${props.selectedCountry}`);
    if (!response.ok) throw new Error('データ取得に失敗しました');
    
    const data = await response.json();
    languageList.value = data;
  } catch (error) {
    console.error('APIエラー:', error);
  }
};

// selectedCountry が変わったらデータを取得
watch(() => props.selectedCountry, fetchLanguageData, { immediate: true });
 
</script>
  
<style scoped>

  .language-list {
    position: relative;
    padding: 10rem;
    font-size: 6rem;
    font-weight: bold;
  }

  .language-list ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); /* 列幅の自動調整 */
  grid-auto-flow: column; /* 縦方向（列優先）に配置 */
  grid-template-rows: repeat(11, auto); /* 行数を決める（適宜調整） */
  list-style-type: none;
  margin:5rem;
 }

  .language-list ul li {
    font-size: 5rem; /* 文字サイズを調整 */
    font-weight: bold;
    line-height: 1.5;
    padding: 1rem;
    text-align: center;
    background-color: rgb(255, 255, 255);
  }
  
  .learn-close-button {
    margin-left: 5rem;
  }
 
</style>
  