<script setup>
import { ref } from 'vue'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'
import { HANDLE_SIZE, HANDLE_POSITIONS } from '@/helpers/consts'
import ObjectHandle from './ObjectHandle.vue'

const props = defineProps({
  width: {
    type: Number,
    default: 800,
  },
  height: {
    type: Number,
    default: 400,
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
})

const objectStore = useObjectStore()
const { objects, selectedObject } = storeToRefs(objectStore)

const svgRef = ref(null)
const isDragging = ref(false)
const isResizing = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const resizeStartDimensions = ref(null)
const activeHandle = ref(null)

const MOVE_DEBOUNCE = 5 // milliseconds
let lastMoveTime = 0

// Add cursor styles for each handle
const handleCursors = [
  'nw-resize', // Top-left
  'n-resize', // Top-center
  'ne-resize', // Top-right
  'e-resize', // Middle-right
  'se-resize', // Bottom-right
  's-resize', // Bottom-center
  'sw-resize', // Bottom-left
  'w-resize', // Middle-left
]

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

// 오브젝트 포인터다운 이벤트
const startDrag = (event, object) => {
  event.stopPropagation()
  isDragging.value = true
  event.target.setPointerCapture(event.pointerId)

  const svgPoint = svgRef.value.createSVGPoint()
  svgPoint.x = event.clientX
  svgPoint.y = event.clientY

  const transformedPoint = svgPoint.matrixTransform(svgRef.value.getScreenCTM().inverse())

  dragOffset.value = {
    x: transformedPoint.x - object.x,
    y: transformedPoint.y - object.y,
  }
}

const handlePointerMove = (event) => {
  if (!isDragging.value && !isResizing.value) return
  if (!selectedObject.value) return

  const currentTime = Date.now()
  if (currentTime - lastMoveTime < MOVE_DEBOUNCE) return
  lastMoveTime = currentTime

  const svgPoint = svgRef.value.createSVGPoint()
  svgPoint.x = event.clientX
  svgPoint.y = event.clientY
  const transformedPoint = svgPoint.matrixTransform(svgRef.value.getScreenCTM().inverse())

  // 움직인 값대로 오브젝트 위치 업데이트
  if (isDragging.value) {
    selectedObject.value.x = Math.round(transformedPoint.x - dragOffset.value.x)
    selectedObject.value.y = Math.round(transformedPoint.y - dragOffset.value.y)
    return
  }

  if (isResizing.value) {
    const deltaX = transformedPoint.x - resizeStartDimensions.value.x
    const deltaY = transformedPoint.y - resizeStartDimensions.value.y

    if (selectedObject.value.type === 'circle') {
      const dx = transformedPoint.x - selectedObject.value.x
      const dy = transformedPoint.y - selectedObject.value.y

      switch (activeHandle.value) {
        case 0: // Top-left
        case 4: // Bottom-right
          selectedObject.value.radiusX = Math.max(10, Math.abs(dx))
          selectedObject.value.radiusY = Math.max(10, Math.abs(dy))
          break
        case 1: // Top-center
        case 5: // Bottom-center
          selectedObject.value.radiusY = Math.max(10, Math.abs(dy))
          break
        case 3: // Middle-right
        case 7: // Middle-left
          selectedObject.value.radiusX = Math.max(10, Math.abs(dx))
          break
        default:
          selectedObject.value.radiusX = Math.max(10, Math.abs(dx))
          selectedObject.value.radiusY = Math.max(10, Math.abs(dy))
      }
    } else {
      // Complete image and text resizing for all handles
      console.log("handleNO=>",activeHandle.value)
      switch (activeHandle.value) {
        case 0: // Top-left
          selectedObject.value.width = Math.max(20, resizeStartDimensions.value.width - deltaX)
          selectedObject.value.height = Math.max(20, resizeStartDimensions.value.height - deltaY)
          selectedObject.value.x = transformedPoint.x
          selectedObject.value.y = transformedPoint.y
          break
        case 1: // Top-center
          selectedObject.value.height = Math.max(20, resizeStartDimensions.value.height - deltaY)
          selectedObject.value.y = transformedPoint.y
          break
        case 2: // Top-right
          selectedObject.value.width = Math.max(20, resizeStartDimensions.value.width + deltaX)
          selectedObject.value.height = Math.max(20, resizeStartDimensions.value.height - deltaY)
          selectedObject.value.y = transformedPoint.y
          break
        case 3: // Middle-right
          selectedObject.value.width = Math.max(20, resizeStartDimensions.value.width + deltaX)
          break
        case 4: // Bottom-right
          selectedObject.value.width = Math.max(20, resizeStartDimensions.value.width + deltaX)
          selectedObject.value.height = Math.max(20, resizeStartDimensions.value.height + deltaY)
          break
        case 5: // Bottom-center
          selectedObject.value.height = Math.max(20, resizeStartDimensions.value.height + deltaY)
          break
        case 6: // Bottom-left
          selectedObject.value.width = Math.max(20, resizeStartDimensions.value.width - deltaX)
          selectedObject.value.height = Math.max(20, resizeStartDimensions.value.height + deltaY)
          selectedObject.value.x = transformedPoint.x
          break
        case 7: // Middle-left
          selectedObject.value.width = Math.max(20, resizeStartDimensions.value.width - deltaX)
          selectedObject.value.x = transformedPoint.x
          break
      }
    }
  }
}

const endDrag = () => {
  isDragging.value = false
  isResizing.value = false
  activeHandle.value = null
  if (!selectedObject.value) return
  if (selectedObject.value && !selectedObject.value.isClone) {
    determineOutsideDirection(selectedObject.value)
  }
  // 오브젝트 위치 업데이트
  objectStore.updateObjectPosition(selectedObject.value.id, {
    x: selectedObject.value.x,
    y: selectedObject.value.y,
  })
}

// 핸들러 포인터다운
const startResize = (event, object, handleIndex) => {
  event.stopPropagation()
  isResizing.value = true
  activeHandle.value = handleIndex
  event.target.setPointerCapture(event.pointerId)

  resizeStartDimensions.value = {
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    radius: object.radius,
    radiusX: object.radiusX || object.radius,
    radiusY: object.radiusY || object.radius,
  }
}

const determineOutsideDirection = (object) => {
  // object 가 캔버스 상하좌우 어디에 있는지 확인함
  if (!svgRef.value || !object) return null

  const svgBounds = svgRef.value.getBoundingClientRect()
  const objectRadius = object.radius || 0

  // Check if object is outside SVG boundaries
  if (object.x + objectRadius < 0) {
    objectStore.setObjectStartFrom('fromLeft')
    return 'fromLeft'
  }
  if (object.x - objectRadius > svgBounds.width) {
    objectStore.setObjectStartFrom('fromRight')
    return 'fromRight'
  }
  if (object.y + objectRadius < 0) {
    objectStore.setObjectStartFrom('fromTop')
    return 'fromTop'
  }
  if (object.y - objectRadius > svgBounds.height) {
    objectStore.setObjectStartFrom('fromBottom')
    return 'fromBottom'
  }
  objectStore.setObjectStartFrom('inside')
  return 'inside' // Object is inside SVG
}

const getHandlePositions = (object) => {
  if (!object) return []

  if (object.type === 'circle') {
    const rx = object.radiusX || object.radius
    const ry = object.radiusY || object.radius
    return HANDLE_POSITIONS.map((pos) => ({
      x: object.x + pos.x * (rx + HANDLE_SIZE),
      y: object.y + pos.y * (ry + HANDLE_SIZE),
    }))
  }

  if (object.type === 'image' || object.type === 'text') {
    const width = Number(object.width) || 0
    const height = Number(object.height) || 0
    const x = Number(object.x) || 0
    const y = object.type === 'text' ? Number(object.y) - height : Number(object.y)

    return [
      { x, y }, // Top-left
      { x: x + width / 2, y }, // Top-center
      { x: x + width, y }, // Top-right
      { x: x + width, y: y + height / 2 }, // Middle-right
      { x: x + width, y: y + height }, // Bottom-right
      { x: x + width / 2, y: y + height }, // Bottom-center
      { x, y: y + height }, // Bottom-left
      { x, y: y + height / 2 }, // Middle-left
    ]
  }

  return []
}
</script>
<template>
  <svg
    ref="svgRef"
    :width="width"
    :height="height"
    @dragenter.prevent
    @dragover.prevent
    @pointermove.passive="handlePointerMove"
    @pointerup="endDrag"
    @pointerleave="endDrag"
    @click="handleClick($event, null)"
    class="shadow-sm svg-canvas"
  >
    <!-- Add grid pattern definition -->
    <rect x="0" y="0" :width="width" :height="height" :fill="backgroundColor" />
    <rect x="0" y="0" :width="width" :height="height" fill="url(#grid)" />

    <defs>
      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ddd" stroke-width="0.5" />
        <path
          d="M 10 0 L 10 50 M 20 0 L 20 50 M 30 0 L 30 50 M 40 0 L 40 50 M 0 10 L 50 10 M 0 20 L 50 20 M 0 30 L 50 30 M 0 40 L 50 40"
          fill="none"
          stroke="#eee"
          stroke-width="0.25"
        />
      </pattern>
    </defs>

    <!-- Objects -->
    <template v-for="object in objects" :key="object.id">
      <g :id="object.id">
        <!-- Change circle to ellipse -->
        <ellipse
          v-if="object.type === 'circle'"
          :cx="object.x"
          :cy="object.y"
          :rx="object.radiusX || object.radius"
          :ry="object.radiusY || object.radius"
          :fill="object.fillStyle"
          @pointerdown="(e) => startDrag(e, object)"
          @click="(e) => handleClick(e, object)"
          :class="{ 'cursor-move': true }"
        />

        <image
          v-if="object.type === 'image'"
          :x="Number(object.x) || 0"
          :y="Number(object.y) || 0"
          :width="Number(object.width) || 100"
          :height="Number(object.height) || 100"
          :href="object.imageUrl"
          preserveAspectRatio="xMidYMid meet"
          @pointerdown="(e) => startDrag(e, object)"
          @click="(e) => handleClick(e, object)"
          :class="{ 'cursor-move': true }"
        />

        <text
          v-if="object.type === 'text'"
          :x="object.x"
          :y="object.y"
          :fill="object.fillStyle"
          @pointerdown="(e) => startDrag(e, object)"
          @click="(e) => handleClick(e, object)"
          :class="{ 'cursor-move': true }"
        >
          {{ object.text }}
        </text>
        <!-- dashed line and handler -->
        <ObjectHandle
          v-if="selectedObject === object"
          :object="object"
          :handle-cursors="handleCursors"
          :handle-positions="getHandlePositions(object)"
          :on-start-resize="startResize"
        />
      </g>
    </template>
  </svg>
</template>
