<script setup>
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

const controllerStore = useControllerStore()
const { animationConfig } = storeToRefs(controllerStore)
</script>
<template>
  <div class="flex flex-col gap-2">
    <p class="flex flex-col">
      <label class="mb-1">Scale Start with</label>
      <input type="number" v-model="animationConfig.scaleStart" class="input-dark" />
    </p>
    <p class="flex flex-col">
      <label class="mb-1">Scale End with</label>
      <input type="number" v-model="animationConfig.scaleEnd" class="input-dark" />
    </p>
  </div>
</template>
