<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  zoom: {
    type: Number,
    required: true
  },
  minZoom: {
    type: Number,
    default: 0.5
  },
  maxZoom: {
    type: Number,
    default: 2
  },
  updateZoom: {
    type: Function,
    required: true
  }
})



const zoomStep = 0.1 // 10% step

const zoomIn = () => {
  const newZoom = Math.min(props.zoom + zoomStep, props.maxZoom)
  props.updateZoom(newZoom)
}

const zoomOut = () => {
  const newZoom = Math.max(props.zoom - zoomStep, props.minZoom)
  props.updateZoom(newZoom)
}
</script>

<template>
  <div class="absolute z-50 flex items-center gap-2 top-2 right-2 bg-[#333333] shadow-md p-1 rounded-md">
    <button 
      @click="zoomOut"
      class="w-6 h-6 flex items-center justify-center text-[#CCCCCC] bg-[#444444] rounded hover:bg-[#555555] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      :disabled="zoom <= minZoom"
    >
      -
    </button>
    
    <p class="w-[50px] text-[#CCCCCC] text-xs px-2">
      {{ Math.round(zoom * 100) }}%
    </p>
    
    <button 
      @click="zoomIn"
      class="w-6 h-6 flex items-center justify-center text-[#CCCCCC] bg-[#444444] rounded hover:bg-[#555555] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      :disabled="zoom >= maxZoom"
    >
      +
    </button>
  </div>
</template>

