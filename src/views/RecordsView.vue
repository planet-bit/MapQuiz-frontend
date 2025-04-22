<template>
  <!-- タイトルと戻るボタン -->
  <h1 class="page-title">
    Challenge Mode Records
    <CloseButtons @click-action="() => router.push('/')" />
  </h1>

  <!-- エラーメッセージを表示 -->
  <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

  <!-- 記録テーブルの表示（国ごとにまとめて表示） -->
  <table class="records-container" v-if="records.length > 0">
    <tr 
      v-for="(countryRecords, countryName) in groupedRecords" 
      :key="countryName" 
      class="country-card"
    >
      <!-- 国名 -->
      <th class="country-name">{{ countryName }}</th>

      <!-- 各記録をカードで表示 -->
      <td class="card">
        <div 
          v-for="record in countryRecords" 
          :key="record.id || record.country_code + record.game_type"
          @mouseover="hoveredCard = record"
          @mouseleave="hoveredCard = null"
        >
          <CountryRecordCard 
            :record="record"
            :isHovered="hoveredCard === record" 
            @select="onCardClick"
          />
        </div>
      </td>
    </tr>
  </table>

  <!-- 地図表示 -->
  <div class="map-container" v-if="showMap && clickedCountryCode">
    <h2 class="map-title">
      {{ countryNameFromCode }} - {{ clickedGameType }}
    </h2>

    <RegionAccuracyMap
      :countryCode="clickedCountryCode"
      :accuracyData="regionAccuracyData"
      :visible="showMap"
      @close="closeMap"
    />
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

// 子コンポーネント
import CountryRecordCard from '@/components/CountryRecordCard.vue';
import CloseButtons from '@/components/CloseButtons.vue';
import RegionAccuracyMap from '@/components/RegionAccuracyMap.vue';

// ルーティング関連
const router = useRouter();
const route = useRoute();

// ステート（リアクティブ変数）
const records = ref([]); // 全チャレンジ記録
const errorMessage = ref(null); // エラーメッセージ表示用
const showMap = ref(false); // 地図表示フラグ
const clickedCountryCode = ref(null); // 地図表示用の国コード
const clickedGameType = ref(null); // 選択されたゲームタイプ
const regionAccuracyData = ref([]); // 地域ごとの正答率データ
const hoveredCard = ref(null); // ホバーしたカードを追跡

// 国別の記録を取得するためのコンピューテッドプロパティ
const countryNameFromCode = computed(() => {
  const match = records.value.find(
    (record) => record.country_code === clickedCountryCode.value
  );
  return match ? match.country_name : clickedCountryCode.value;
});

// 画像・情報を国別にグループ化
const groupedRecords = computed(() => {
  const groups = {};
  records.value.forEach(record => {
    if (!groups[record.country_name]) {
      groups[record.country_name] = [];
    }
    groups[record.country_name].push(record);
  });
  return groups;
});

function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? match[1] : null;
}



// 初回マウント時にデータを取得
onMounted(async () => {
  try {
    const token = getTokenFromCookie(); // 🍪 クッキーから取得

    if (!token) {
      errorMessage.value = "ログインが必要です。";
      return;
    }

    const response = await axios.get("http://localhost:3000/api/streaks/get", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    records.value = response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = "記録の取得中にエラーが発生しました。";
  }
});


  // カードがクリックされた時に地図とデータを取得
  const onCardClick = async (record) => {
    clickedCountryCode.value = record.country_code;
    clickedGameType.value = record.game_type;

    try {
      const token = getTokenFromCookie(); // 🍪 クッキーから取得
  
      if (!token) {
        errorMessage.value = "ログインが必要です。";
        return;
      }
      const res = await axios.get(
        `http://localhost:3000/api/accuracy?country=${clickedCountryCode.value}&game_type=${clickedGameType.value}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
     );

      if (res.data && Array.isArray(res.data.regions)) {
        regionAccuracyData.value = res.data.regions;
        showMap.value = true;
      } else {
        errorMessage.value = "正答率データの形式が不正です。";
      }
    } catch (error) {
      errorMessage.value = "正答率データの取得に失敗しました。";
   }
  };

// 地図を閉じる処理
const closeMap = () => {
  showMap.value = false;
  regionAccuracyData.value = [];
  clickedCountryCode.value = null;
};
</script>


<style scoped>
.page-title {
  font-size: 7rem;
  font-weight: bold;
  text-align: left;
  margin: 0;
  padding: 10px 20px;
  position: absolute;
  top: 50px;
  left: 200px;
  display: flex;
  align-items: center;  /* 垂直方向の中央揃え */
  justify-content: space-between;  /* 左右の間隔を均等にする */
}

.records-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 80vh;
  position: absolute;
  top: 300px;
  left: 300px;
}

.country-card {
  margin-bottom: 30px;
}

.country-name {
  font-size: 6rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.card {
  display: flex; 
  flex-wrap: wrap; 
  gap: 100px;
  justify-content: flex-start; 
}

.record-card {
  width: 40rem;
  background: #daf8da;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 30px;
  font-size: 4rem;
}

.record-card p {
  margin: 30px 0;
}

button {
  margin-left: 400px;
}

.map-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  margin-top: -500px;
}

.map-title {
  font-size: 5rem;
  font-weight: bold;
  text-align: center;
}

.record-card:hover {
  background-color: #b8ecb8; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); 
  transform: translateY(-5px); 
}


</style>
