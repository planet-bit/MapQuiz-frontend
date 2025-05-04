<template>
  <div>
    <a href="#" @click.prevent="toggleDropdown" class="login-dropdown-link">Log in</a>
  </div>

  <div v-if="isDropdownOpen && !token" class="dropdown-menu">
    <!-- ログインフォーム -->
    <form @submit.prevent="login" v-if="!isRegistering" novalidate>
      <div>Log in to your account</div>
      <CloseButtons class="user-dropdown-close-button" @click-action="closeDropdown" />
      <input type="email" v-model="email" placeholder="Email(テスト用:test@test.com)" autocomplete="off">
      <input type="password" v-model="password" placeholder="Password(6文字以上、テスト用:test123)" autocomplete="off">
      <div class="error-message" v-if="formError">{{ formError }}</div>
      <button>Login</button>
      <span>or <a href="#" @click.prevent="showRegisterForm" class="register-link">create your account</a></span>
    </form>

    <!-- アカウント登録フォーム -->
    <form @submit.prevent="register" v-else>
      <div>Create your account</div>
      <CloseButtons class="user-dropdown-close-button" @click-action="closeDropdown" />
      <input type="email" v-model="email" placeholder="Email" autocomplete="off">
      <input type="password" v-model="password" placeholder="Password" autocomplete="off">
      <input type="text" v-model="user_name" placeholder="Name" autocomplete="off">
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
const user_name = ref('');
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
    console.log("🍪 クッキーから取得したトークン:", cookieToken);
  } else {
    console.log("⚠️ クッキーにトークンが存在しません");
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
  user_name.value = '';
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
    formError.value = "パスワードは半角英数字6文字以上で入力してください!!";
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

  if (!email.value) {
    formError.value = "メールアドレスを入力してください。";
    return;
  }

  if (!password.value) {
    formError.value = "パスワードを入力してください！!!";
    return;
  }
  
  if (!isValidPassword(password.value)) {
      formError.value = "パスワードは半角英数字6文字以上で入力してください。";
      return;
    }

  if (!user_name.value) {
    formError.value = "ユーザーネームを入力してください！!!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value, user_name:user_name.value  }),
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
    font-size: 1.1rem; 
    font-weight: bold;
    text-decoration: none; 
  }

.dropdown-menu {
  position: absolute;
  font-size: 1rem;
  top: 100%;
  right: 0;
  width: 500px;
  max-width: 95vw;
  height: 300px;;
  background: rgb(245, 245, 245);
  border: 2px solid #bebdbd;
  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  top: 50px;
  border-radius: 5px;
}

.dropdown-menu input {
  width: 80%; 
  padding: 10px;
  font-size: clamp(0.75rem, 0.75rem, 1rem); 
  margin: 5px; 
  border: none;
  border-bottom: 1px solid #000000;
  outline: none;
}


.dropdown-menu button {
  padding: 5px;
  font-size: clamp(0.75rem, 0.75rem, 1rem);
  margin: 20px;
}

.register-link {
  color: rgb(0, 0, 0);
  text-decoration: underline;
  font-size: clamp(0.75rem, 0.75rem, 1rem); 
}

.user-dropdown-close-button{
  position: absolute;
  top: 5px;
  right: 10px;
}
.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 4px;
  margin-bottom: 8px;
}

@media (max-width: 600px) {
  .login-dropdown-link { 
    font-size: 0.9rem; 
  }
}
</style>
