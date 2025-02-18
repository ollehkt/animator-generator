<script setup>
import { computed } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const { animationConfig } = storeToRefs(controllerStore)
const { selectedObject } = storeToRefs(objectStore)

const objectSize = computed(() => {
  if (!selectedObject.value) return { width: '-', height: '-' }

  // Handle circle type object
  if (selectedObject.value.type === 'circle') {
    // If the circle has radiusX and radiusY (ellipse)
    if (selectedObject.value.radiusX && selectedObject.value.radiusY) {
      return {
        width: Math.round(selectedObject.value.radiusX * 2),
        height: Math.round(selectedObject.value.radiusY * 2),
      }
    }
    // If it's a regular circle with single radius
    return {
      width: Math.round(selectedObject.value.radius * 2),
      height: Math.round(selectedObject.value.radius * 2),
    }
  }

  // Default case for other objects with width/height
  return {
    width: selectedObject.value.width,
    height: selectedObject.value.height,
  }
})

const setObjectSizeForAction = () => {
  controllerStore.updateAnimationConfig('width', objectSize.value.width)
  controllerStore.updateAnimationConfig('height', objectSize.value.height)
}
</script>
<template>
  <div class="flex gap-2">
    <p class="flex flex-col gap-2 overflow-hidden">
      <label class="pl-1 text-xs text-gray-400">Width</label>
      <input
        type="number"
        v-model="objectSize.width"
        class="input-dark"
        :disabled="!selectedObject"
        @change="setObjectSizeForAction"
      />
    </p>
    <p class="flex flex-col gap-2 overflow-hidden">
      <label class="pl-1 text-xs text-gray-400">Height</label>
      <input
        type="number"
        v-model="objectSize.height"
        class="input-dark"
        :disabled="!selectedObject"
        @change="setObjectSizeForAction"
      />
    </p>
  </div>
</template>
