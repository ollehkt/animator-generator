<script setup>
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

const controllerStore = useControllerStore()
const { animationConfig } = storeToRefs(controllerStore)
</script>
<template >
  <div class="flex flex-col gap-4">
    <p class="flex flex-col gap-2">
      <label class="pl-1 text-xs text-gray-400">Opacity Start with</label>
      <input type="number" v-model="animationConfig.opacityStart" class="input-dark" />
    </p>
    <p class="flex flex-col gap-2">
      <label class="pl-1 text-xs text-gray-400">Opacity End with</label>
      <input type="number" v-model="animationConfig.opacityEnd" class="input-dark" />
    </p>
  </div>
</template>
