<script setup>
import { ref, computed } from 'vue'

import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'
import TranslateAction from './TranslateAction.vue'
import OpacityAction from './OpacityAction.vue'
import ScaleAction from './ScaleAction.vue'

const controllerStore = useControllerStore()
const { selectedActionType } = storeToRefs(controllerStore)

const targetComponent = computed(() => {
  if (selectedActionType.value === 'translate') {
    return TranslateAction
  } else if (selectedActionType.value === 'opacity') {
    return OpacityAction
  } else if (selectedActionType.value === 'scale') {
    return ScaleAction
  }
})
</script>

<template>
  <div>
    <component :is="targetComponent" />
  </div>
</template>
