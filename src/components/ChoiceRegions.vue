<template>
  <div v-if="gameStarted">
    <div id="map-answer" class="map-container"></div> <!-- 地図の表示エリア -->
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from "vue";
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
    ru: { center: [60, 80], zoom: 5.5, geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/russia.geojson' },
    kr: { center: [36, 127.5], zoom: 9, geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/korea.geojson' },
    bd: { center: [23.7, 90.4], zoom: 8.5, geoJsonUrl: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/bangladesh.geojson' }
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
      minZoom: 5
    }).addTo(map);
  };

  // GeoJSONデータを取得し、マップに描画する
  const updateMapLayers = async (countryCode) => {
    try {
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
          let name = feature.properties.name_latin || feature.properties.name || "不明";
          let correctLayer = null;
          // クリックイベントを追加
          layer.on('click', () => {
            if (selectedChoice.value) return; // すでに選択済みなら無視
            selectedChoice.value = name; // 選択された地名を保存
            emit('answer-selected', name); // selectedChoiceが変更されたら、親コンポーネントに地名を通知
            // 正解か不正解をチェックして色を変える
            if (name === props.correctAnswer) {
              // 正解の場合、緑色に変更
              layer.setStyle({
                fillColor: "lightgreen",
                weight: 4,
                color: '#008B8B',
                fillOpacity: 0.85
              });
            } else {
              // 不正解の場合、赤色に変更
                layer.setStyle({
                  fillColor: "lightcoral",
                  weight: 4,
                  color: '#8B0000',
                 fillOpacity: 0.85
                });
              geoJsonLayer.eachLayer((l) => {
                if (l.feature.properties.name_latin === props.correctAnswer || 
                l.feature.properties.name === props.correctAnswer) {
                  correctLayer = l; // 正解のエリアを記録
                  l.setStyle({
                    fillColor: "lightgreen",
                    weight: 4,
                    color: '#008B8B',
                    fillOpacity: 0.85
                  });
                }
              });
            }
            // すべてのレイヤーのクリックイベントを削除（＝全体で一回のみ回答可能にする）
            geoJsonLayer.eachLayer((l) => l.off('click'));
          });

          // 地域のハイライト効果
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
