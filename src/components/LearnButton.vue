<template>
  <!-- 学習モード時に言語一覧を表示 -->
  <div v-if="isLearning" class="overlay">
    <div class="language-list">
      <h3>{{ selectedCountry }} の言語一覧</h3>
      <ul>
        <li v-for="(pronunciation, index) in languageData[selectedCountry]" :key="index">
          {{ pronunciation }}
        </li>
      </ul>
      <button @click="closeLearning">CLOSE</button>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, watch } from 'vue';
  
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

  // 国ごとの言語の読み方一覧
  const languageData = {
    Russia: ["А → A", "Б → B", "В → V", "Г → G", "Д → D", "Е → E", "Ё → Yo", "Ж → Zh", "З → Z"],
    SouthKorea: ["ハングル"],
  };
  </script>
  
  <style scoped>
  .overlay {
  position: fixed;  /* 画面全体に固定 */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 透過黒 */
  z-index: 1000; /* 言語ウィンドウの後ろに配置 */
}

/* 言語リストのウィンドウ */
.language-list {
  position: fixed;  /* 画面全体に固定 */
  top: 10%; /* 画面上部に少し余裕を持たせる */
  left: 50%; /* 画面の中央へ */
  transform: translate(-50%, 0); /* 中央寄せ */
  width: 80vw;
  height: 80vh;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001; /* overlay より前面 */
}

/* 言語リストのウィンドウ */
.language-list {
  position: fixed;  /* 画面全体に固定 */
  top: 10%; /* 画面上部に少し余裕を持たせる */
  left: 50%; /* 画面の中央へ */
  transform: translate(-50%, 0); /* 中央寄せ */
  width: 80vw;
  height: 80vh;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001; /* overlay より前面 */
  font-size: 90px;
}

.language-list ul {
  padding: 0;
  list-style-type: none;
}

/* 言語リストの文字サイズを変更 */
.language-list ul li {
  font-size: 90px;  /* 文字サイズを調整 */
  line-height: 1.5;  /* 行間を少し広く */
  margin-bottom: 10px;  /* 各項目の下に余白を追加 */
}

/* 閉じるボタン */
button {
  position: fixed;
  bottom: 100px;
  right: 100px;
  padding: 10px 20px;
  background-color: #007bff;; /* 青色 */
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 75px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

button:hover {
  background-color: #0056b3;
}
  </style>
  