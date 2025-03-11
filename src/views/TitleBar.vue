<template>
  <div class="title-bar">
    <div class="left-container">
      <div class="title" @click="reloadPage">GeoLingo</div> 

      <div class="dropdown">
        <select v-model="selectedCountry" @change="selectCountry">
          <option value="" disabled hidden>Country</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
      </div>

      <slot></slot>
      
    </div>

    <div class="login-container">
      <LoginDropdown />
    </div>

</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import LoginDropdown from '../components/LoginDropdown.vue';


const emit = defineEmits([
  "country-selected", 
  "toggle-login",
  "logout",
  "view-history"
]);

const props = defineProps({
  gameType: String,
  isLearning: Boolean,
  isViewingMap: Boolean,
  isLoggedIn: Boolean,
});

const countries = ref([]);
const selectedCountry = ref("");

const fetchCountries = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/countries");
    countries.value = response.data.map(item => item.country_name);
  } catch (error) {
    const errorMessage = error.response ? 
      `Error: ${error.response.status} - ${error.response.data}` : 
      `Error message: ${error.message}`;
    console.error(errorMessage);
  }
};


// コンポーネントがマウントされた時にデータを取得
onMounted(() => {
  fetchCountries();
});

// 選択された国を処理する関数
const selectCountry = () => {
  emit("country-selected", selectedCountry.value);
};

const reloadPage = () => {
  location.reload();
};

</script>

<style scoped>
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #68d47a;
  color: #000000; 
  width: 100%; 
  height: 240px; 
  padding: 0 10rem;
}

.left-container {
  display: flex;
  align-items: center;
  gap: 160px;
}

.title {
  font-size: 9rem;
  font-weight: bold;
  text-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.dropdown select {
  font-size: 5.5rem;
  font-weight: bold;
  padding: 16px;
  background: none;
  border: none;
  border-bottom: 6px solid #000000;
  color: #000000;
  cursor: pointer;
}

.dropdown select:focus {
  outline: none;
  border-bottom: 5px solid #000000;
}

.buttons-container {
  display: flex;
  gap: 160px;
}

.login-container {
  position: relative;
}



</style>