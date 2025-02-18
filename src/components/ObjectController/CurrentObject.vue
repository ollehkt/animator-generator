<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useObjectStore } from '@/store'
import ObjectPreview from './ObjectPreview.vue'

const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)


const objectSize = computed(() => {
  if (!selectedObject.value) return { width: '-', height: '-' }
  
  // Handle circle type object
  if (selectedObject.value.type === 'circle') {
    // If the circle has radiusX and radiusY (ellipse)
    if (selectedObject.value.radiusX && selectedObject.value.radiusY) {
      return {
        width: Math.round(selectedObject.value.radiusX * 2),
        height: Math.round(selectedObject.value.radiusY * 2)
      }
    }
    // If it's a regular circle with single radius
    return {
      width: Math.round(selectedObject.value.radius * 2),
      height: Math.round(selectedObject.value.radius * 2)
    }
  }

  // Default case for other objects with width/height
  return {
    width: selectedObject.value.width,
    height: selectedObject.value.height,
  }
})
</script>
<template>
  <!-- 현재요소 -->
  <div class="p-6 px-8 space-y-3">
    <ObjectPreview />

    <div class="space-y-1">
      <label class="block text-xs text-[#9CA3AF]">선택 요소</label>
      <p class="text-xs">{{ selectedObject?.name || '선택된 요소가 없습니다.' }}</p>
    </div>

    <div class="space-y-1">
      <label class="block text-xs text-[#9CA3AF]">크기</label>
      <div class="flex gap-4 text-xs">
        <span>W: {{ Math.round(objectSize.width) || '-' }}</span>
        <span>H: {{ Math.round(objectSize.height) || '-' }}</span>
      </div>
    </div>
    <div class="space-y-1">
      <label class="block text-xs text-[#9CA3AF]">캔버스 기준 좌표</label>
      <div class="flex gap-4 text-xs">
        <span>X: {{ Math.round(selectedObject?.x) || '-' }}</span>
        <span>Y: {{ Math.round(selectedObject?.y) || '-' }}</span>
      </div>
    </div>
  </div>
</template>
