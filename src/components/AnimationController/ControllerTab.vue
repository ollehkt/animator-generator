<script setup>
import { ref } from 'vue'
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

const controllerStore = useControllerStore()
const { activeTab } = storeToRefs(controllerStore)

const tabs = ref([
  {
    // 객체속성
    id: 'object',
    label: 'Object',
  },

  {
    // 코드로 추출
    id: 'code',
    label: 'Code',
  },
  {
    // 코드 => 코드에 따라 임의 객체 만들고 애니메이션 재생
    id: 'preview',
    label: 'Preview',
  },
])

const changeTab = (tab) => {
  activeTab.value = tab
}
</script>
<template>
  <div class="px-10 text-white">
    <slot></slot>
    <div class="flex items-center gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-2 py-1 rounded-md"
        :class="{ 'bg-blue-500 text-white': tab.id === activeTab?.id }"
        @click="changeTab(tab)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
