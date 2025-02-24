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

  //handleImageResize
  const handleImageResize = (transformedPoint, resizeStartDimensions, handleIndex) => {
    const objectStore = useObjectStore()
    const { selectedObject } = storeToRefs(objectStore)

    // X축 핸들 시작 위치 계산
    const handleStartX = handleIndex === 2 || handleIndex === 3 || handleIndex === 4 
        ? resizeStartDimensions.x + resizeStartDimensions.width  // 오른쪽 핸들
        : resizeStartDimensions.x  // 왼쪽 핸들

    // Y축 핸들 시작 위치 계산 수정
    const handleStartY = handleIndex === 4 || handleIndex === 5 || handleIndex === 6
        ? resizeStartDimensions.y + resizeStartDimensions.height  // 아래쪽 핸들
        : resizeStartDimensions.y  // 위쪽 핸들

    // 실제 이동 거리 계산
    const deltaX = transformedPoint.x - handleStartX
    const deltaY = transformedPoint.y - handleStartY

    // console.log('Handle Index:', handleIndex)
    // console.log('Delta Y:', deltaY)
    // console.log('Start Height:', resizeStartDimensions.height)

    switch (handleIndex) {
      case 0: // Top-left
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width - deltaX)
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height - deltaY)
        selectedObject.value.position.x = transformedPoint.x
        selectedObject.value.position.y = transformedPoint.y
        break
      case 1: // Top-center
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height - deltaY)
        selectedObject.value.position.y = transformedPoint.y
        break
      case 2: // Top-right
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width + deltaX)
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height - deltaY)
        selectedObject.value.position.y = transformedPoint.y
        break
      case 3: // Middle-right
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width + deltaX)
        break
      case 4: // Bottom-right
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width + deltaX)
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height + deltaY)
        break
      case 5: // Bottom-center
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height + deltaY)
        break
      case 6: // Bottom-left
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width - deltaX)
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height + deltaY)
        selectedObject.value.position.x = transformedPoint.x
        break
      case 7: // Middle-left
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width - deltaX)
        selectedObject.value.position.x = transformedPoint.x
        break
    }
  }
  return {
    handleCircleResize,
    handleImageResize,
  }
})
