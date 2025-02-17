<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

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

const HANDLE_SIZE = 8 // Size of control handles
const HANDLE_POSITIONS = [
  { x: -1, y: -1 }, // Top-left
  { x: 0, y: -1 }, // Top-center
  { x: 1, y: -1 }, // Top-right
  { x: 1, y: 0 }, // Middle-right
  { x: 1, y: 1 }, // Bottom-right
  { x: 0, y: 1 }, // Bottom-center
  { x: -1, y: 1 }, // Bottom-left
  { x: -1, y: 0 }, // Middle-left
]

const objectStore = useObjectStore()
const controllerStore = useControllerStore()
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
  'n-resize',  // Top-center
  'ne-resize', // Top-right
  'e-resize',  // Middle-right
  'se-resize', // Bottom-right
  's-resize',  // Bottom-center
  'sw-resize', // Bottom-left
  'w-resize',  // Middle-left
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
    radiusY: object.radiusY || object.radius
  }
}

const onDrag = (event) => {
  if (!isDragging.value && !isResizing.value) return
  if (!selectedObject.value) return

  const currentTime = Date.now()
  if (currentTime - lastMoveTime < MOVE_DEBOUNCE) return
  lastMoveTime = currentTime

  const svgPoint = svgRef.value.createSVGPoint()
  svgPoint.x = event.clientX
  svgPoint.y = event.clientY
  const transformedPoint = svgPoint.matrixTransform(svgRef.value.getScreenCTM().inverse())

  if (isDragging.value) {
    selectedObject.value.x = transformedPoint.x - dragOffset.value.x
    selectedObject.value.y = transformedPoint.y - dragOffset.value.y
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
      // Handle image and text resizing based on handle position
      switch (activeHandle.value) {
        case 0: // Top-left
          selectedObject.value.width = Math.max(20, resizeStartDimensions.value.width - deltaX)
          selectedObject.value.height = Math.max(20, resizeStartDimensions.value.height - deltaY)
          selectedObject.value.x = transformedPoint.x
          selectedObject.value.y = transformedPoint.y
          break
        case 2: // Top-right
          selectedObject.value.width = Math.max(20, resizeStartDimensions.value.width + deltaX)
          selectedObject.value.height = Math.max(20, resizeStartDimensions.value.height - deltaY)
          selectedObject.value.y = transformedPoint.y
          break
        // Add other cases as needed
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

  controllerStore.targetPOS = {
    x: selectedObject.value.x,
    y: 180,
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
    @pointermove.passive="onDrag"
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

        <!-- Control handles -->
        <template v-if="selectedObject === object">
          <!-- Selection border -->
          <ellipse
            v-if="object.type === 'circle'"
            :cx="object.x"
            :cy="object.y"
            :rx="(object.radiusX || object.radius) + 2"
            :ry="(object.radiusY || object.radius) + 2"
            fill="none"
            stroke="#4a9eff"
            stroke-width="1"
            stroke-dasharray="4 2"
          />

          <rect
            v-if="object.type === 'image' || object.type === 'text'"
            :x="Number(object.x) - 2"
            :y="
              object.type === 'text'
                ? Number(object.y) - Number(object.height) + 1
                : Number(object.y) - 2
            "
            :width="Number(object.width) + 4"
            :height="Number(object.height) + 4"
            fill="none"
            stroke="#4a9eff"
            stroke-width="1"
            stroke-dasharray="4 2"
          />
          <!-- Resize handles -->
          <rect
            v-for="(pos, index) in getHandlePositions(object)"
            :key="index"
            :x="pos.x - HANDLE_SIZE / 2"
            :y="pos.y - HANDLE_SIZE / 2"
            :width="HANDLE_SIZE"
            :height="HANDLE_SIZE"
            fill="white"
            stroke="#4a9eff"
            stroke-width="1"
            class="handle"
            :data-direction="handleCursors[index].split('-')[0]"
            @pointerdown="(e) => startResize(e, object, index)"
          />
        </template>
      </g>
    </template>
  </svg>
</template>

<style scoped>
.handle {
  cursor: default;
}
.handle[data-direction="nw"] { cursor: nw-resize; }
.handle[data-direction="n"]  { cursor: n-resize; }
.handle[data-direction="ne"] { cursor: ne-resize; }
.handle[data-direction="e"]  { cursor: e-resize; }
.handle[data-direction="se"] { cursor: se-resize; }
.handle[data-direction="s"]  { cursor: s-resize; }
.handle[data-direction="sw"] { cursor: sw-resize; }
.handle[data-direction="w"]  { cursor: w-resize; }
</style>
