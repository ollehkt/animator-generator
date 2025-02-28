<script setup>
import { ref } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import DefalutStyle from './DefalutStyle.vue'
const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)
</script>

<template>
  <div class="overflow-hidden text-gray-200 bg-gray-800 border border-gray-700 rounded-lg">
    <div class="flex items-center justify-between p-2 bg-gray-700 border-b border-gray-600">
      <h3 class="m-0 text-xs font-medium">객체 편집</h3>
    </div>
    <div class="p-4">
      <DefalutStyle v-if="selectedObject" />
      <div
        v-else
        class="flex items-center justify-center h-20 text-xs text-gray-400 border border-gray-700 border-dashed rounded-md"
      >
        선택된 객체가 없습니다.
      </div>
    </div>
  </div>
</template>
