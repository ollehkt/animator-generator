<script setup>
import { ref, watch, computed } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import { TRIGGER_CONFIG } from '@/helpers/consts'

import PageAction from '../PageAction.vue'
import ObjectAction from '../ObjectActions/index.vue'
import MediaAction from '../MediaActions/index.vue'
import CommonProperty from './CommonProperty.vue'

const controllerStore = useControllerStore()
const { selectedActionType, animationConfig } = storeToRefs(controllerStore)

const isPageAction = computed(() =>
  TRIGGER_CONFIG.actions.value.pageActions.value
    .map((action) => action.value)
    .includes(selectedActionType.value)
)

const isObjectAction = computed(() =>
  TRIGGER_CONFIG.actions.value.objectActions.value
    .map((action) => action.value)
    .includes(selectedActionType.value)
)

const isMediaAction = computed(() =>
  TRIGGER_CONFIG.actions.value.mediaActions.value
    .map((action) => action.value)
    .includes(selectedActionType.value)
)

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
  <div class="flex flex-col p-4 mt-4 text-gray-200 bg-gray-800 border-t border-gray-700 gap-y-4">
    <PageAction v-if="isPageAction" />
    <ObjectAction v-if="isObjectAction" />
    <MediaAction v-if="isMediaAction" />
    <CommonProperty />
  </div>
</template>
