<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useControllerStore, useObjectStore } from '@/store'
import ControllerTab from './ControllerTab.vue'
import Action from './Action/index.vue'
import Property from './Property/index.vue'

const objectStore = useObjectStore()
const controllerStore = useControllerStore()
const { selectedObject } = storeToRefs(objectStore)
const { activeTab } = storeToRefs(controllerStore)

const targetComponent = computed(() => {
  return activeTab.value === 'property' ? Property : Action
})
</script>
<template>
  <div class="h-8 bg-[#2D2D2D] flex items-center px-4 border-b border-[#333333]">
    <span class="text-[#CCCCCC] text-sm">Animation Controls</span>
  </div>
  <div class="flex flex-col gap-2 p-4 overflow-y-auto h-[calc(100vh-82px)]">
      <ControllerTab />
      <component :is="targetComponent" />
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
</style>
