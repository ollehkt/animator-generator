<script setup>
import { ref } from 'vue'
import { useObjectStore, useControllerStore, usePreviewStore } from '@/store'
import { storeToRefs } from 'pinia'
import Header from '@/components/Header.vue'
import Viewport from '@/components/Viewport/index.vue'
import Layers from '@/components/Layers/index.vue'
import AnimationController from '@/components/AnimationController/index.vue'
import Toolbox from '@/components/Toolbox/index.vue'

import SourcePreview from '@/components/SourcePreview.vue'

const controllerStore = useControllerStore()
const previewStore = usePreviewStore()
const { showSourcePreview, isLayersMinimized } = storeToRefs(controllerStore)
const { objectJson } = storeToRefs(previewStore)

const viewportRef = ref(null)

const toggleLayersMinimized = () => {
  controllerStore.toggleLayersMinimized()
}
</script>

<template>
  <div class="flex h-full pt-[50px] bg-[#1e1e1e] overflow-hidden">
    <SourcePreview v-if="showSourcePreview" />

    <Header />
    <!-- Layers -->
    <section
      class="transition-all duration-300"
      :class="[isLayersMinimized ? 'w-[0px]' : 'w-[15%]']"
    >
      <Layers />
    </section>
    <!-- Main editor area -->
    <section
      class="w-[65%] relative border-r border-[#333333]"
      :class="[isLayersMinimized ? 'w-[calc(100%-15%)]' : 'w-[65%]']"
    >
      <!-- minimized toggle button -->
      <div
        v-if="isLayersMinimized"
        @click="toggleLayersMinimized"
        class="absolute cursor-pointer z-10 text-sm left-[18px] top-[48px] flex items-center justify-between gap-2 p-2 px-4 border bg-[#333]/80 backdrop-blur-sm border-gray-700 rounded-xl shadow-lg"
      >
        <p class="font-medium">Project Title</p>
        <button class="">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M10 7h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8zM9 7H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3zM4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        class="absolute top-0 left-0 w-full h-8 bg-[#252526] flex items-center px-4 border-b border-[#333333]"
      >
        <span class="text-[#CCCCCC] text-sm">Viewport</span>
      </div>
      <div class="h-full pt-8">
        <!-- Content area below tab -->
        <Viewport ref="viewportRef" />
        <Toolbox class="absolute transform -translate-x-1/2 bottom-4 left-1/2" />
      </div>
    </section>
    <!-- Animation controller -->
    <section class="bg-[#252526] w-[20%] min-w-[342px] shrink-0">
      <div class="overflow-x-clip">
        <AnimationController />
      </div>
    </section>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
