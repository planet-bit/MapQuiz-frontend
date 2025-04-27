<template>
  <div v-if="gameStarted">
    <div id="map-answer" class="map-container"></div> <!-- 地図の表示エリア -->
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import L from "leaflet";

  const props = defineProps({
    selectedChoice: String, // 選択された地域名
    correctAnswer: String,  // 正解の地域名（英語）
    isAnswered: Boolean, //解答済みか管理
    selectedCountry: Object, //選択中の国（name,code）
    gameStarted: Boolean //ゲーム開始の管理
  });
  const emit = defineEmits(['answer-selected']); //解答地域を英語名で送信

  const center = ref([60, 60]);
  const zoom = ref(5);
  const selectedChoice = ref(null);
  let map = null;
  let geoJsonLayer = null;
  
  // 国ごとの初期設定
  const countryData = {
    ru: {
      center: [65, 100],
      zoom: 2.9,
      geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/russia.geojson',
      regionProperty: 'name_latin'
    },
    kr: {
      center: [36, 127.5],
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
    }).addTo(map);
  };

  // GeoJSONデータを取得し、マップに描画する
  const updateMapLayers = async (countryCode) => {
    try {
      const { geoJsonUrl, regionProperty } = countryData[countryCode];
      const geoJsonResponse = await fetch(geoJsonUrl);
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
          const name = feature.properties[regionProperty] || "不明";
          let correctLayer = null;

          layer.on('click', () => {
            if (selectedChoice.value) return;
            selectedChoice.value = name;
            emit('answer-selected', name);

            if (name === props.correctAnswer) {
              layer.setStyle({
                fillColor: "lightgreen",
                weight: 4,
                color: '#008B8B',
                fillOpacity: 0.85
              });
            } else {
              layer.setStyle({
                fillColor: "lightcoral",
                weight: 4,
                color: '#8B0000',
                fillOpacity: 0.85
              });

              geoJsonLayer.eachLayer((l) => {
                if (l.feature.properties[regionProperty] === props.correctAnswer) {
                  correctLayer = l;
                  l.setStyle({
                    fillColor: "lightgreen",
                    weight: 4,
                    color: '#008B8B',
                    fillOpacity: 0.85
                  });
                }
              });
            }
            geoJsonLayer.eachLayer((l) => l.off('click'));
          });

          layer.on('mouseover', () => {
            if (!selectedChoice.value) {
              layer.setStyle({ fillColor: '#AFEEEE', weight: 4, color: '#008B8B', fillOpacity: 0.85 });
            }
          });

          layer.on('mouseout', () => {
            if (!selectedChoice.value) {
              layer.setStyle({ fillColor: '#E0E5EC', weight: 2, color: '#555', fillOpacity: 0.6 });
            }
          });
        }
      }).addTo(map);
    } catch (error) {
      console.error('Error updating map layers:', error);
    }
  };


  watch(
    () => props.selectedChoice,
    (newValue) => {
      if (newValue === "TIME_UP" && geoJsonLayer) {
        const regionProperty = countryData[props.selectedCountry.code]?.regionProperty;
        geoJsonLayer.eachLayer((layer) => {
          layer.off("click");
          const layerName = layer.feature.properties[regionProperty]?.toLowerCase().trim();
          const correctName = props.correctAnswer.toLowerCase().trim();

          if (layerName === correctName) {
            layer.setStyle({
              fillColor: "lightgreen",
              weight: 4,
              color: "#008B8B",
              fillOpacity: 0.85,
            });
            layer.off("mouseover");
            layer.off("mouseout");
          }
        });
      }
    }
  );


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
    width: 90vw;
    max-width: 1000px;
    height: 60vh;
    max-height:600px
  }
</style>