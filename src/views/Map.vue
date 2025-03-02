<template>
  <div v-if="isViewingMap">

    <p class= "map-title">Map of {{ selectedCountry }} 
    <button @click="closeMap" class="map-close-btn">CLOSE</button>
    </p>
    <div id="map" class="map-container"></div>
  </div>
</template>
  
<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  selectedCountry: String,
  isViewingMap: Boolean
});
const emit = defineEmits(['close-map']);

const closeMap = () => {
  emit('close-map');
};

// 地図の中心とズーム
const center = ref([45, 75]); // 初期値はロシア
const zoom = ref(5); // ズームレベル
let map = null; // Leaflet の地図インスタンスを保持

// 選択された国が変更されたら座標を更新する
watch(() => props.selectedCountry, (newCountry) => {
  console.log("selectedCountry changed:", newCountry); // 選択された国を確認
  if (newCountry === "Russia") {
    center.value = [60, 60]; // ロシアの中心
    zoom.value = 5.5
  } else if (newCountry === "SouthKorea") {
    center.value = [36.5, 127.5]; // 韓国の中心
    zoom.value = 9
  } else if (newCountry === "Bangladesh") {
    center.value = [23.7, 90.4]; // バングラデシュの中心
    zoom.value = 8.5
  }
  if (map) {
    map.setView(center.value, zoom.value);
  }
});


const initializeMap = () => {
  nextTick(() => {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      if (map) {
        map.remove(); // **すでに地図がある場合は削除**
      }

      // **新しい地図を作成**
      map = L.map('map', {
        center: center.value,
        zoom: zoom.value,
        zoomDelta: 0.25, // ここで設定
        zoomSnap: 0,
        wheelPxPerZoomLevel: 150 // デフォルトは 60, 大きくするとズームが遅くなる
      });

      console.log("zoomDelta:", map.options.zoomDelta); // 設定が適用されているか確認

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 20
}).addTo(map);

      


    }
  });
};

// **マウント時に地図を作成**
onMounted(() => {
  initializeMap();
});

// **アンマウント時に Leaflet インスタンスを削除**
onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

// `isViewingMap` の変更を監視して、開いたときに再描画
watch(() => props.isViewingMap, (newVal) => {
  if (newVal) {
    initializeMap(); // **マップを再作成**
  }
});

</script>
 

<style>
  .map-title {
    position: relative;
    padding: 10rem;
    font-size: 6rem;
    font-weight: bold;
  }

  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out {
    width: 6rem !important ;
    height: 6rem !important ;
    font-size: 6rem !important ; /* 文字サイズを大きく */
    line-height: 6rem !important ; /* ボタン内の文字を中央に配置 */
  }

  .leaflet-container {
    font-size: 3rem ;
  }

  .map-container {
    width: 95%;
    height: 70vh;
  }

  .map-close-btn {
    margin-left: 5%;
    margin-bottom:5%;
    padding: 1rem 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    font-size: 5rem;
    box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  }
  .map-close-btn:hover {
    background-color: #0056b3;
  }
</style>
  