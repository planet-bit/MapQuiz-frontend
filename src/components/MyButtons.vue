<template>
    <button @click="$emit('click-action')" :class="{ active: isActive }">
      {{ text }}
    </button>
  </template>
  
  <script>
  export default {
    props: {
      text: String,
      isActive: Boolean
    }
  };
  </script>
  
  
  <style scoped>
  button {
    font-size: 5rem;
    font-weight: bold;
    background-color: #ffffff00;
    color: #000000;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  button:hover {
    transform: scale(1.1);
    box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.2);
  }

  @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
  }

  button.active {
    background-color: #4CAF50;
  }

  button.active:hover {
    transform: none;
    box-shadow: none;
  }
  
  </style>
  