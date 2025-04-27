<template>

    <button @click="emit('click-action')" :class="{ active: isActive }">
      {{ text }}
    </button>
    
</template>
  
<script setup>

 const props = defineProps({
  text: String,
  isActive: Boolean
  });

  const emit = defineEmits(["click-action"]);

</script>
  
<style scoped>
  button {
    font-size: 1rem;
    font-weight: bold;
    background-color: #ffffff00;
    color: #000000;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin: 1rem;
  }

  button:hover {
    transform: scale(1.1);
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
  }

  @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
  }

  button.active {
    background-color: #3fd341;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
  }

  button.active:hover {
    transform: none;
    box-shadow: none;
  }
  
  </style>
  