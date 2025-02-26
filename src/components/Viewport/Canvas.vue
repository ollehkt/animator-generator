<script setup>
import { ref, nextTick } from 'vue'
import { useObjectStore, useControllerStore, useViewportStore } from '@/store'
import { storeToRefs } from 'pinia'
import { HANDLE_SIZE, HANDLE_POSITIONS } from '@/helpers/consts'

import ObjectHandle from './ObjectHandle.vue'
import Circle from './Objects/Circle.vue'
import Image from './Objects/Image.vue'
import Text from './Objects/Text.vue'
const props = defineProps({
  width: {
    type: Number,
    default: 720,
  },
  height: {
    type: Number,
    default: 452,
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
})

const objectStore = useObjectStore()
const viewportStore = useViewportStore()
const { objects, selectedObject } = storeToRefs(objectStore)

const svgRef = ref(null)
const isDragging = ref(false)
const isResizing = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const resizeStartDimensions = ref(null)
const activeHandle = ref(null)
const isEditing = ref(false)
const editingObjectId = ref(null)

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
    objectStore.selectObject(object.id)
    // selectedObject.value = object
    return
  }

  if (event.target.tagName === 'rect' || event.target.tagName === 'svg') {
    // selectedObject.value = null
    objectStore.initSelectedObject()
  }
}

// @pointerdown
const handleObjectPointerDown = (event, object) => {
  event.stopPropagation()
  isDragging.value = true
  event.target.setPointerCapture(event.pointerId)

  const svgPoint = svgRef.value.createSVGPoint()
  svgPoint.x = event.clientX
  svgPoint.y = event.clientY

  const transformedPoint = svgPoint.matrixTransform(svgRef.value.getScreenCTM().inverse())

  dragOffset.value = {
    x: transformedPoint.x - object.position.x,
    y: transformedPoint.y - object.position.y,
  }
}

// svg 위에서 이동 이벤트 => 이동 리사이즈 모두 처리
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

  // DRAG => 움직인 값대로 오브젝트 위치 업데이트
  if (isDragging.value) {
    selectedObject.value.position.x = Math.round(transformedPoint.x - dragOffset.value.x)
    selectedObject.value.position.y = Math.round(transformedPoint.y - dragOffset.value.y)
    return
  }

  // RESIZE => 움직인 값대로 오브젝트 리사이즈
  if (isResizing.value) {
    // Handle circle resizing
    if (
      selectedObject.value.objectType === 'diagram' &&
      selectedObject.value.diagramType === 'circle'
    ) {
      viewportStore.handleCircleResize(transformedPoint, activeHandle.value)
      return
    } else if (selectedObject.value.objectType === 'image') {
      viewportStore.handleImageResize(
        transformedPoint,
        resizeStartDimensions.value,
        activeHandle.value
      )
      return
    } else {
      viewportStore.handleTextResize(
        transformedPoint,
        resizeStartDimensions.value,
        activeHandle.value
      )
      return
    }
  }
}

// 가이드라인 rect 포인터다운이벤트
const startResize = (event, object, handleIndex) => {
  event.stopPropagation()
  isResizing.value = true
  activeHandle.value = handleIndex
  event.target.setPointerCapture(event.pointerId)

  resizeStartDimensions.value = {
    x: object.position.x,
    y: object.position.y,
    ...((object.objectType === 'image' || object.objectType === 'text') && {
      width: object.size.width,
      height: object.size.height,
    }),
    ...(object.objectType === 'diagram' &&
      object.diagramType === 'circle' && {
        radius: object.radius,
        radiusX: object.radiusX || object.radius,
        radiusY: object.radiusY || object.radius,
      }),
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
  // Update position property access
  objectStore.updateObjectPosition(selectedObject.value.id, {
    x: selectedObject.value.position.x,
    y: selectedObject.value.position.y,
  })
}

const determineOutsideDirection = (object) => {
  if (!svgRef.value || !object) return null

  const svgBounds = svgRef.value.getBoundingClientRect()
  const objectRadius = object.radius || 0

  // Update property access for position
  if (object.position.x + objectRadius < 0) {
    objectStore.setObjectStartFrom('fromLeft')
    return 'fromLeft'
  }
  if (object.position.x - objectRadius > svgBounds.width) {
    objectStore.setObjectStartFrom('fromRight')
    return 'fromRight'
  }
  if (object.position.y + objectRadius < 0) {
    objectStore.setObjectStartFrom('fromTop')
    return 'fromTop'
  }
  if (object.position.y - objectRadius > svgBounds.height) {
    objectStore.setObjectStartFrom('fromBottom')
    return 'fromBottom'
  }
  objectStore.setObjectStartFrom('inside')
  return 'inside'
}

const getHandlePositions = (object) => {
  if (!object) return []

  if (object.objectType === 'diagram' && object.diagramType === 'circle') {
    const rx = object.radiusX || object.radius
    const ry = object.radiusY || object.radius
    return HANDLE_POSITIONS.map((pos) => ({
      x: object.position.x + pos.x * (rx + HANDLE_SIZE),
      y: object.position.y + pos.y * (ry + HANDLE_SIZE),
    }))
  }

  if (object.objectType === 'image' || object.objectType === 'text') {
    const width = Number(object.size.width) || 0
    const height = Number(object.size.height) || 0
    const x = Number(object.position.x) || 0
    const y = Number(object.position.y) || 0

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

const handleDoubleClick = (event, object) => {
  if (object?.objectType !== 'text') return

  event.stopPropagation()
  isEditing.value = true
  editingObjectId.value = object.id

  // Need to wait for foreignObject to render
  nextTick(() => {
    const textarea = document.querySelector(`#text-edit-${object.id}`)
    if (textarea) {
      textarea.focus()
      textarea.select()
    }
  })
}

const finishEditing = (object) => {
  isEditing.value = false
  editingObjectId.value = null
}

const handleTextChange = (object, event) => {
  objectStore.updateObjectText(object.id, event.target.value)
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
      <g :id="object.id" v-show="object.isVisible">
        <Circle
          v-if="object.objectType === 'diagram' && object.diagramType === 'circle'"
          :object="object"
          :handle-object-pointer-down="handleObjectPointerDown"
          :handle-click="handleClick"
        />

        <Image
          v-if="object.objectType === 'image'"
          :object="object"
          :handle-object-pointer-down="handleObjectPointerDown"
          :handle-click="handleClick"
        />

        <Text
          v-if="object.objectType === 'text'"
          :object="object"
          :editing-object-id="editingObjectId"
          :handle-object-pointer-down="handleObjectPointerDown"
          :handle-click="handleClick"
          :handle-double-click="handleDoubleClick"
          :finish-editing="finishEditing"
          :handle-text-change="handleTextChange"
        />

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

<style scoped>
textarea {
  font-family: inherit;
  line-height: inherit;
  font-size: inherit;
}
</style>
