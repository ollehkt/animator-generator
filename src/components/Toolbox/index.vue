<script setup>
import { ref } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import { OBJECT_TYPE } from '@/helpers/consts'
import ToolType from '@/components/Toolbox/ToolMenu.vue'

const objectStore = useObjectStore()

const fileInput = ref(null)
const objectType = ref(OBJECT_TYPE)

const toolboxRef = ref(null)
const showToolType = ref(false)
const toolTypePosition = ref({ x: 0, y: 0 })

/** 1차 버튼 */
const handleObjectType = (type, event) => {
  const buttonElement = event.currentTarget
  const toolboxRect = toolboxRef.value.getBoundingClientRect()
  const buttonRect = buttonElement.getBoundingClientRect()

  // Calculate center position of the button
  toolTypePosition.value = {
    x: buttonRect.left - toolboxRect.left + buttonRect.width / 2,
    y: 0, // This will position it at the top of the toolbox
  }

  const action = {
    shape: () => {
      showToolType.value = false
      addShape()
    },
    image: () => {
      showToolType.value = false
      fileInput.value.click()
    },
    text: () => {
      showToolType.value = false
      addText()
    },
    media: () => {
      showToolType.value = true
    },
  }
  return action[type]()
}

/** 2차 버튼 메뉴 */
const handleToolMenu = (type) => {
  if (type === 'audio') {
    // todo file input 추가
    objectStore.addMedia({
      type: 'audio',
    })
  } else {
    alert('비디오처리', type)
  }
  showToolType.value = false
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
        objectType: 'image',
        position: {
          x: 100,
          y: 100,
        },
        size: {
          width: img.width,
          height: img.height,
        },
        url: base64String,
      })
    }
    img.src = base64String
  }
  reader.readAsDataURL(file)
}

/**
 * 
 * TODO: 공통 함수로 빼기 도형 타입 추가
 */
const addShape = () => {
  objectStore.addObject({
    objectType: 'diagram',
    diagramType: 'circle',
    position: {
      x: 100,
      y: 100,
    },
    radius: {
      radiusX: 30,
      radiusY: 30,
    },
    fillStyle: '#825feb',
  })
}

const addText = () => {
  objectStore.addObject({
    objectType: 'text',
    position: {
      x: 100,
      y: 100,
    },
    size: {
      width: 128,
      height: 19,
    },
    text: '텍스트를 입력하세요',
  })
}

const closeToolType = () => {
  showToolType.value = false
}

const getObjectIcon = (type) => {
  switch (type) {
    case 'text':
      return 'T'
    case 'image':
      return 'I'
    case 'media':
      return 'M'

    default: // circle, rect, polygon
      return 'O'
  }
}


</script>
<template>
  <div
    ref="toolboxRef"
    class="absolute flex items-center justify-between gap-8 p-2 -translate-x-1/2 border bg-[#333]/80 backdrop-blur-sm border-gray-700 rounded-xl shadow-lg bottom-6 left-1/2 w-fit"
  >
    <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />

    <div class="flex gap-4">
      <button
        v-for="object in objectType"
        :key="object.id"
        class="mini-btn"
        @click="handleObjectType(object.type, $event)"
      >
        {{ getObjectIcon(object.type) }}
      </button>
    </div>
    <ToolType
      :position="toolTypePosition"
      :show="showToolType"
      :close="closeToolType"
      :handle-click="handleToolMenu"
    />
  </div>
</template>
