<template>
  <div class="record-card" @click="handleClick">
    <h3 class="card-header"><strong>{{ record.game_type }}</strong></h3>
    <p><strong>Max Streak:</strong> {{ record.max_streak }}</p>
    <p>
      <strong>Average:</strong> 
      {{ (record.total_attempts ? (record.total_correct_answers / record.total_attempts).toFixed(2) : 0) }}
    </p>
  </div>
</template>
    
<script setup>
const emit = defineEmits(['select']); // select イベントを定義

const props = defineProps({
  record: Object
});

// クリック時にイベントを親に送信
const handleClick = () => {
  emit('select', props.record);  // 親にレコードを送信
};
</script>

  <style scoped>
  .record-card {
    cursor: pointer;
  }
  </style>
  