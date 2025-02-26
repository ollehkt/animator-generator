import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
export const useViewportStore = defineStore('viewport', () => {

  const canvasSize = ref({
    width: 720,
    height: 452,
  })

  const setCanvasSize = (width, height) => {
    canvasSize.value.width = width
    canvasSize.value.height = height
  }
  // Circle Object Resize
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

  // Image Object Resize
  const handleImageResize = (transformedPoint, resizeStartDimensions, handleIndex) => {
    const objectStore = useObjectStore()
    const { selectedObject } = storeToRefs(objectStore)

    // X축 핸들 시작 위치 계산
    const handleStartX =
      handleIndex === 2 || handleIndex === 3 || handleIndex === 4
        ? resizeStartDimensions.x + resizeStartDimensions.width // 오른쪽 핸들
        : resizeStartDimensions.x // 왼쪽 핸들

    // Y축 핸들 시작 위치 계산 수정
    const handleStartY =
      handleIndex === 4 || handleIndex === 5 || handleIndex === 6
        ? resizeStartDimensions.y + resizeStartDimensions.height // 아래쪽 핸들
        : resizeStartDimensions.y // 위쪽 핸들

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

  // Text Obejct Resize
  const handleTextResize = (transformedPoint, resizeStartDimensions, handleIndex) => {
    const objectStore = useObjectStore()
    const { selectedObject } = storeToRefs(objectStore)

    // Calculate handle start positions
    const handleStartX =
      handleIndex === 2 || handleIndex === 3 || handleIndex === 4
        ? resizeStartDimensions.x + resizeStartDimensions.width // right handles
        : resizeStartDimensions.x // left handles

    const handleStartY =
      handleIndex === 4 || handleIndex === 5 || handleIndex === 6
        ? resizeStartDimensions.y + resizeStartDimensions.height // bottom handles
        : resizeStartDimensions.y // top handles

    // Only adjust width for horizontal handles
    if (handleIndex === 3 || handleIndex === 7) {
      if (handleIndex === 3) { // Right handle
        selectedObject.value.size.width = Math.max(20, transformedPoint.x - resizeStartDimensions.x)
      } else { // Left handle
        const newWidth = Math.max(20, (resizeStartDimensions.x + resizeStartDimensions.width) - transformedPoint.x)
        selectedObject.value.position.x = transformedPoint.x
        selectedObject.value.size.width = newWidth
      }
      return
    }

    // Handle vertical resizing
    if (handleIndex === 1 || handleIndex === 5) {
      const deltaY = transformedPoint.y - handleStartY
      if (handleIndex === 1) { // Top handle
        const newHeight = Math.max(20, resizeStartDimensions.height - deltaY)
        selectedObject.value.position.y = transformedPoint.y
        selectedObject.value.size.height = newHeight
      } else { // Bottom handle
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height + (transformedPoint.y - (resizeStartDimensions.y + resizeStartDimensions.height)))
      }
      return
    }

    // For corner handles, adjust both width and height
    const deltaX = transformedPoint.x - handleStartX
    const deltaY = transformedPoint.y - handleStartY

    switch (handleIndex) {
      case 0: // Top-left
        selectedObject.value.position.x = transformedPoint.x
        selectedObject.value.position.y = transformedPoint.y
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width - deltaX)
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height - deltaY)
        break
      case 2: // Top-right
        selectedObject.value.position.y = transformedPoint.y
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width + deltaX)
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height - deltaY)
        break
      case 4: // Bottom-right
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width + deltaX)
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height + (transformedPoint.y - (resizeStartDimensions.y + resizeStartDimensions.height)))
        break
      case 6: // Bottom-left
        selectedObject.value.position.x = transformedPoint.x
        selectedObject.value.size.width = Math.max(20, resizeStartDimensions.width - deltaX)
        selectedObject.value.size.height = Math.max(20, resizeStartDimensions.height + (transformedPoint.y - (resizeStartDimensions.y + resizeStartDimensions.height)))
        break
    }
  }
  return {
    canvasSize,
    setCanvasSize,
    handleCircleResize,
    handleImageResize,
    handleTextResize,
  }
})
