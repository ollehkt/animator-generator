<script setup>
import { ref } from 'vue'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'
import { OBJECT_TYPE, OBJECT_ALIGN } from '@/helpers/consts'

const objectStore = useObjectStore()
const controllerStore = useControllerStore()
const { selectedObject } = storeToRefs(objectStore)

const objectType = ref(OBJECT_TYPE)
const objectAlign = ref(OBJECT_ALIGN)

const emit = defineEmits(['addObject'])

const handleObjectType = (type) => {
  const action = {
    shape: () => {
      addShape()
    },
    image: () => {
      uploadImageLocal()
    },
    text: () => {
      addText()
    },
  }
  return action[type]()
}
const fileInput = ref(null)

const uploadImageLocal = () => {
  fileInput.value.click()
}

const handleFileChange = async (e) => {
  e.stopPropagation()
  e.preventDefault()

  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const base64String = e.target.result
    const img = new Image()
    img.onload = () => {
      // Add image object to canvas after image is loaded
      objectStore.addObject({
        type: 'image',
        x: 100,
        y: 100,
        width: img.width,
        height: img.height,
        imageUrl: base64String,
      })
    }
    img.src = base64String
  }
  reader.readAsDataURL(file)
}

const addShape = () => {
  objectStore.addObject({
    type: 'circle',
    x: 100,
    y: 100,
    radius: 30,
    fillStyle: '#825feb',
  })
}

const addText = () => {
  objectStore.addObject({
    type: 'text',
    x: 100,
    y: 100,
    width: 128,
    height: 19,
    text: '텍스트를 입력하세요',
  })
}

const handleAlign = (type) => {
  if (!selectedObject.value) return

  const canvasWidth = 720 // From Canvas.vue props default width
  const canvasHeight = 452 // From Canvas.vue props default height

  const object = selectedObject.value
  let newX = object.x
  let newY = object.y

  // Calculate object dimensions based on type
  const objectWidth =
    object.type === 'circle' ? (object.radiusX || object.radius) * 2 : object.width

  const objectHeight =
    object.type === 'circle' ? (object.radiusY || object.radius) * 2 : object.height

  switch (type) {
    // Horizontal alignment
    case 'left':
      newX = objectWidth / 2
      break
    case 'center':
      newX = canvasWidth / 2
      break
    case 'right':
      newX = canvasWidth - objectWidth / 2
      break

    // Vertical alignment
    case 'top':
      newY = objectHeight / 2
      break
    case 'middle':
      newY = canvasHeight / 2
      break
    case 'bottom':
      newY = canvasHeight - objectHeight / 2
      break
  }

  // Update object position
  selectedObject.value.x = newX
  selectedObject.value.y = newY
}

const getObjectIcon = (type) => {
  switch (type) {
    case 'text':
      return 'T'
    case 'image':
      return 'I'

    default: // circle, rect, polygon
      return 'O'
  }
}
</script>
<template>
  <div
    class="absolute flex items-center justify-between gap-8 p-4 px-6 -translate-x-1/2 border bg-[#333] border-gray-700 rounded-lg shadow-lg bottom-8 left-1/2 w-fit"
  >
    <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
    <div class="flex gap-4">
      <button
        v-for="object in objectType"
        :key="object.id"
        class="mini-btn"
        @click="handleObjectType(object.type)"
      >
        {{ getObjectIcon(object.type) }}
      </button>
    </div>
    <p class="hidden w-1 h-6 bg-gray-700 rounded-full"></p>
    <!-- ALLIGN -->
    <div class="flex hidden gap-4">
      <button
        v-for="align in objectAlign"
        :key="align.id"
        class="w-8 h-8 min-w-8 flex gap-2 items-center justify-center font-bold text-white transition-colors duration-200 rounded-md shadow-sm bg-[#4F46E5] hover:bg-[#4F46E5]/80"
        @click="handleAlign(align.type)"
        v-html="align.icon"
      ></button>
    </div>
  </div>
</template>
