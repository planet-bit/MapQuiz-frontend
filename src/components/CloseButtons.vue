<template>
    <button type="button" @click="emit('click-action')">×</button>
</template>
  
<script setup>
  
  const props = defineProps({
    text: String,
  });
  
  const emit = defineEmits(["click-action"]);

</script>
  
<style scoped>

  button {
    background-color: #ffffff;
    color: rgb(128, 128, 128);
   border: none;
    border-radius: 50%; 
    cursor: pointer;
    font-size: 2rem!important; 
    width: 2rem !important; 
    height: 2rem !important;
    transition: background-color 0.5s;
    display: flex; /* テキストを中央に配置する */
    justify-content: center;
    align-items: center;
  }

  button:hover {
    background-color: #daf8da;
  }
  
  @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
  }

</style>