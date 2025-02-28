<template>
  <div class="buttons-container">
    <button @click="LocationGame" 
      :class="{ active: gameType === 'start' }">Location</button>
    <button @click="LettersGame" 
      :class="{ active: gameType === 'letters' }">Letters</button>
    <button @click="LearnLanguage" 
      :class="{ active: isLearning }">Learn</button>
    <button @click="ViewMap" 
      :class="{ active: isViewingMap }">Map</button>
  </div>
</template>

<script setup>

const props = defineProps({
  gameType: String,
  isLearning: Boolean,
  isViewingMap: Boolean
});

const emit = defineEmits([
  "location-game", 
  "letters-game", 
  "learn-language",
  "view-map"
]);

const LocationGame = () => {
  emit("location-game");
};

const LettersGame = () => {
  emit("letters-game");
};

const LearnLanguage = () => {
  emit("learn-language");
};

const ViewMap = () => {
  emit("view-map");
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