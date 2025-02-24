<template>
    <div v-if="challengeMode">
      Time Left: {{ timeLeft }}s
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onUnmounted } from "vue";
  
  const props = defineProps({
    challengeMode: Boolean,
    startTimer: Boolean, 
  });
  
  const emit = defineEmits("time-up");
  
  const timeLeft = ref(10);
  let timer = null;
  
  // タイマー開始関数
  const beginTimer = () => {
    timeLeft.value = 10;
    timer = setInterval(() => {
      timeLeft.value--;
      if (timeLeft.value <= 0) {
        clearInterval(timer);
        timer = null;
        emit("time-up"); // 時間切れ通知
      }
    }, 1000);
  };
  
  // タイマーの監視
  watch(() => props.startTimer, (newVal) => {
    if (newVal) beginTimer();
    else if (timer){
      clearInterval(timer);
      timer = null;
    }    
  });
  
  // コンポーネント破棄時にタイマーを停止
  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });
  </script>
  