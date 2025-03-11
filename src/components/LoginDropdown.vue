<template>
  <div>
    <a v-if="!isLoggedIn" href="#" @click.prevent="toggleDropdown" class="login-link">Log in</a>

    <div v-else class="user-menu">
      <a href="#" @click.prevent="toggleDropdown">User ▼</a>
      <div v-if="isDropdownOpen" class="dropdown-menu">
        <a href="#" @click.prevent="viewHistory">履歴</a>
        <a href="#" @click.prevent="logout">Sign out</a>
      </div>
    </div>

    <!-- ログインフォーム（ドロップダウン表示） -->
    <div v-if="isDropdownOpen && !isLoggedIn" class="dropdown-menu">
      <div v-if="!isRegistering">
        <div>Log in to your account</div>
        <input type="text" v-model="username" placeholder="Username" />
        <input type="password" v-model="password" placeholder="Password" />
        <button @click="login">Login</button>
        <span>or <a href="#" @click.prevent="showRegisterForm" class="register-link">create your account</a></span>

      </div>

      <div v-else>
        <div>Create your account</div>
        <input type="text" v-model="username" placeholder="Username" />
        <input type="email" v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Password" />
        <div class="login-buttons">
          <button @click="register">Sign up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLoggedIn = ref(false);
const isDropdownOpen = ref(false);
const username = ref('');
const password = ref('');
const isRegistering = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  isRegistering.value = false;
};

const login = () => {
  if (username.value && password.value) {
    isLoggedIn.value = true;
    isDropdownOpen.value = false;
  }
};

const showRegisterForm = () => {
  isRegistering.value = true; // 新規登録フォームを表示
};

const logout = () => {
  isLoggedIn.value = false;
  username.value = '';
  password.value = '';
};

const viewHistory = () => {
  alert('履歴を表示');
};
</script>


<style scoped>
.login-link {
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
  height: 1500px;;
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
