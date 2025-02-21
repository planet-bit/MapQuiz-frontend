<template>
  <div class="title-bar">
    <div class="left-container">
      <div class="title" @click="reloadPage">GeoLingo</div> 

      <div class="dropdown">
        <select v-model="selectedCountry" @change="selectCountry">
          <option value="" disabled hidden>Country</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
      </div>

      <div v-if="selectedCountry" class="buttons-container">
        <Buttons
          :selectedLearn="selectedLearn"
          :selectedGameType="selectedGameType"
          @location-game="MiddleLocationGame"
          @letters-game="MiddleLettersGame"
          @learn-language="MiddleLearnLanguage"
        />
      </div>
    </div>

    <div class="login-link">
      <a href="/login">Login</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Buttons from "./Buttons.vue";

const emit = defineEmits(["country-selected", "location-game", "letters-game", "learn-language"]);

const props = defineProps({
  selectedLearn: String,
  selectedGameType: String,
});

const countries = ["Russia", "SouthKorea", "Bangladesh"];
const selectedCountry = ref("");
const selectedGameType = ref("");

const reloadPage = () => {
  location.reload();
};

const selectCountry = () => {
  emit("country-selected", selectedCountry.value);
};

const MiddleLocationGame = () => {
  selectedGameType.value = "start";
  emit("location-game");
};

const MiddleLettersGame = () => {
  selectedGameType.value = "letters";
  emit("letters-game");
};

const MiddleLearnLanguage = () => {
  emit("learn-language");
};
</script>

<style scoped>
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #68d47a;
  color: #000000; 
  width: 100%; 
  height: 15rem; 
  padding: 0 10rem;
}

.left-container {
  display: flex;
  align-items: center;
  gap: 10rem;
}

.title {
  font-size: 9rem;
  font-weight: bold;
  text-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.dropdown select {
  font-size: 6rem;
  font-weight: bold;
  padding: 1rem;
  background: none;
  border: none;
  border-bottom: 6px solid #000000;
  color: #000000;
  cursor: pointer;
}

.dropdown select:focus {
  outline: none;
  border-bottom: 5px solid #000000;
}

.buttons-container {
  display: flex;
  gap: 10rem;
}

.login-link {
  margin-left: auto;
}

.login-link a {
  color: #000000; 
  text-decoration: none;
  font-size: 6rem;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>