<template>
  <div class="map-overlay" v-if="gameType === 'isMapViewing'&& isGameStarted">
    <h1 class="map-title">
      Map of {{ selectedCountry.name }}
      <CloseButtons class="map-close-button" @click="$emit('game-reset')" />
    </h1> 
    <!-- 地図表示 -->
    <div  id="map-study" class="map-container">
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
  selectedCountry: Object,
  isGameStarted: Boolean,
  gameType: String,
});
const emit = defineEmits(['game-reset']);

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

  // 国ごとの初期設定（regionPropertyを追加）
// 国ごとの初期設定（regionPropertyを追加）
const countryData = {
  ru: {
    center: [60, 100],
    zoom: 4,
    geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/russia.geojson',
    regionProperty: 'name_latin'
  },
  kr: {
    center: [35.5, 127.5],
    zoom: 7,
    geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/korea.geojson',
    regionProperty: 'name'
  },
  bd: {
    center: [23.7, 90.4],
    zoom: 8.5,
    geoJsonUrl: '', // 後で追加
    regionProperty: 'name'
  }
};

// 地図の初期化
const initializeMap = () => {
  const selectedCountryCode = props.selectedCountry.code;

  // バングラデシュの場合はgeoJsonUrlが後で追加されるまで地図を初期化しない
  if (selectedCountryCode === 'bd') return;

  nextTick(() => {
    const mapElement = document.getElementById('map-study');
    if (!mapElement) return;

    // 既存のマップがあれば削除
    if (map) {
      map.remove();
    }

    // countryData から設定を取得
    const countryConfig = countryData[selectedCountryCode];
    if (!countryConfig) return;

    // 地図を初期化
    map = L.map('map-study', {
      center: countryConfig.center,
      zoom: countryConfig.zoom,
      zoomDelta: 0.10,
      zoomSnap: 0,
      wheelPxPerZoomLevel: 200
    });

    // タイルレイヤーの追加
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 20,
      minZoom: 1
    }).addTo(map);

    // 地図レイヤーの更新
    updateMapLayers(selectedCountryCode);
  });
};

// countryData に基づいて地図の設定を変更
watch(() => props.selectedCountry.code, (newCountry) => {
  isEnglish.value = false;

  // 地図の初期化
  initializeMap();

  // 新しい国の設定に基づいて地図の中心とズームを更新
  const countryConfig = countryData[newCountry];
  if (countryConfig && map) {
    center.value = countryConfig.center;
    zoom.value = countryConfig.zoom;

    // 地図の中心とズームを更新
    map.setView(center.value, zoom.value);
    updateMapLayers(newCountry);
  }
});

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
    const regionProp = countryData[countryCode].regionProperty;
    name = feature.properties[regionProp] || '';
  } else {
    // 各国のデフォルト表記（韓国語・ロシア語など）
    if (countryCode === 'kr') {
      name = feature.properties.CTP_KOR_NM || '';
    } else if (countryCode === 'ru') {
      name = feature.properties.name || '';
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

watch(() => props.isGameStarted, (newVal) => {
  if (newVal) {
    initializeMap();
  }
});
</script>

<style>

.map-overlay {
  position: absolute; /* 画面全体に重ねる */
  width: 100%;
  height: 100vh;
  background-color: rgba(26, 26, 26, 0.699); /* 灰色で半透明 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 他より前面に出す */
}
  .map-title {
    padding: 1rem;
    width: 95%;
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    background-color: rgb(255, 255, 255);
  }
  .change-language-button {
    z-index: 1000;
    position: fixed; /* 画面上で固定 */
    font-size: 1rem; 
    padding: 0.5rem; 
    background-color: #859786; 
    color: white; 
    border: none; 
    border-radius: 15px; 
    cursor: pointer; 
    transition: background-color 0.3s, transform 0.2s; 
  }

  .change-language-button:hover {
    background-color: #45a049;
  }

  .change-language-button:active {
    transform: translateY(0); /* クリック時に元に戻る */
  }
  .leaflet-container {
    font-size: 0.5rem ;
  }

  .map-container {
    width: 95%;
    height: 80vh;
    z-index: 0;
  }

  .map-close-button {
    margin-left: 50px;
  }
  .label {
    font-size: 1rem
  }
  
  .map-message {
    font-size: 1rem
  }
</style>
  