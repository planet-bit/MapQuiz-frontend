<template>
  <button @click="emit('click-action')">
    {{ text }}
  </button>
</template>

<script setup>

  const props = defineProps({
    text: String
  });

  const emit = defineEmits(["click-action"]);
  
</script>

<style scoped>
  button {
    padding: 1.5rem 3rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3rem;
    cursor: pointer;
    font-size: 5rem;
    box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056b3;
  }

  @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  </style>
  