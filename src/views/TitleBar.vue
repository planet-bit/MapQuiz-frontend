<template>
  <div class="title-bar">
    <div class="left-container">
      <div class="title" @click="reloadPage">GeoLingo</div> 

      <div class="dropdown">
        <select v-model="selectedCountry" @change="selectCountry">
          <option value="" disabled hidden>Country</option>
          <option v-for="country in countries" 
            :key="country.code" 
            :value="country.name">
            {{ country.name }}
          </option>
        </select>
      </div>
      <slot></slot> 
    </div>
    <nav>
      <div v-if = "!token" class="login-container">
        <LoginDropdown />
      </div>
      <div v-else class="user-container">
        <UserDropdown @signout="signout" />
      </div>
    
      <div class="burger">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
      </div>
    </nav>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import LoginDropdown from '@/components/LoginDropdown.vue';
  import UserDropdown from '@/components/UserDropdown.vue';

  const emit = defineEmits([
    "country-selected", 
    "toggle-login",
    "logout",
    "view-history",
    "user-logged-in"
  ]);

  const props = defineProps({
    gameType: String,
    isLearning: Boolean,
    isViewingMap: Boolean,
    isLoggedIn: Boolean,
  });

  const countries = ref([]);
  const selectedCountry = ref("");
  const token = ref(null);
  const userId = ref(null);

  // fetchCountries関数を非同期で定義し、APIから国名データを取得する処理を行う
  const fetchCountries = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/countries");
    countries.value = response.data.map(item => ({
      code: item.country_code, 
      name: item.country_name  
    }));
  } catch (error) {
    const errorMessage = error.response ? 
      `Error: ${error.response.status} - ${error.response.data}` : 
      `Error message: ${error.message}`;
    console.error(errorMessage);
  }
};

// クッキーからトークンを取得する関数
function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);  
  return match ? match[1] : null;
}

const fetchUserInfo = async () => {
  const cookieToken = getTokenFromCookie();  // クッキーからトークンを取得
  if (cookieToken) {
    token.value = cookieToken;
  }

  if (token.value) {
    try {
      const response = await axios.get("http://localhost:3000/auth/me", {
        headers: {
          Authorization: `Bearer ${token.value}`  // Authorizationヘッダーにトークンを設定
        }
      });
      userId.value = response.data.user.id;  // ユーザーIDを取得
      emit("user-logged-in", userId.value);  // 親コンポーネントに渡す
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました", error);
    }
  } else {
    console.log("トークンがありません");
  }
};

// コンポーネントがマウントされた時にデータを取得
onMounted(() => {
  fetchCountries();
});
onMounted(fetchUserInfo);

const selectCountry = () => {
  const selected = countries.value.find(c => c.name === selectedCountry.value);
  if (selected) {
    emit("country-selected", {
      code: selected.code,  
      name: selected.name   
    });
  }
};
  
const signout = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Cookie削除
  token.value = null; // ローカルの `token` を変更
  location.reload();
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
  background: #a8faa8;
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

  .burger {
    display: none;
    cursor: pointer;
  }

  .burger div{
  width: 4rem;
  height: 0.5rem;
  margin: 0.75rem;
  background-color: #000000;
 }

  @media screen and (max-width: 768px){
    .nav-link{
      position: absolute;
      right: 0;
      height: 92vh;
      top: 8vh;
      background-color: aqua;
    }
  }
</style>