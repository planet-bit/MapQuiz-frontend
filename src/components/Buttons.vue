<template>
  <div class="buttons-container">
    <button @click="LocationGame" 
      :class="{ active: selectedGameType === 'start' }">Location</button>
    <button @click="LettersGame" 
      :class="{ active: selectedGameType === 'letters' }">Letters</button>
    <button @click="LearnLanguage" 
      :class="{ active: selectedLearn === 'learn' }">Learn</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  selectedLearn: String,
  selectedGameType: String,
});

const emit = defineEmits(["location-game", "letters-game", "learn-language"]);

const LocationGame = () => {
  emit("location-game");
};

const LettersGame = () => {
  emit("letters-game");
};

const LearnLanguage = () => {
  emit("learn-language");
};
</script>

<style scoped>
  .buttons-container {
    display: flex;
    justify-content: center;
    gap: 20%;
  }

  button {
    font-size: 6rem;
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