<script setup>
import { ref } from 'vue'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'
import Header from '@/components/Header.vue'
import Viewport from '@/components/Viewport/index.vue'
import Layers from '@/components/Layers/index.vue'
import AnimationController from '@/components/AnimationController/index.vue'
import Toolbox from '@/components/Toolbox/index.vue'

import SourcePreview from '@/components/SourcePreview.vue'

const controllerStore = useControllerStore()
const { showSourcePreview } = storeToRefs(controllerStore)

const viewportRef = ref(null)
</script>

<template>
  <div class="flex h-full pt-[50px] bg-[#1e1e1e] overflow-hidden">
    <SourcePreview v-if="showSourcePreview" />
    <Header />
    <section class="w-[15%]">
      <Layers />
    </section>
    <section class="w-[65%] relative border-r border-[#333333]">
      <!-- Main editor area -->
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
    <section class="w-[20%] bg-[#252526]">
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
