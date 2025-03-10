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

    <!-- ログインボタン -->
    <div class="login-container">
      <a v-if="!isLoggedIn" href="#" @click.prevent="toggleLogin">Login</a>
      
      <!-- User ボタンとドロップダウン -->
      <div v-else class="user-menu">
        <a href="#" @click.prevent="toggleDropdown">User ▼</a>

        <!-- ドロップダウンメニュー -->
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <a href="#" @click.prevent="viewHistory">履歴</a>
          <a href="#" @click.prevent="logout">Sign out</a>
        </div>
      </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

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
const isDropdownOpen = ref(false); // ドロップダウンの表示状態

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
  const countryWithoutSpaces = selectedCountry.value.replace(/\s+/g, ''); // スペースを取り除く
  emit("country-selected", countryWithoutSpaces);  // スペースを取り除いた国名を親コンポーネントに渡す
};

const reloadPage = () => {
  location.reload();
};

const toggleLogin = () => {
  emit("toggle-login");
};

const logout = () => {
  isDropdownOpen.value = false;
  emit("logout"); // 親コンポーネントにログアウト処理を通知
};

const viewHistory = () => {
  isDropdownOpen.value = false;
  emit("view-history"); // 親コンポーネントに履歴表示のイベントを送る
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
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



.login-container a ,
.user-menu a {
  color: #000000; /* 黒色に設定 */
}

.login-container {
  position: relative;
  font-size: 6rem;
}

.user-menu {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  padding: 5px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 4rem;
}

.dropdown-menu a {
  display: block;
  padding: 8px 12px;
  color: black;
  text-decoration: none;
}

</style>