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
    font-size: 1rem;
    font-weight: bold;
    background-color: #acacac;
    color: #000000;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    padding: 8px;
    margin: 10px;
    width: 8rem;
  }
  
  button:hover {
    background-color:  #69c06b;
    transform: scale(1.1);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  button.active {
    background-color:  #64e466;
    color: rgb(0, 0, 0);
  }
  
  button.active:hover {
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    button {
      font-size: 0.75rem;
      padding: 3px 7px;
      width: 7rem;
    }
  }
  </style>
  