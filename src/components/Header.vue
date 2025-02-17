<script setup>
import { useRouter } from 'vue-router'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import { OBJECT_ALIGN } from '@/helpers/consts'

const router = useRouter()
const objectStore = useObjectStore()
const controllerStore = useControllerStore()
const { showSourcePreview } = storeToRefs(controllerStore)
const { selectedObject } = storeToRefs(objectStore)

const openPreview = () => {
  window.open('/preview', '_blank')
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
</script>
<template>
  <header
    class="h-[50px] absolute top-0 left-0 w-full border-b border-[#000] flex items-center justify-end gap-6 px-10"
  >
    <h1 class="mr-auto text1-lg">🍟L🏀O⛱️GO</h1>
    <!-- ALLIGN -->
    <div class="absolute flex items-center gap-4 mx-auto -translate-x-1/2 left-1/2">
      <button
        v-for="align in OBJECT_ALIGN.slice(0, 3)"
        :key="align.id"
        class="mini-btn !bg-transparent"
        @click="handleAlign(align.type)"
        v-html="align.icon"
      ></button>
      <p class="w-[2px] h-4 bg-gray-700 rounded-full"></p>
      <button
        v-for="align in OBJECT_ALIGN.slice(3)"
        :key="align.id"
        class="mini-btn !bg-transparent"
        @click="handleAlign(align.type)"
        v-html="align.icon"
      ></button>
    </div>
    <!--  -->
    <slot></slot>
    <button
      @click="showSourcePreview = true"
      class="text-[#CCCCCC] flex items-center gap-1 text-xs group hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#CCCCCC"
        class="w-4 h-4 group-hover:stroke-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      </svg>
      소스코드
    </button>
    <button
      @click="openPreview"
      class="text-[#CCCCCC] flex items-center gap-1 text-xs group hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#CCCCCC"
        class="w-4 h-4 group-hover:stroke-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
        />
      </svg>
      미리보기
    </button>
  </header>
</template>
