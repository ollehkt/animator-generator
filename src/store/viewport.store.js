import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
export const useViewportStore = defineStore('viewport', () => {

  // 원형 리사이즈
  const handleCircleResize = (transformedPoint, handleIndex) => {
    const objectStore = useObjectStore()
    const { selectedObject } = storeToRefs(objectStore)

    const dx = transformedPoint.x - selectedObject.value.position.x
    const dy = transformedPoint.y - selectedObject.value.position.y

    switch (handleIndex) {
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
  }
  return {
    handleCircleResize,
  }
})