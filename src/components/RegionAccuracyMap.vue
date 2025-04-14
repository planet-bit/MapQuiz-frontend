<template>
  <div class="map-wrapper">
  <!-- v-showを使ってmap-recordを常に表示しておく -->
  <div v-if="visible" id="map-record"></div>
  </div>
</template>
<script setup>
import { onMounted, watch, nextTick, ref, toRefs } from 'vue';

const props = defineProps({
  countryCode: String,
  game_type: String,
  accuracyData: Array, 
  visible: Boolean
});

let map = null;
let geoJsonLayer = null;
const center = ref([0, 0]);
const zoom = ref(5.5);

const countryData = {
  ru: {
    center: [65, 100],
    zoom: 4.5,
    geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/russia.geojson',
    regionProperty: 'name_latin'
  },
  kr: {
    center: [36, 127.5],
    zoom: 8.7,
    geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/korea.geojson',
    regionProperty: 'name'
  },
  bd: {
    center: [23.7, 90.4],
    zoom: 8.5,
    geoJsonUrl: '',
    regionProperty: 'name'
  }
};


// 地図初期化
const initializeMap = () => {
  nextTick(() => {
    const mapElement = document.getElementById('map-record');
    if (!mapElement) return;

    // center/zoom を明示的に更新
    if (props.countryCode && countryData[props.countryCode]) {
      const { center: initCenter, zoom: initZoom } = countryData[props.countryCode];
      center.value = initCenter;
      zoom.value = initZoom;
    }

    // map 初期化
    if (map) {
      map.remove();
    }

    map = L.map('map-record', {
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

    updateMapLayers(props.countryCode);
  });
};

const reactiveProps = toRefs(props);

// `visible` の変化を監視して地図を表示
watch(reactiveProps.visible, (newVisible) => {
  console.log('visible changed:', newVisible); // ✅これで動く可能性高い！
  if (newVisible) {
    initializeMap();
  }
});


watch(() => props.accuracyData, (newData) => {
  console.log('accuracyData updated');

  if (!props.countryCode || !countryData[props.countryCode]) return;

  const { center: newCenter, zoom: newZoom } = countryData[props.countryCode];

  center.value = newCenter;
  zoom.value = newZoom;

  if (map) {
    map.setView(center.value, zoom.value);
    updateMapLayers(props.countryCode);
  }
});


// 地図レイヤーの更新処理
const updateMapLayers = async (countryCode) => {
  const countryInfo = countryData[countryCode];
  if (!countryInfo?.geoJsonUrl) return;

  // ✅ 古いレイヤーやゴミレイヤーを削除
  map.eachLayer((layer) => {
    if (!(layer instanceof L.TileLayer)) {
      map.removeLayer(layer);
    }
  });

  if (geoJsonLayer) {
    geoJsonLayer.clearLayers();
    map.removeLayer(geoJsonLayer);
    geoJsonLayer = null;
  }

  console.log('GeoJSONを読み込み中...');

  try {
    const response = await fetch(countryInfo.geoJsonUrl);
    if (!response.ok) {
      console.error('GeoJSONの読み込みに失敗しました');
      return;
    }

    const geoJsonData = await response.json();
    console.log('GeoJSONデータ:', geoJsonData);

    if (props.accuracyData.length === 0) {
      console.warn('正答率データが存在しません。地図を表示しません。');
      return;
    }

    const regionProperty = countryInfo.regionProperty || 'name';

    geoJsonLayer = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const regionKey = feature.properties[regionProperty];
        const regionData = props.accuracyData.find(r => r.region_name === regionKey);
        const accuracy = regionData ? parseFloat(regionData.accuracy_percentage) : null;

        let fillColor = '#ccc';
        if (accuracy !== null) {
          if (accuracy >= 80) fillColor = '#2ecc71';
          else if (accuracy >= 50) fillColor = '#f1c40f';
          else fillColor = '#e74c3c';
        }

        return { fillColor, weight: 1, opacity: 1, color: '#999', fillOpacity: 0.7 };
      },
      onEachFeature: (feature, layer) => {
        const regionKey = feature.properties[regionProperty];
        const entry = props.accuracyData.find(r => r.region_name === regionKey);
        const tooltip = entry
          ? `${regionKey}: ${entry.accuracy_percentage}% (${entry.correct_answers}/${entry.total_answers})`
          : `${regionKey}: No data`;

        layer.bindTooltip(tooltip, { sticky: true });
      }
    }).addTo(map);
  } catch (error) {
    console.error('GeoJSONの読み込みエラー:', error);
  }
};

onMounted(() => {
  if (props.visible) {
    console.log('visible was true on mount');
    initializeMap();
  }
});
</script>

<style scoped>
.map-wrapper {
  height: 60vh; /* または vh, %, remなど */
  width: 50vw;
}

#map-record {
  width: 4000px;
  height: 2000px; /* ビューポートの80%にする */
}

</style>



