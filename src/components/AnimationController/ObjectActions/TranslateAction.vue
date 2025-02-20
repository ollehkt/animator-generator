<script setup>
import { ref, watch } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const controllerStore = useControllerStore()
const objectStore = useObjectStore()

const { targetPOS, animationConfig } = storeToRefs(controllerStore)
const { selectedObject } = storeToRefs(objectStore)

const isSettingStartFrom = ref(false)
const startFrom = ref({
  x: 0,
  y: 0,
})

const toggleStartFrom = () => {
  isSettingStartFrom.value = !isSettingStartFrom.value
  if (!isSettingStartFrom.value) {
    startFrom.value = {
      x: 0,
      y: 0,
    }
  }
}

// Add computed properties to safely handle object values

// const objectX = computed({
//   get: () => selectedObject.value?.x ?? 0,
//   set: (value) => {
//     if (selectedObject.value) {
//       selectedObject.value.x = value
//     }
//   }
// })

// const objectY = computed({
//   get: () => selectedObject.value?.y ?? 0,
//   set: (value) => {
//     if (selectedObject.value) {
//       selectedObject.value.y = value
//     }
//   }
// })

watch(startFrom, (newVal) => {
  if (selectedObject.value) {
    selectedObject.value.position.x = newVal.x
    selectedObject.value.position.y = newVal.y
  }
}, { deep: true })
</script>

<template>
  <!-- TRANSLATE || ROTATE -->
  <div class="flex flex-col gap-4">
    <div class="flex gap-2">
      <p class="flex flex-col gap-2 overflow-hidden">
        <label class="pl-1 text-xs text-gray-400">X</label>
        <input
          type="number"
          v-model="animationConfig.x"
          class="input-dark"
          :disabled="!selectedObject"
        />
      </p>
      <p class="flex flex-col gap-2 overflow-hidden">
        <label class="pl-1 text-xs text-gray-400">Y</label>
        <input
          type="number"
          v-model="animationConfig.y"
          class="input-dark"
          :disabled="!selectedObject"
        />
      </p>
    </div>
    <!-- 시작 위치 설정 -->
    <div>
      <div class="flex gap-2 mb-1">
        <p class="pl-1 text-xs text-gray-400">시작 위치 설정</p>
        <label
          :class="isSettingStartFrom ? 'bg-gray-800' : 'bg-gray-600'"
          class="relative flex items-center w-8 h-4 border border-gray-700 cursor-pointer rounded-2xl"
          for="loop"
          @click.prevent="toggleStartFrom"
        >
          <input v-model="isSettingStartFrom" class="hidden" name="loop" type="checkbox" />
          <div
            :class="isSettingStartFrom ? 'translate-x-[15px] bg-[#825feb]' : 'translate-x-[0px]'"
            class="w-3 h-3 rounded-full absolute top-[1px] transition-all duration-300 left-[1px] bg-gray-400"
          ></div>
        </label>
      </div>
      <div
        class="box-border flex gap-2"
        :class="
          isSettingStartFrom ? 'border border-dashed border-[#825feb]' : 'border border-transparent'
        "
      >
        <p class="flex flex-col gap-2 overflow-hidden">
          <label class="pl-1 text-xs text-gray-400">X</label>
          <input
            type="number"
            v-model="startFrom.x"
            class="input-dark"
            :disabled="!isSettingStartFrom"
          />
        </p>
        <p class="flex flex-col gap-2 overflow-hidden">
          <label class="pl-1 text-xs text-gray-400">Y</label>
          <input
            type="number"
            v-model="startFrom.y"
            class="input-dark"
            :disabled="!isSettingStartFrom"
          />
        </p>
      </div>
    </div>
  </div>
</template>
