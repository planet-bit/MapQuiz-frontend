// src/event-bus.js
import { reactive } from 'vue';

const EventBus = reactive({
  events: [],
  emit(event, data) {
    this.events.push({ event, data });
  },
  on(event, callback) {
    this.events.forEach(e => {
      if (e.event === event) {
        callback(e.data);
      }
    });
  },
});

export default EventBus;
