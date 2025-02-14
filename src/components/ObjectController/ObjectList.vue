<script setup>
import { storeToRefs } from 'pinia'
import { useObjectStore } from '@/store'

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
  <!-- LIST -->
  <ul
    v-if="objects.length > 0"
    class="text-[#E5E5E5] bg-[#262626] border-t border-[#2A2A2A] rounded-sm"
  >
    <li
      v-for="object in objects"
      :key="object.id"
      @click="selectThisObject(object)"
      class="p-2 py-3 transition-all duration-200 shadow-inner cursor-pointer hover:bg-[#2F2F2F]"
      :class="{ 'bg-[#323232] text-white': selectedObject?.id === object.id }"
    >
      <div class="flex items-center gap-2">
        <p
          class="flex items-center justify-center text-sm w-5 h-5 bg-[#404040] text-[#E5E5E5] rounded-sm"
          :class="{ '!bg-[#4F46E5] text-white': selectedObject?.id === object.id }"
        >
          {{ getObjectIcon(object.type) }}
        </p>
        <span>{{ object.name }}</span>
      </div>
    </li>
  </ul>
  <p v-else class="p-4 mx-3 text-xs text-center text-gray-400 border border-gray-700 border-dashed rounded-md">오브젝트가 없습니다.</p>
</template>
