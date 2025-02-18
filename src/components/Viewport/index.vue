<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

import Canvas from './Cavas.vue'
import ZoomControls from './ZoomControls.vue'

const canvasRef = ref(null)
const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)

// Add zoom state and controls
const zoom = ref(1)
const MIN_ZOOM = 0.5 //50%
const MAX_ZOOM = 2 //200%

const handleGlobalClick = (event) => {
  const { target } = event
  if (canvasRef.value?.contains(target)) {
    selectedObject.value = null
  }
}

// const handleClick = (event, object) => {
//   console.log
//   if (!object) return

//   if (object) {
//     event.stopPropagation()
//     selectedObject.value = object
//     return
//   }

//   if (event.target.tagName === 'rect' || event.target.tagName === 'svg') {
//     selectedObject.value = null
//   }
// }

const handleKeyDown = (event) => {
  // console.log('🔴', event.key)

  if (
    event.target.tagName === 'INPUT' ||
    event.target.tagName === 'TEXTAREA' ||
    event.target.isContentEditable
  ) {
    return
  }
  
  if (!selectedObject.value) return

  if (event.key === 'Backspace') {
    objectStore.removeObject(selectedObject.value.id)
    return
  }

  const moveAmount = 1 // 1px movement
  switch (event.key) {
    case 'ArrowLeft':
      objectStore.updateObjectPosition(selectedObject.value.id, {
        x: selectedObject.value.x - moveAmount,
        y: selectedObject.value.y,
      })
      break
    case 'ArrowRight':
      objectStore.updateObjectPosition(selectedObject.value.id, {
        x: selectedObject.value.x + moveAmount,
        y: selectedObject.value.y,
      })
      break
    case 'ArrowUp':
      objectStore.updateObjectPosition(selectedObject.value.id, {
        x: selectedObject.value.x,
        y: selectedObject.value.y - moveAmount,
      })
      break
    case 'ArrowDown':
      objectStore.updateObjectPosition(selectedObject.value.id, {
        x: selectedObject.value.x,
        y: selectedObject.value.y + moveAmount,
      })
      break
  }
}

const handleWheel = (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault()
    const delta = event.deltaY > 0 ? 0.9 : 1.1
    const newZoom = zoom.value * delta

    // Clamp zoom value between MIN_ZOOM and MAX_ZOOM
    zoom.value = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM)
  }
}

const updateZoom = (newZoom) => {
  zoom.value = newZoom
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('wheel', handleWheel, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('wheel', handleWheel)
})
</script>

<template>
  <!-- CANVAS REF -->
  <div
    ref="canvasRef"
    class="bg-[#2D2D2D] relative flex items-center justify-center w-full h-full overflow-auto"
  >
    <ZoomControls :zoom="zoom" :updateZoom="updateZoom" />

    <div
      class="transform-origin-center"
      :style="{
        transform: `scale(${zoom})`,
        transition: 'transform 0.1s ease-out',
      }"
    >
      <span>
        🚩
        <em class="text-xs not-italic">(0, 0)</em>
      </span>
      <Canvas :width="720" :height="452" />
    </div>
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

.transform-origin-center {
  transform-origin: center center;
}
</style>
