<template>
  <h1 class="page-title">
    Challenge Mode Records
    <CloseButtons @click-action="() => router.push('/')" />
  </h1>
  
  <!-- データが取得できた場合 -->
  <table class="records-container" v-if="records.length > 0">
    <tr v-for="(countryRecords, countryName) in groupedRecords" :key="countryName" class="country-card">
      <th class="country-name">{{ countryName }}</th>
        <td class="card" >
          <div v-for="(record, index) in countryRecords" :key="index" class="record-card">
            <h3 class="card-header"><strong>{{ record.game_type }}</strong></h3>
            <p><strong>Max Streak:</strong> {{ record.max_streak }}</p>
            <p>
              <strong>Average:</strong> 
              {{ (record.total_attempts ? (record.total_correct_answers / record.total_attempts).toFixed(2) : 0) }}
            </p>
          </div>
        </td>
    </tr>
  </table>
   <!-- データがない場合 -->
  <div v-else>No records found.</div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  import CloseButtons from '@/components/CloseButtons.vue';
  const router = useRouter();
  const route = useRoute();  // 現在のルートの情報を取得
  const userId = ref(route.params.userId);  // URLパラメータから userId を取得
  const records = ref([]);

  // APIからデータを取得
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

  .card {
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
  
  button {
    margin-left: 400px;
  }
</style>
