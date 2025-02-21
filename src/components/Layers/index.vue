<script setup>
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

import CurrentObject from './CurrentObject.vue'
import ObjectList from './ObjectList.vue'
import MediaList from './MediaList.vue'

const controllerStore = useControllerStore()
const { isLayersMinimized } = storeToRefs(controllerStore)

const minimizeLayers = () => {
  controllerStore.toggleLayersMinimized()
}
</script>

<template>
  <div :class="[isLayersMinimized ? 'opacity-0' : 'opacity-100']">
    <div class="h-8 bg-[#1E1E1E] flex items-center px-4 border-b border-[#2A2A2A]">
      <span class="text-[#CCC] text-sm">Layers</span>{{  }}
      <button 
        @click="minimizeLayers"
        class="ml-auto group"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            class="fill-[#CCC] group-hover:fill-white"
            fill-rule="evenodd"
            d="M10 7h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8zM9 7H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3zM4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
    <section class="space-y-2">
      <CurrentObject />
      <div>
        <ObjectList />
        <MediaList />
      </div>
    </section>
  </div>
</template>
