<template>
  <div>
    <a v-if="!token" href="#" @click.prevent="toggleDropdown" class="login-dropdown-link">Log in</a>

    <div v-else class="user-menu">
      <a href="#" @click.prevent="toggleDropdown" class="user-dropdown-link">User ▼</a>
      <div v-if="isDropdownOpen" class="dropdown-menu">
        <a href="#" @click.prevent="viewHistory">履歴</a>
        <a href="#" @click.prevent="logout">Sign out</a>
      </div>
    </div>

    <div v-if="isDropdownOpen && !token" class="dropdown-menu">
      <!-- ログインフォーム -->
      <form @submit.prevent="login" v-if="!isRegistering">
        <div>Log in to your account</div>
        <input type="email" v-model="email" placeholder="Email" required autocomplete="username">
        <input type="password" v-model="password" placeholder="Password" required autocomplete="current-password">
        <button type="submit">Login</button>
        <span>or <a href="#" @click.prevent="showRegisterForm" class="register-link">create your account</a></span>
      </form>

      <!-- アカウント登録フォーム -->
      <form @submit.prevent="register" v-else>
        <div>Create your account</div>
        <input type="email" v-model="email" placeholder="Email" required autocomplete="username">
        <input type="password" v-model="password" placeholder="Password" required autocomplete="new-password">
        <div class="login-buttons">
          <button type="submit">Sign up</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDropdownOpen = ref(false);
const email = ref('');
const password = ref('');
const isRegistering = ref(false);
const token = ref(null);

// クッキーからトークンを取得
function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  console.log("クッキーから取得したトークン: ", match ? match[1] : null);  // クッキーのトークンを確認
  return match ? match[1] : null;
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  isRegistering.value = false;
};

// コンポーネントがマウントされたときにトークンを取得
onMounted(() => {
  // 最初にクッキーからトークンを取得
  const cookieToken = getTokenFromCookie();
  if (cookieToken) {
    token.value = cookieToken; // クッキーからトークンを取得して設定
  } else if (token.value) {
    // メモリにトークンがあれば、トークンをクッキーに保存する
    document.cookie = `token=${token.value}; path=/;`;
  }

  // token.valueがクッキーから取得された場合に、コンソールに表示
  console.log("トークン: ", token.value);  // クッキーから取得されたトークンが表示されるはず
});

// ログイン処理
const login = async () => {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value, password: password.value }),
    credentials: "include", // Cookieを送信するために必要
  });

  const data = await res.json();
  console.log(data);  // ここでレスポンスの内容を
  if (data.token) {
    // クッキーにトークンを保存（`Secure` と `HttpOnly` は開発環境では外してもよい）
    document.cookie = `token=${data.token}; path=/;`;
    token.value = data.token;
    location.reload();  // ログイン後にページをリロード
  } else {
    alert("ログイン失敗");
  }
};

  
  
// 新規登録フォームを表示
const showRegisterForm = () => {
  isRegistering.value = true; // 新規登録フォームを表示
};

// アカウント登録処理
const register = async () => {
  if (!email.value || !password.value) {
    alert("メールアドレスとパスワードを入力してください！");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      alert("登録が完了しました！");
      if (data.token) {
        document.cookie = `token=${data.token}; path=/;`;
        token.value = data.token;
      }
      isRegistering.value = false;
      location.reload();  // ログイン後にページをリロード
    } else {
      alert(data.error || "登録に失敗しました。");
    }
  } catch (error) {
    console.error("登録エラー:", error);
    alert("サーバーエラーが発生しました。");
  }
};

// ログアウト処理
const logout = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Cookie削除
  token.value = null;
  location.reload();
};

// 履歴表示
const viewHistory = () => {
  alert('履歴を表示');
};
</script>



<style scoped>
.login-dropdown-link,
.user-dropdown-link {
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
</style>
