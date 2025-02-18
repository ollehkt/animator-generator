<script setup>
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

const controllerStore = useControllerStore()
const { selectedActionType } = storeToRefs(controllerStore)

</script>

<template>
  <div v-if="selectedActionType === 'url'" class="flex flex-col gap-4">
    <p class="flex flex-col gap-2">
      <label class="pl-1 text-xs text-gray-400">{{ selectedActionType.toUpperCase() }}</label>
      <input type="text" class="input-dark" />
    </p>
  </div>
</template>
