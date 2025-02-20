<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useControllerStore, useObjectStore } from '@/store'

import ActionList from './ActionList.vue'
import AnimationTrigger from './AnimationTrigger.vue'

const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const { isSettingTrigger } = storeToRefs(controllerStore)
const { selectedObject } = storeToRefs(objectStore)


</script>
<template>
  <div class="flex flex-col">
    <ActionList v-if="!isSettingTrigger" />
    <AnimationTrigger v-else />
  </div>
</template>
