<template>
  <div>
    <div class="language-list">
      <div class="language-title" >
        List of languages in {{ selectedCountry.name }}
        <CloseButtons class="learn-close-button" @click="$emit('game-reset')" />
      </div>
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
  import CloseButtons from '@/components/CloseButtons.vue';
  
  // 親コンポーネントから受け取る国
  const props = defineProps({
    selectedCountry: Object
  });
  
  // 親コンポーネントにイベントを送るための関数
  const emit = defineEmits(['game-reset']);
  
  const languageList = ref([]);

  // 国ごとのデータを API から取得する関数
  const fetchLanguageData = async () => {

    if (!props.selectedCountry.code) return;
    try {
      // country_code を使ってAPIからデータを取得
      const response = await fetch(`/server/api/letters/${props.selectedCountry.code}`);
      if (!response.ok) throw new Error('データ取得に失敗しました');
    
      // responseをJSON形式に変換し、languageListに格納
      const data = await response.json();
      languageList.value = data;
    } catch (error) {
      console.error('APIエラー:', error);
    }
  };

  // selectedCountry が変わったらデータを取得
  watch(() => props.selectedCountry.code, fetchLanguageData, { immediate: true });

</script>

  
<style scoped>
  .language-title {
    padding: 20px;
    font-size: 1rem;
    display: flex;
    font-weight: bold;
  }

  .language-list{
    width: 800px;
    max-width: 95vw;
  }
  .language-list ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(3rem, 1fr)); /* 列幅の自動調整 */
  grid-auto-flow: column; /* 縦方向（列優先）に配置 */
  grid-template-rows: repeat(11, auto); /* 行数を決める（適宜調整） */
  list-style-type: none;
  margin:5px;
 }
  .language-list ul li {
    font-size: 1rem; /* 文字サイズを調整 */
    font-weight: bold;
    line-height: 1.5;
    padding: 10px;
    text-align: center;
    background-color: rgb(255, 255, 255);
  }
  .learn-close-button {
    margin-left: 50px;
  }
</style>
  