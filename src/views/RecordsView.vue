<template>

<h1 class="page-title">
  Challenge Mode Records
  <button @click="goMain" class="back-button">×</button>
</h1>
  
    
    <!-- データが取得できた場合 -->
    <table v-if="records.length > 0">
      <div class="records-container">
    <div v-for="(countryRecords, countryName) in groupedRecords" :key="countryName" class="country-card">
      <div class="country-name">{{ countryName }}</div>
      <div class="cards">
        
        </div>
        <div class="card-body">
          <div v-for="(record, index) in countryRecords" :key="index" class="record-card">
            <h3 class="card-header"><strong>{{ record.game_type }}</strong></h3>
            <p><strong>Max Streak:</strong> {{ record.max_streak }}</p>
            <p><strong>Average:</strong> 
              {{ (record.total_attempts ? (record.total_correct_answers / record.total_attempts).toFixed(2) : 0) }}</p>

          </div>
        </div>
      </div>
    </div>
 
    </table>
   <!-- データがない場合 -->
   <div v-else>No records found.</div>

</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  const router = useRouter();
  const route = useRoute();  // 現在のルートの情報を取得
  const userId = ref(route.params.userId);  // URLパラメータから userId を取得

  const goMain = () => {
    router.push('/'); // MainView に移動
  };

const records = ref([]);

// APIからデータを取得
// データを取得
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/streaks/get?user_id=${userId.value}`);
    records.value = response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
  }
});

// 国名ごとにレコードをグループ化
const groupedRecords = computed(() => {
  return records.value.reduce((acc, record) => {
    const countryName = record.country_name;  // 国名でグループ化
    if (!acc[countryName]) {
      acc[countryName] = [];
    }
    acc[countryName].unshift(record);
    return acc;
  }, {});
});

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
  display:flex;
  flex-direction: column;
  gap: 2rem;
  width: 80vh;
  top: 10vh;
  left: 10vw;
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

.cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
}

.card-body {
  display: flex; /* 横並びにする */
  flex-wrap: wrap; /* 画面幅が狭い場合は折り返し */
  gap: 100px;
  justify-content: flex-start; /* 左揃え */
}

.record-card {
  width: 40rem; /* 各カードの幅を指定 */
  background: #daf8da;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 30px;
  box-sizing: border-box;
  font-size: 4rem;
}

.record-card p {
  margin: 30px 0;
}









.back-button {

  width: 120px; /* 円形のサイズ */
  height: 120px; /* 円形のサイズ */
  background-color: #3aa366;
  color: white;
  font-size: 150px; /* バツの大きさ */
  border: none;
  border-radius: 50%; /* 円形にする */
  display: flex;
  justify-content: center; /* 中央揃え */
  align-items: center; /* 中央揃え */
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 400px;
}

.back-button:hover {
  background-color: #287247;
}
</style>
