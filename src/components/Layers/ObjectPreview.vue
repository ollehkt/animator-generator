<script setup>
import { storeToRefs } from 'pinia'
import { useObjectStore } from '@/store'
import { onMounted, ref, watch } from 'vue'

const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)
const canvasRef = ref(null)

// Draw function to handle the preview
const drawPreview = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!selectedObject.value) return

  const obj = selectedObject.value
  if (obj.objectType === 'diagram' && obj.diagramType === 'circle') {
    // Scale down the circle/ellipse to fit preview
    const scale = 0.6
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    ctx.beginPath()
    // Use radiusX and radiusY if available, otherwise fallback to radius
    const radiusX = (obj.radius.radiusX || obj.radius.radiusX) * scale
    const radiusY = (obj.radius.radiusY || obj.radius.radiusY) * scale
    
    // Use ellipse method for drawing
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
    ctx.fillStyle = obj.fillStyle
    ctx.fill()
  } else if (obj.objectType === 'text') {
    // Set text properties
    ctx.font = '14px Arial'
    ctx.fillStyle = '#FFFFFF' // Default white color for text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Draw text in center of preview
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    ctx.fillText(obj.text, centerX, centerY)
  } else if (obj.objectType === 'image') {
    const img = new Image()
    img.onload = () => {
      // Calculate scaling to fit the preview while maintaining aspect ratio
      const scale = Math.min(
        canvas.width / obj.size.width,
        canvas.height / obj.size.height
      ) * 0.8 // 80% of available space

      const scaledWidth = obj.size.width * scale
      const scaledHeight = obj.size.height * scale
      
      // Center the image in preview
      const x = (canvas.width - scaledWidth) / 2
      const y = (canvas.height - scaledHeight) / 2

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
    }
    img.src = obj.url
  }
}

// Watch for changes in selected object
watch(selectedObject, () => {
  drawPreview()
}, { immediate: true })

// Initialize canvas when mounted
onMounted(() => {
  drawPreview()
})
</script>

<template>
  <div
    class="w-[180px] h-[180px] mx-auto border mb-4 border-[#2A2A2A] rounded-sm bg-[#212121] shadow-inner flex items-center justify-center"
  >
    <canvas
      ref="canvasRef"
      width="180"
      height="180"
      class="w-full h-full"
    />
    <div v-if="!selectedObject" class="text-[#757575] text-sm absolute">
      Preview
    </div>
  </div>
</template>