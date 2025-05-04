<template>
  <div class="title-bar">
    <div class="title" @click="reloadMainPage">GeoLingo</div> 

    <div v-if="!token" class="login-container">
      <LoginDropdown />
    </div>

    <div v-else class="user-container">
      <UserDropdown 
      :userName="userName" 
      @signout="signout" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import LoginDropdown from '@/components/LoginDropdown.vue';
import UserDropdown from '@/components/UserDropdown.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const emit = defineEmits(["user-logged-in"]);
const token = ref(null);
const userId = ref(null);
const userName = ref("User");
// クッキーからトークンを取得
const getTokenFromCookie = () => {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? match[1] : null;
};

const fetchUserInfo = async () => {
  const cookieToken = getTokenFromCookie();
  if (cookieToken) {
    token.value = cookieToken;
    try {
      const response = await axios.get("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      userId.value = response.data.user.id;
      userName.value = response.data.user.user_name;
      emit("user-logged-in", userId.value);
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました", error);
    }
  } else {
    console.log("トークンがありません");
  }
};

onMounted(fetchUserInfo);

const signout = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  token.value = null;
  location.reload();
};

const reloadMainPage = async () => {
  await router.push('/');
  location.reload();
}
</script>

<style scoped>
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #a8faa8;
  color: #000000;
  width: 100%;
  height: 40px;
  padding: 0 10px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

.login-container {
  position: relative;
}

@media (max-width: 600px) {
  .title-bar {
    height: 30px;
  }

  .title {
    font-size: 1rem; 
  }

  .login-container {
    font-size: 0.9rem; 
  }
}

</style>
