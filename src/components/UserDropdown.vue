<template>
    <div class="user-menu">
        <a href="#" @click.prevent="isUserDropdownOpen = !isUserDropdownOpen" class="user-dropdown-link"> User ▼
        </a>
      <div v-if="isUserDropdownOpen" class="user-dropdown-menu">
        <router-link :to="'/records/' + userId">Records</router-link>
        <a href="#" @click.prevent="$emit('signout')">Sign out</a>
      </div>
    </div>
</template>

<script setup>
  import { ref } from "vue";

  const props = defineProps({
    userId: Number,
  });
  
  const emit = defineEmits(["signout"]); 

  const isUserDropdownOpen = ref(false);
</script>

<style scoped>
 .user-dropdown-link {
  color: rgb(0, 0, 0); 
  font-size: 6rem; 
  font-weight: bold;
  text-decoration: none; 
}

  .user-dropdown-menu {
  position: absolute;
  font-size: 4rem;
  top: 100%;
  right: 50px;
  width: 30rem;
  height: 1000px;;
  background: rgb(245, 245, 245);
  border: 2px solid #bebdbd;
  box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.2);
  padding: 0px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  top: 195px;
  border-radius: 15px;
  }

  .user-dropdown-menu a {
  color: black; /* メニュー内リンクの文字色を黒に */
  padding-left: 30px;
  }

  .user-dropdown-menu a:hover {
  background-color: rgb(219, 219, 219); /* ホバー時にリンク色が緑に変わる */
  
}


</style>
 