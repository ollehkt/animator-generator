<script setup>
import { ref } from 'vue'
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

const controllerStore = useControllerStore()
const { activeTab } = storeToRefs(controllerStore)

const tabs = ref([
  {
    // 객체속성
    id: 'property',
    label: '객체',
  },

  {
    // 코드 => 코드에 따라 임의 객체 만들고 애니메이션 재생
    id: 'action',
    label: '액션',
  },
])

const changeTab = (tab) => {
  activeTab.value = tab.id
}
</script>
<template>
  <div class="flex flex-col mb-4">
    <div class="flex gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex-1 px-3 py-2 text-sm font-medium text-center rounded-md"
        :class="{ 'bg-[#4f46e5] text-white': tab.id === activeTab, 'bg-[#2D2D2D] text-[#CCCCCC]': tab.id !== activeTab }"
        @click="changeTab(tab)"
      >
        {{ tab.label }}
      </button>
    </div>
  
  </div>
</template>
