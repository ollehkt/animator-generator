<script setup>
import { ref } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
const { objects, selectedObject } = storeToRefs(objectStore)

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

const selectThisObject = (object) => {
  objectStore.selectObject(object.id)
}
</script>

<template>
  <div>
    <div class="h-8 bg-[#2D2D2D] flex items-center px-4 border-b border-[#333333]">
      <span class="text-[#CCCCCC] text-sm">Objects</span>
    </div>
    <section class="space-y-2">
      <!-- 현재요소 -->
      <div class="p-6 px-8 space-y-2">
        
        <!-- preview -->
        <div class="w-[180px] h-[180px] mx-auto border mb-4 border-[#333333] rounded-sm bg-[#1A1A1A] shadow-inner flex items-center justify-center">
          <div class="text-[#666666] text-sm">Preview</div>
        </div>
        <div class="flex items-center gap-2 mx-auto">
          <label class="block text-xs text-gray-400">선택 요소</label>
          <p class="text-xs">{{ selectedObject?.name || '선택된 요소가 없습니다.' }}</p>
        </div>
  
        <div class="space-y-1">
          <label class="block text-xs text-gray-400">캔버스 기준 좌표</label>
          <div class="flex gap-4 text-xs">
            <span>X: {{ Math.round(selectedObject?.x) || '-' }}</span>
            <span>Y: {{ Math.round(selectedObject?.y) || '-' }}</span>
          </div>
        </div>
      </div>
      <!-- LIST -->
      <ul v-if="objects.length > 0" class=" text-[#CCCCCC] bg-gray-700 border-t border-[#333333] rounded-sm">
        <li 
          v-for="object in objects" :key="object.id"
          @click="selectThisObject(object)"
          class="p-2 shadow-inner cursor-pointer hover:text-white hover:bg-gray-800"
          :class="{ 'bg-gray-800': selectedObject?.id === object.id }"
        >
          <div class="flex items-center gap-2">
            <p class="flex items-center justify-center text-sm w-5 h-5 bg-gray-600 text-[#CCC] rounded-sm">
              {{ getObjectIcon(object.type) }}
            </p>
            <span>{{ object.name }}</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
