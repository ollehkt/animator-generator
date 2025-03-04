<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  useObjectStore,
  useControllerStore,
  useViewportStore,
  useProjectsStore,
} from '@/store'
import { storeToRefs } from 'pinia'

import Canvas from './Canvas.vue'
import ZoomControls from './ZoomControls.vue'

const canvasRef = ref(null)

const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const viewportStore = useViewportStore()
const projectsStore = useProjectsStore()

const { isSettingTrigger } = storeToRefs(controllerStore)
const { selectedObject } = storeToRefs(objectStore)
const { canvasSize } = storeToRefs(viewportStore)

// Add zoom state and controls
const zoom = ref(0.8)
const MIN_ZOOM = 0.5 //50%
const MAX_ZOOM = 2 //200%

//전역 클릭 이벤트
const handleGlobalClick = (event) => {
  const { target } = event
  // 타겟이 핸들인 경우
  if (target.hasAttribute('data-direction')) {
    const direction = target.getAttribute('data-direction')
    return
  }

  if (canvasRef.value?.contains(target)) {
    isSettingTrigger.value = false
    objectStore.initSelectedObject()
    // selectedObject.value = null
  }
}

const handleKeyDown = (event) => {
  if (
    event.target.tagName === 'INPUT' ||
    event.target.tagName === 'TEXTAREA' ||
    event.target.isContentEditable
  ) {
    return
  }

  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault()
    projectsStore.saveCurrentProject()
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
        x: selectedObject.value.position.x - moveAmount,
        y: selectedObject.value.position.y,
      })
      break
    case 'ArrowRight':
      objectStore.updateObjectPosition(selectedObject.value.id, {
        x: selectedObject.value.position.x + moveAmount,
        y: selectedObject.value.position.y,
      })
      break
    case 'ArrowUp':
      objectStore.updateObjectPosition(selectedObject.value.id, {
        x: selectedObject.value.position.x,
        y: selectedObject.value.position.y - moveAmount,
      })
      break
    case 'ArrowDown':
      objectStore.updateObjectPosition(selectedObject.value.id, {
        x: selectedObject.value.position.x,
        y: selectedObject.value.position.y + moveAmount,
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

const handleClickCanvas = () => {
  objectStore.canvasSelected = true
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
      @click="handleClickCanvas"
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
      <Canvas :width="canvasSize?.width" :height="canvasSize?.height" />
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
