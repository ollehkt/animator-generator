<script setup>
import { storeToRefs } from 'pinia'
import { useObjectStore } from '@/store'

const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)

import ObjectPreview from './ObjectPreview.vue'
</script>
<template>
  <!-- 현재요소 -->
  <div class="p-6 px-8 space-y-2">
    <ObjectPreview />
    <div class="flex items-center gap-2 mx-auto">
      <label class="block text-xs text-[#9CA3AF]">선택 요소</label>
      <p class="text-xs">{{ selectedObject?.name || '선택된 요소가 없습니다.' }}</p>
    </div>

    <div class="space-y-1">
      <label class="block text-xs text-[#9CA3AF]">캔버스 기준 좌표</label>
      <div class="flex gap-4 text-xs">
        <span>X: {{ Math.round(selectedObject?.x) || '-' }}</span>
        <span>Y: {{ Math.round(selectedObject?.y) || '-' }}</span>
      </div>
    </div>
  </div>
</template>
