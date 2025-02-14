<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

import Canvas from './Cavas.vue'


const canvasRef = ref(null)
const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)

const handleGlobalClick = (event) => {
  const { target } = event
  if (canvasRef.value?.contains(event.target)) {
    selectedObject.value = null
  }
}

const handleClick = (event, object) => {
  if (!object) return

  if (object) {
    event.stopPropagation()
    selectedObject.value = object
    return
  }

  if (event.target.tagName === 'rect' || event.target.tagName === 'svg') {
    selectedObject.value = null
  }
}

const handleKeyDown = (event) => {
  if (!selectedObject.value) return

  if (event.key === 'Backspace') {
    objectStore.removeObject(selectedObject.value.id)
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div
    ref="canvasRef"
    class="relative flex items-center justify-center w-full h-full overflow-hidden"
  >
    <Canvas :width="720" :height="452" />
  </div>
</template>

<style scoped>
.svg-canvas {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;

  background: #fff;
  overflow: visible;
}

circle {
  cursor: move;
  user-select: none;
}

circle:hover {
  filter: brightness(0.95);
}

.handle {
  cursor: pointer;
  user-select: none;
}

.handle:hover {
  fill: #e6f3ff;
}
</style>
