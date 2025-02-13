<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useControllerStore, useObjectStore } from '@/store'

import ControllerTab from './ControllerTab.vue'
import ObjectsActions from './ObjectsActions/index.vue'
const controllerStore = useControllerStore()
const { activeTab } = storeToRefs(controllerStore)

const targetComponent = computed(() => {
  return activeTab.value.id === 'object' ? Objects : activeTab.value.id === 'code' ? Code : Preview
})
</script>
<template>
  <div class="flex flex-col gap-2 overflow-y-auto">
    <ObjectsActions />
    <!-- <ControllerTab /> 추후 속성 액션 탭 추가되면 사용-->
    <!-- <component :is="targetComponent" /> -->
  </div>
</template>
