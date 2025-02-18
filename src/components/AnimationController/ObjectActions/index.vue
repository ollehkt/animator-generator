<script setup>
import { ref, computed } from 'vue'

import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'
import TranslateAction from './TranslateAction.vue'
import RotateAction from './RotateAction.vue'
import OpacityAction from './OpacityAction.vue'
import ScaleAction from './ScaleAction.vue'
import SizeAction from './SizeAction.vue'
const controllerStore = useControllerStore()
const { selectedActionType } = storeToRefs(controllerStore)

const targetComponent = computed(() => {
  if (selectedActionType.value === 'translate') {
    return TranslateAction
  } else if (selectedActionType.value === 'rotate') {
    return RotateAction
  } else if (selectedActionType.value === 'opacity') {
    return OpacityAction
  } else if (selectedActionType.value === 'scale') {
    return ScaleAction
  } else if (selectedActionType.value === 'size') {
    return SizeAction
  }
})
</script>

<template>
  <component :is="targetComponent" />
</template>
