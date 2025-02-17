<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useObjectStore, useControllerStore } from '@/store'

const objectStore = useObjectStore()
const controllerStore = useControllerStore()
const { objects, selectedObject } = storeToRefs(objectStore)
const { isEditingTrigger } = storeToRefs(controllerStore)

const handleAddAction = () => {
  isEditingTrigger.value = true
}
</script>

<template>
  <div class="overflow-hidden text-gray-200 bg-gray-800 border border-gray-700 rounded-lg">
    <div class="p-2 bg-gray-700 border-b border-gray-600">
      <h3 class="m-0 text-xs font-medium">애니메이션 목록</h3>
    </div>
    <div v-if="objects.length === 0" class="flex items-center justify-center h-20 m-4 text-sm text-gray-400 border border-gray-700 border-dashed rounded-md">
      오브젝트가 없습니다.
    </div>
    <div v-else class="p-4">
      <button 
        @click="handleAddAction"
        class="justify-center w-full btn-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
        액션 추가
      </button>

      <ul v-if="selectedObject?.animations?.length" class="mt-4 space-y-2">
        <li 
          v-for="animation in selectedObject.animations" 
          :key="animation.id"
          class="p-3 transition-colors duration-200 border border-gray-700 rounded-md hover:bg-gray-700"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium">{{ animation.name }}</span>
              <span class="text-xs text-gray-400">{{ animation.type }}</span>
            </div>
            <button class="p-1 text-gray-400 rounded hover:text-white hover:bg-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
          <div class="flex gap-2 mt-2 text-xs text-gray-400">
            <span>X: {{ animation.x }}</span>
            <span>Y: {{ animation.y }}</span>
          </div>
        </li>
      </ul>
      
      <div v-else class="flex items-center justify-center h-20 mt-4 text-sm text-gray-400 border border-gray-700 border-dashed rounded-md">
        등록된 애니메이션이 없습니다
      </div>
    </div>
  </div>
</template>
