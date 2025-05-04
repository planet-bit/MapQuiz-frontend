<template>
    <div>
        <a href="#" @click.prevent="isUserDropdownOpen = !isUserDropdownOpen" class="user-dropdown-link"> User ▼
        </a>
      <div v-if="isUserDropdownOpen" class="user-dropdown-menu">
        <router-link :to="'/records' ">Records</router-link>
        <a href="#" @click.prevent="$emit('signout')">Sign out</a>
      </div>
    </div>
</template>

<script setup>
  import { ref } from "vue";
  
  const emit = defineEmits(["signout"]); 

  const isUserDropdownOpen = ref(false);
</script>

<style scoped>
 .user-dropdown-link {
  color: rgb(0, 0, 0); 
    font-size: 1.1rem; 
    font-weight: bold;
    text-decoration: none; 
}

  .user-dropdown-menu {
  position: absolute;
  font-size: clamp(0.75rem, 0.75rem, 1rem);
  top: 50%;
  right: 20px;
  width: 6rem;
  height: 4rem;
  background: rgb(245, 245, 245);
  border: 1px solid #bebdbd;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  top: 40px;
  border-radius: 5px;
  }

  .user-dropdown-menu a {
  color: black; /* メニュー内リンクの文字色を黒に */
  padding-left: 20px;
  }

  .user-dropdown-menu a:hover {
  background-color: rgb(219, 219, 219); /* ホバー時にリンク色が緑に変わる */
  
}

@media (max-width: 600px) {
  .user-dropdown-link { 
    font-size: 0.9rem; 
  }

.user-dropdown-menu {
  top:30px
}
}


</style>
 