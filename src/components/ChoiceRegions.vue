<template>
  <div v-if="gameStarted">
    <div id="map-answer" class="map-container"></div> <!-- 地図の表示エリア -->
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  selectedChoice: String, // 選択された地域名
  correctAnswer: String,  // 正解の地域名
  isAnswered: Boolean,
  selectedCountry: Object,
  gameStarted: Boolean
});
const emit = defineEmits(['answer-selected']);

const center = ref([60, 60]);
const zoom = ref(5);
let map = null;
let geoJsonLayer = null;
const selectedChoice = ref(null); // ユーザーがクリックした選択肢

// 国ごとの初期設定
const countryData = {
  ru: { center: [60, 80], zoom: 5.5, geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/russia.geojson' },
  kr: { center: [36.5, 127.5], zoom: 9, geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/korea.geojson' },
  bd: { center: [23.7, 90.4], zoom: 8.5, geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/bangladesh.geojson' }
};

// 地図の初期化
const initializeMap = () => {
  nextTick(() => {
    const mapElement = document.getElementById('map-answer');
    if (!mapElement) {
      console.error('地図の表示エリアが見つかりません');
      return;
    }

    if (map) {
      map.remove();
    }
    map = L.map('map-answer', {
      center: center.value,
      zoom: zoom.value,
      zoomDelta: 0.10,
      zoomSnap: 0,
      wheelPxPerZoomLevel: 200
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 10,
      minZoom: 5
    }).addTo(map);
  });
};

// GeoJSONデータを取得し、マップに描画する
const updateMapLayers = async (countryCode) => {
  try {
    if (geoJsonLayer) {
      map.removeLayer(geoJsonLayer);
    }

    const geoJsonResponse = await fetch(countryData[countryCode].geoJsonUrl);
    const geoJsonData = await geoJsonResponse.json();
    geoJsonLayer = L.geoJSON(geoJsonData, {
      style: () => ({
        fillColor: '#E0E5EC',
        weight: 2,
        opacity: 0.8,
        color: '#555',
        fillOpacity: 0.6
      }),
      onEachFeature: (feature, layer) => {
        let name = feature.properties.local_name || feature.properties.name || "不明";

        // クリックイベントを追加
        layer.on('click', () => {
          selectedChoice.value = name; // 選択された地名を保存

          // selectedChoiceが変更されたら、親コンポーネントに地名を通知
          emit('answer-selected', name);
        });

        // 地域のハイライト効果
        layer.on('mouseover', () => {
          layer.setStyle({ fillColor: '#AFEEEE', weight: 4, color: '#008B8B', fillOpacity: 0.85 });
        });

        layer.on('mouseout', () => {
          layer.setStyle({ fillColor: '#E0E5EC', weight: 2, color: '#555', fillOpacity: 0.6 });
        });
      }
    }).addTo(map);
  } catch (error) {
    console.error('Error updating map layers:', error);
  }
};

// 初回マウント時に地図を初期化し、選択された国の設定に基づいて地図を描画
onMounted(() => {
  if (props.selectedCountry.code) {
    const initialCountry = props.selectedCountry.code;
    center.value = countryData[initialCountry].center;
    zoom.value = countryData[initialCountry].zoom;
    initializeMap();
    updateMapLayers(initialCountry); // 初期設定の国のレイヤーを描画
  }
});

</script>


<style scoped>
.map-container {
    width: 90%;
    height: 2500px;
  }
  
</style>
