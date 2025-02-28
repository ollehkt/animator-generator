<script setup>
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)
</script>
<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label class="pl-1 text-xs text-gray-400">색상</label>
      <p class="flex items-center gap-2">
        <input
          type="color"
          v-model="selectedObject.fillStyle"
          class="cursor-pointer w-10 !p-0 input-color"
        />
        <span class="font-mono text-xs text-gray-400 cursor-pointer">
          {{ selectedObject.fillStyle }}
        </span>
      </p>
    </div>
  </section>
</template>
