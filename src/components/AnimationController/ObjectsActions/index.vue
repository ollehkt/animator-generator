<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useControllerStore } from '@/store'

import ObjectProperty from './ObjectProperty.vue'
import ActionList from './ActionList.vue'
import AnimationTrigger from './AnimationTrigger.vue'

const controllerStore = useControllerStore()
const { isEditingTrigger } = storeToRefs(controllerStore)




</script>
<template>
  <div class="flex flex-col gap-6">
    <!-- <ObjectProperty /> -->
    <ActionList v-if="!isEditingTrigger" />
    <AnimationTrigger v-if="isEditingTrigger" />
  </div>
</template>
