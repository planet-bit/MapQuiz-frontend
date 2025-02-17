<template>
  <div class="title-bar">
    <div class="title"@click="reloadPage">GeoLingo</div> 

    <div class="dropdown">
      <select v-model="selectedCountry" @change="selectCountry">
        <option value="" disabled hidden>Country</option>
        <!-- countries 配列から選択肢を動的に生成 -->
        <option v-for="country in countries" :key="country" :value="country">
          {{ country }}
        </option>
      </select>
    </div>

    <div v-if="selectedCountry" class="start-button">
      <button @click="startGame":class="{ active: selectedGameType === 'start' }">Location</button>
    </div>

    <div v-if="selectedCountry" class="letters-button">
      <button @click="lettersGame":class="{ active: selectedGameType === 'letters' }">Letters</button>
    </div>

    <div v-if="selectedCountry" class="learn-button">
      <button @click="learnLanguage":class="{ active: selectedLearn === 'learn' }">Learn</button>
    </div>

    <div class="login-link">
      <a href="/login">Login</a>
    </div>
  </div>
</template>

<script setup>
import { ref, watch} from "vue";

const props = defineProps({
   selectedLearn: String,
  });
  

// ページをリロードするメソッド
const reloadPage = () => {
  location.reload(); //JavaScriptの標準機能
};

//子コンポーネントで発火できるイベントを定義
const emit = defineEmits(['country-selected', 'start-game', 'letters-game', 'learn-language']);

const countries = ['Russia', 'SouthKorea','Bangladesh']; // 国リスト
const selectedCountry = ref(''); //変数を リアクティブ（変更を検知できる状態） にする
const selectedGameType = ref('');
const selectedLearn = ref(props.selectedLearn);

//親コンポーネントへイベントを送信
const selectCountry = () => {
  
  emit('country-selected', selectedCountry.value);
};
const startGame = () => {
  selectedGameType.value = "start";
  emit('start-game');
};
const lettersGame = () => {
  selectedGameType.value = "letters";
  emit('letters-game');
};
const learnLanguage = () => {
  emit('learn-language')
}
// `selectedLearn` の変更を監視し、リアルタイムで更新
watch(() => props.selectedLearn, (newVal) => {
  selectedLearn.value = newVal;
});
</script>

<style scoped>
  .title-bar {
    position: relative;
    display: flex;
    margin-right: 3rem;
    justify-content:  space-between;
    align-items: center; /* 縦方向に中央揃え */
    background: #68d47a;
    color: #000000; 
    width: 100%; 
    height:15rem; 
    padding: 0  10rem; /* 上下余白無し、左右あり */
  }
  
  
  .title {
    font-size: 9rem;
    font-weight: bold;
    text-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
    margin-right: 6%;
  }
  
/*ドロップダウンのスタイル*/
.dropdown {
  display: flex;
  align-items: center; /* アイテムを縦方向に中央揃え */
  font-size: 5rem;
  font-weight: bold;
  margin-right: 6%; 
  justify-content: flex-start; 
}

select {
  font-size: 6rem;
  font-weight: bold;
  padding: 1rem;
  background: none;
  border: none;
  border-bottom: 6px solid #000000;
  color: #000000;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-bottom: 5px solid #000000;
}

/*start-button, letters-button, learn-button*/
.start-button,
.letters-button,
.learn-button {

  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
  margin-right: 4%;
}

.start-button button,
.letters-button button,
.learn-button button {
  font-size: 6rem;
  font-weight: bold;
  background-color: #ffffff00;
  color: #000000;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-button button:hover,
.letters-button button:hover,
.learn-button button:hover {
  transform: scale(1.1);
  box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.2);
}

/*start-button,letters-button,learn-buttonの表示のされ方*/
@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity: 1;}
}

/* ログインリンクを右詰めにする */
  .login-link {
    margin-left: auto; /* 左側の余白を自動で埋めて右端へ */
  }

  .login-link a {
    color: #000000; 
    text-decoration: none; /* 下線を消す */
    font-size: 6rem;
    font-weight: bold;
  }
  
  .login-link a:hover {
    text-decoration: underline; /* ホバー時に下線を追加 */
  }

  button.active {
  background-color: #4CAF50; /* 緑色 */
}
 /* active状態のときはhoverを無効にする */
  button.active:hover {
    transform: none; /* スケーリングを無効にする */
    box-shadow: none; /* シャドウを無効にする */
  }

</style>
  



