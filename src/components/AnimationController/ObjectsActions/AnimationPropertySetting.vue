<script setup>
import { ref, watch } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import { EASING_OPTIONS } from '@/helpers/consts'

import TranslateAction from './TranslateAction.vue'
import OpacityAction from './OpacityAction.vue'
import CommonProperty from './CommonProperty.vue'
import ScaleAction from './ScaleAction.vue'

const controllerStore = useControllerStore()
const objectStore = useObjectStore()

const { selectedActionType, animationConfig } = storeToRefs(controllerStore)
const easingOptions = ref(EASING_OPTIONS)

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
  <div class="overflow-hidden text-gray-200 bg-gray-800 rounded-lg">
    <div class="flex flex-col p-4 mt-2 gap-y-2">
      <TranslateAction
        v-if="selectedActionType === 'translate' || selectedActionType === 'rotate'"
      />
      <OpacityAction v-if="selectedActionType === 'opacity'" />
      <ScaleAction v-if="selectedActionType === 'scale'" />

      <CommonProperty />
    </div>
  </div>
</template>

