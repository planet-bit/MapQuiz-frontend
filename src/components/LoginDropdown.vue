<template>
  <div>
    <a href="#" @click.prevent="toggleDropdown" class="login-dropdown-link">Log in</a>
  </div>

  <div v-if="isDropdownOpen && !token" class="dropdown-menu">
    <!-- ログインフォーム -->
    <form @submit.prevent="login" v-if="!isRegistering" novalidate>
      <div>Log in to your account</div>
      <CloseButtons class="user-deopdown-close-button" @click-action="closeDropdown" />
      <input type="email" v-model="email" placeholder="Email(テスト用:test@test.com)" required autocomplete="username">
      <input type="password" v-model="password" placeholder="Password(6文字以上、テスト用:test123)" required autocomplete="current-password">
      <div class="error-message" v-if="formError">{{ formError }}</div>
      <button>Login</button>
      <span>or <a href="#" @click.prevent="showRegisterForm" class="register-link">create your account</a></span>
    </form>

    <!-- アカウント登録フォーム -->
    <form @submit.prevent="register" v-else>
      <div>Create your account</div>
      <CloseButtons class="user-deopdown-close-button" @click-action="closeDropdown" />
      <input type="email" v-model="email" placeholder="Email(テスト用:test@test.com)" required autocomplete="username">
      <input type="password" v-model="password" placeholder="Password(6文字以上、テスト用:test123)" required autocomplete="current-password">
      <div class="error-message" v-if="formError">{{ formError }}</div>
      <button>Sign up</button>
      <span>or <a href="#" @click.prevent="showRegisterForm" class="register-link">log in your account</a></span>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CloseButtons from '@/components/CloseButtons.vue';

const isDropdownOpen = ref(false);
const isRegistering = ref(false);
const email = ref('');
const password = ref('');
const token = ref(null);
const formError = ref('');

// トークン取得
function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? match[1] : null;
}

onMounted(() => {
  const cookieToken = getTokenFromCookie();
  if (cookieToken) {
    token.value = cookieToken;
  }
});

// UI制御
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  isRegistering.value = false;
  clearForm();
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
  clearForm();
};

const showRegisterForm = () => {
  isRegistering.value = !isRegistering.value;
  clearForm();
};

const clearForm = () => {
  email.value = '';
  password.value = '';
  formError.value = '';
};

// バリデーション
const isValidPassword = (pwd) => /^[a-zA-Z0-9]{6,}$/.test(pwd);

// ログイン
const login = async () => {
  formError.value = '';

  if (!email.value) {
    formError.value = "メールアドレスを入力してください。";
    return;
  }

  if (!isValidPassword(password.value)) {
    formError.value = "パスワードは半角英数字6文字以上で入力してください。";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok && data.token) {
      document.cookie = `token=${data.token}; path=/;`;
      token.value = data.token;
      location.reload();
    } else {
      formError.value = data.error || "ログインに失敗しました。";
    }
  } catch (error) {
    console.error("ログインエラー:", error);
    formError.value = "サーバーエラーが発生しました。";
  }
};

// 登録
const register = async () => {
  formError.value = '';

  if (!email.value || !password.value) {
    formError.value = "メールアドレスとパスワードを入力してください！";
    return;
  }

  if (!isValidPassword(password.value)) {
    formError.value = "パスワードは半角英数字6文字以上で入力してください。";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok && data.token) {
      document.cookie = `token=${data.token}; path=/;`;
      token.value = data.token;
      isRegistering.value = false;
      location.reload();
    } else {
      formError.value = data.error || "登録に失敗しました。";
    }
  } catch (error) {
    console.error("登録エラー:", error);
    formError.value = "サーバーエラーが発生しました。";
  }
};
</script>


<style scoped>
  .login-dropdown-link {
    color: rgb(0, 0, 0); 
    font-size: 6rem; 
    font-weight: bold;
    text-decoration: none; 
  }

.dropdown-menu {
  position: absolute;
  font-size: 4rem;
  top: 100%;
  right: 0;
  width: 2000px;
  height: 1000px;;
  background: rgb(245, 245, 245);
  border: 2px solid #bebdbd;
  box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.2);
  padding: 70px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  top: 195px;
  border-radius: 15px;
}

.dropdown-menu input {
  width: 80%; 
  padding: 20px;
  font-size: 4rem;  
  margin: 20px; 
  border: none;
  border-bottom: 2px solid #000000;
  outline: none;
}


.dropdown-menu button {
  width: 20rem;
  padding: 20px;
  font-size: 4rem; 
  margin: 20px;
}

.register-link {
  color: rgb(0, 0, 0);
  text-decoration: underline;
  font-size: 4rem; /* サイズ変更したい場合 */
}

.user-deopdown-close-button{
  position: absolute;
  top: 5%;
  right:0%
}
.error-message {
  color: red;
  font-size: 3rem;
  margin-top: 4px;
  margin-bottom: 8px;
}
</style>
