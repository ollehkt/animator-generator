<script setup>
import { ref } from 'vue'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'
import { OBJECT_TYPE } from '@/helpers/consts'
const objectStore = useObjectStore()
const controllerStore = useControllerStore()

const objectType = ref(OBJECT_TYPE)

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

const handlePlay = () => {
  controllerStore.play()
}
</script>
<template>
  <div
    class="absolute flex justify-between gap-10 p-4 px-6 -translate-x-1/2 rounded-lg shadow-lg bg-slate-800 bottom-8 left-1/2 w-fit"
  >
    <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
    <div class="flex gap-4">
      <button
        v-for="object in objectType"
        :key="object.id"
        class="w-[84px] px-4 py-2 text-sm text-white transition-colors duration-200 rounded-md shadow-sm bg-slate-700 hover:bg-slate-600"
        @click="handleObjectType(object.type)"
      >
        {{ object.name }}
      </button>
    </div>
    <div>
      <button
        @click="handlePlay"
        class="min-w-[84px] px-4 py-2 text-sm text-white transition-colors duration-200 bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500"
      >
        재생
      </button>
    </div>
  </div>
</template>
