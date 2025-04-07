<template>
  <div v-if="isViewingStudyMap&&!challengeMode">
    <h1 class="map-title">
      Map of {{ selectedCountry.name }}
      <CloseButtons class="map-close-button" @click="$emit('close-map')" />
    </h1> 

    <!-- 準備中メッセージ -->
    <div v-if="selectedCountry.code === 'bd'" class="map-message">
      Preparing...
    </div>

    <!-- 地図表示 -->
    <div v-else id="map-study" class="map-container">
      <button class="change-language-button" @click="toggleLanguage">Change Language</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import CloseButtons from '@/components/CloseButtons.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  challengeMode: Boolean,
  selectedCountry: Object,
  isViewingStudyMap: Boolean
});
const emit = defineEmits(['close-map']);

const isEnglish = ref(false);

const center = ref(); // 初期値: ロシア
const zoom = ref(5);
let map = null;
let geoJsonLayer = null;

// 言語を切り替える関数
const toggleLanguage = () => {
  isEnglish.value = !isEnglish.value;
  updateMapLayers(props.selectedCountry.code); // 言語切り替え後、地図のラベルを更新
};

const countryData = {
  ru: { center: [60, 60], zoom: 5.5, geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/russia.geojson' },
  kr: { center: [36, 127.5], zoom: 9, geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/korea.geojson' },
  bd: { center: [23.7, 90.4], zoom: 8.5, geoJsonUrl: '' }
};

watch(() => props.selectedCountry.code, (newCountry) => {
 
  isEnglish.value = false;

  if (newCountry === "ru") {
    initializeMap();
    center.value = [60, 80]; // ロシアの中心
    zoom.value = 5.5;
  } else if (newCountry === "kr") {
    initializeMap();
    center.value = [36, 127.5]; // 韓国の中心
    zoom.value = 9;
  } else if (newCountry === "bd") {
    initializeMap();
    center.value = [23.7, 90.4]; // バングラデシュの中心
    zoom.value = 8.5;
  }

  if (map) {
    // 地図の中心とズームを更新
    map.setView(center.value, zoom.value);
    updateMapLayers(newCountry);
  }
});

const initializeMap = () => {

  if (props.selectedCountry.code === 'bd') return; // バングラデシュなら何もしない

  nextTick(() => {
    const mapElement = document.getElementById('map-study');
    if (!mapElement) return;

    if (map) {
      map.remove();
    }

    map = L.map('map-study', {
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

    updateMapLayers(props.selectedCountry.code);
  });
};

const updateMapLayers = async (countryCode) => {
  try {
    // geoJsonLayer がすでに存在する場合は削除
    if (geoJsonLayer) {
      map.removeLayer(geoJsonLayer);
    }
    if (map._layers) {
      Object.keys(map._layers).forEach((layerId) => {
        const layer = map._layers[layerId];
        if (layer instanceof L.Marker && layer.options.icon instanceof L.DivIcon) {
          map.removeLayer(layer);
        }
      });
    }

    // GeoJSON データの取得
    const geoJsonResponse = await fetch(countryData[countryCode].geoJsonUrl);
    const geoJsonData = await geoJsonResponse.json();

    // GeoJSON レイヤーの作成
    geoJsonLayer = L.geoJSON(geoJsonData, {
      style: () => ({
        fillColor: '#E0E5EC',
        weight: 2,
        opacity: 0.8,
        color: '#555',
        fillOpacity: 0.6
      }),
      onEachFeature: (feature, layer) => {
        let name = '';

        if (feature.properties) {
          if (isEnglish.value) {
            if (countryCode === 'kr' && feature.properties && feature.properties.name) {
            name = feature.properties.name; 
          } else if (countryCode === 'ru' && feature.properties && feature.properties.name_latin) {
            name = feature.properties.name_latin; 
          }
        }else {
          if (countryCode === 'kr' && feature.properties && feature.properties.CTP_KOR_NM) {
            name = feature.properties.CTP_KOR_NM; 
          } else if (countryCode === 'ru' && feature.properties && feature.properties.name) {
            name = feature.properties.name; 
          }
        }

      }


        

        // 名前が存在する場合、ラベルを作成
        if (name) {
          const label = L.divIcon({
            className: 'custom-label',
            html: `<div class="label">${name}</div>`
          });

          const marker = L.marker(layer.getBounds().getCenter(), { icon: label }).addTo(map);

          // ハイライト用のスタイル
          const highlightStyle = {
            fillColor: '#AFEEEE',
            weight: 4,
            color: '#008B8B',
            fillOpacity: 0.85
          };

          const resetStyle = {
            fillColor: '#E0E5EC',
            weight: 2,
            color: '#555',
            fillOpacity: 0.6
          };

          // 地域とラベルのホバーイベント
          layer.on('mouseover', () => {
            layer.setStyle(highlightStyle);
            marker._icon.style.color = '#FF1493';
          });

          marker.on('mouseover', () => {
            layer.setStyle(highlightStyle);
            marker._icon.style.color = '#FF1493';
          });

          layer.on('mouseout', () => {
            layer.setStyle(resetStyle);
            marker._icon.style.color = '';
          });

          marker.on('mouseout', () => {
            layer.setStyle(resetStyle);
            marker._icon.style.color = '';
          });
        }
      }
    }).addTo(map);
  } catch (error) {
    console.error('Error updating map layers:', error);
  }
};



onMounted(() => {
  initializeMap();
});

watch(() => props.isViewingStudyMap, (newVal) => {
  if (newVal) {
    initializeMap();
  }
});
</script>



<style>
  .map-title {
    padding: 10rem;
    font-size: 6rem;
    font-weight: bold;
    display: flex;
  }
  .change-language-button {
    z-index: 1000;
    position: fixed; /* 画面上で固定 */
    font-size: 5rem; 
    padding: 30px; 
    background-color: #859786; 
    color: white; 
    border: none; 
    border-radius: 50px; 
    cursor: pointer; 
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.2); 
    transition: background-color 0.3s, transform 0.2s; 
  }

  .change-language-button:hover {
    background-color: #45a049;
  }

  .change-language-button:active {
    transform: translateY(0); /* クリック時に元に戻る */
  }
  .leaflet-container {
    font-size: 2rem ;
  }

  .map-container {
    width: 95%;
    height: 70vh;
    z-index: 0;
  }

  .map-close-button {
    margin-left: 150px;
  }
  .label {
    font-size: 3.5rem
  }
  
  .map-message {
    font-size: 5rem
  }
</style>
  