<script setup>
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

const controllerStore = useControllerStore()
const { selectedActionType } = storeToRefs(controllerStore)

const handleKeyDown = (e) => {
  if (e.key === 'Backspace') {
    e.stopPropagation()
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="flex flex-col gap-2">
      <label class="pl-1 text-xs text-gray-400">{{selectedActionType}}</label>
      <input type="text" class="input-dark" @keydown="handleKeyDown" />
    </p>
  </div>
</template>
