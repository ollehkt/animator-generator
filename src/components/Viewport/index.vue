<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useObjectStore, useControllerStore, useViewportStore, useProjectsStore } from '@/store'
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
const zoom = ref(1)
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
    <!-- PROJECT 설정 버튼 -->
    <button
      @click="projectsStore.toggleProjectSetting"
      class="group absolute z-10 flex items-center justify-center w-10 h-10 border bg-[#333]/80 border-gray-700 rounded-full shadow-md group bottom-8 right-6 hover:bg-[#4F46E5]/60 transition-colors duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#9CA3AF"
        class="w-6 h-6 transition-transform duration-300 group-hover:rotate-180 group-hover:stroke-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </button>
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
