<script setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useObjectStore, useControllerStore } from '@/store'
import { TRIGGER_CONFIG } from '@/helpers/consts'

import ObjectActionList from './ObjectActionList.vue'
import ViewportActionList from './ViewportActionList.vue'
const objectStore = useObjectStore()
const controllerStore = useControllerStore()
const { objects, selectedObject } = storeToRefs(objectStore)
const { isSettingTrigger, isViewportAction } = storeToRefs(controllerStore)

const handleAddAction = () => {
  isSettingTrigger.value = true
}

/**
 * 페이지액션을 어떻게 처리하냐
 * 페이지액션(global)
 * 오브젝트액션(objects)
 */

// onMounted(() => {
//   if(selectedObject.value === null){
//     isViewportAction.value = true
//   }
// })

// watch(selectedObject, (newVal) => {
//   if (newVal === null) {
//     alert('객체를 선택해주세요')
//   }
//   console.log(newVal, 'selectedObject')
// })
</script>

<template>
  <div class="overflow-hidden text-gray-200 bg-gray-800 border border-gray-700 rounded-lg">
    <div class="flex items-center justify-between p-2 bg-gray-700 border-b border-gray-600">
      <h3 class="m-0 text-xs font-medium">애니메이션 목록</h3>
      <p class="pr-4 text-xs text-gray-400">
        {{ isViewportAction ? 'Viewport Action' : 'Object Action' }}
      </p>
    </div>
    <div
      v-if="objects.length === 0"
      class="flex flex-col items-center justify-center h-24 gap-2 p-6 m-4 text-xs text-gray-400 border border-gray-700 border-dashed rounded-md"
    >
      오브젝트가 없습니다.
    </div>
    <div v-else class="p-4">
      <button @click="handleAddAction" class="justify-center w-full btn-primary">
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

      <ObjectActionList v-if="!isViewportAction" />
      <ViewportActionList v-else />
    </div>
  </div>
</template>
