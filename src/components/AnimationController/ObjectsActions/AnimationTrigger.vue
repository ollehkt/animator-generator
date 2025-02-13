<script setup>
import { ref } from 'vue'
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

const controllerStore = useControllerStore()
// const {  } = storeToRefs(controllerStore)
</script>
<template>
  <div class="overflow-hidden text-gray-200 bg-gray-800 border border-gray-700 rounded-lg">
    <div class="p-2 bg-gray-700 border-b border-gray-600">
      <h3 class="m-0 text-xs font-medium">트리거</h3>
    </div>
    <div class="p-4">
      
    </div>
  </div>
</template>
