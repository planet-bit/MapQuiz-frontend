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
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056b3;
  }

  @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
  }

  @media (max-width: 600px) {
    button {
      font-size: 0.75rem;
      padding: 3px 7px;
    }
  }
  </style>
  