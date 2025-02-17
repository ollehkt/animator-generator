<script setup>
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'
const controllerStore = useControllerStore()
const { targetPOS } = storeToRefs(controllerStore)
</script>

<template>
  <!-- TRANSLATE || ROTATE -->
  <div class="flex flex-col">
    <div class="flex gap-2">
      <p class="flex flex-col w-1/2 gap-2">
        <label class="pl-1 text-xs text-gray-400">X</label>
        <input 
          type="number" 
          v-model="targetPOS.x" 
          class="input-dark" 
        />
      </p>
      <p class="flex flex-col w-1/2 gap-2">
        <label class="pl-1 text-xs text-gray-400">Y</label>
        <input 
          type="number" 
          v-model="targetPOS.y" 
          class="input-dark" 
        />
      </p>
    </div>
  </div>
</template>
