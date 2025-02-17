<script setup>
import { ref, watch, computed } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import { EASING_OPTIONS } from '@/helpers/consts'

import TranslateAction from './TranslateAction.vue'
import OpacityAction from './OpacityAction.vue'
import CommonProperty from './CommonProperty.vue'
import ScaleAction from './ScaleAction.vue'

import PageAction from './PageAction.vue'

const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const { selectedActionType, animationConfig, isEditingTrigger } = storeToRefs(controllerStore)

const isPageAction = computed(() => {
  return selectedActionType.value === 'url'
})

watch(selectedActionType, (newType) => {
  // Reset values when animation type changes
  if (newType === 'translate' || newType === 'rotate') {
    animationConfig.value.x = 0
    animationConfig.value.y = 0
  } else if (newType === 'opacity') {
    animationConfig.value.opacityStart = 1
    animationConfig.value.opacityEnd = 0
  } else if (newType === 'scale') {
    animationConfig.value.scaleStart = 1
    animationConfig.value.scaleEnd = 0
  }
})
</script>

<template>
  <!-- action 타입에 따라 페이지 액션, 객체 액션, 미디어 액션 선택 -->
  <div class="overflow-hidden text-gray-200 bg-gray-800">
    <div class="flex flex-col p-4 mt-2 gap-y-4">
      <PageAction v-if="isPageAction" />
      <TranslateAction
        v-if="selectedActionType === 'translate' || selectedActionType === 'rotate'"
      />
      <OpacityAction v-if="selectedActionType === 'opacity'" />
      <ScaleAction v-if="selectedActionType === 'scale'" />

      <CommonProperty />
    </div>
  </div>
</template>
