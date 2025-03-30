<template>
    <div class="map-container">
      <div id="map"></div> <!-- 地図の表示エリア -->
      <p v-if="isAnswered">{{ feedbackMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import L from "leaflet"; // Leafletを使って地図を表示
  
  const props = defineProps({
    choices: Array,
    selectedChoice: String,
    correctAnswer: String,
    isAnswered: Boolean,
  });
  
  const map = ref(null);
  const feedbackMessage = ref('');
  
  // 地図を表示するための処理
  onMounted(() => {
    map.value = L.map("map").setView([51.505, -0.09], 2); // 初期位置とズームレベル
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map.value);
  
    // 地域データの取得
    fetch(`/api/regions/${props.selectedCountry.code}`)
      .then(response => response.json())
      .then(regions => {
        regions.forEach(region => {
          // geomデータに基づいて地域を地図に追加
          L.geoJSON(region.geom, {
            onEachFeature: (feature, layer) => {
              layer.on('click', () => {
                handleRegionClick(feature, region); // 地域クリック時の処理
              });
            }
          }).addTo(map.value);
        });
      })
      .catch(err => console.error("Error fetching regions:", err));
  });
  
  // 地域がクリックされたときの処理
  const handleRegionClick = (feature, region) => {
    if (props.isAnswered) return; // すでに回答済みなら処理しない
  
    const selected = region.local_name; // ユーザーが選択した地域
  
    if (selected === props.correctAnswer) {
      feedbackMessage.value = "Correct!";
      props.answerSelected(selected);
    } else {
      feedbackMessage.value = "Incorrect. Try again!";
    }
  };
  </script>
  
  <style scoped>
  #map {
    height: 400px; /* 地図の高さ */
  }
  </style>
  