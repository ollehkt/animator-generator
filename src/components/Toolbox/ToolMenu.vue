<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 }),
  },
  close: {
    type: Function,
    default: () => {},
  },
  handleClick: {
    type: Function,
    default: () => {},
  },
})

const mediaTypes = [
  {
    type: 'audio',
    label: '오디오',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
    </svg>`,
  },
  {
    type: 'video',
    label: '비디오',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
    </svg>`,
  },
]

const handleMouseLeave = () => {
  props.close()
}


</script>

<template>
  <div
    v-if="show"
    class="tooltype-container absolute bg-[#333]/90 backdrop-blur-sm border border-gray-700 rounded-lg p-2 bottom-16 w-[120px] -translate-x-1/2 before:content-[''] before:absolute before:bottom-[-8px] before:left-1/2 before:transform before:-translate-x-1/2 before:border-l-[8px] before:border-l-transparent before:border-r-[8px] before:border-r-transparent before:border-t-[8px] before:border-t-gray-700"
    :style="{
      left: `${position.x}px`,
    }"
    @mouseleave="handleMouseLeave"
  >
    <button
      @click="handleClick(type.type)"
      v-for="type in mediaTypes"
      :key="type.type"
      class="flex items-center w-full gap-2 px-4 py-2 text-xs text-left text-[#ccc] rounded hover:bg-gray-600 hover:text-white"
    >
      <span v-html="type.icon"></span>
      {{ type.label }}
    </button>
  </div>
</template>
