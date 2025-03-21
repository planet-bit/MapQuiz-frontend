<template>
    <button
      :class="{ active: modelValue === value }"
      @click="handleClick"
    >
      {{ label }}
    </button>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    label: String,  // ボタンの表示テキスト
    value: String,  // 選択値
    modelValue: String  // v-model でバインドされる値
  });
  
  const emit = defineEmits(["update:modelValue"]);
  
  const handleClick = () => {
    emit("update:modelValue", props.value); // クリック時に選択状態を更新
  };
  </script>
  
  <style scoped>
  button {
    font-size: 4.5rem;
    font-weight: bold;
    background-color: #ffffff00;
    color: #000000;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    margin: 5rem;
  }
  
  button:hover {
    transform: scale(1.1);
    box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.3);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  button.active {
    background-color: #4CAF50;
    color: rgb(0, 0, 0);
    box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.3);
  }
  
  button.active:hover {
    transform: none;
    box-shadow: none;
  }
  </style>
  