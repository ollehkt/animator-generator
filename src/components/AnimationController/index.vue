<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useControllerStore, useObjectStore } from '@/store'
import Default from './Default/index.vue'
const controllerStore = useControllerStore()
const { activeTab } = storeToRefs(controllerStore)

// const targetComponent = computed(() => {
//   return activeTab.value.id === 'object' ? Objects : activeTab.value.id === 'code' ? Code : Preview
// })
</script>
<template>
  <div class="h-8 bg-[#2D2D2D] flex items-center px-4 border-b border-[#333333]">
    <span class="text-[#CCCCCC] text-sm">Animation Controls</span>
  </div>
  <div class="flex flex-col gap-2 p-4 overflow-y-auto h-[calc(100vh-82px)]">
    <!-- Defalut: 액션리스트, 트리거 설정창 -->
    <Default />
    <!-- <component :is="targetComponent" /> 속성 | 액션 탭이 생길경우 사용-->
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
</style>
