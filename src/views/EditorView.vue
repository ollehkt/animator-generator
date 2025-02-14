<script setup>
import { ref } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import Header from '@/components/Header.vue'
import Viewport from '@/components/Viewport/index.vue'
import AnimationController from '@/components/AnimationController/index.vue'
import ObjectToolBar from '@/components/ObjectToolBar.vue'

const objectStore = useObjectStore()
const viewportRef = ref(null)
</script>

<template>
  <div class="flex h-full pt-[50px] bg-[#1e1e1e] overflow-hidden">
    <Header />
    <div class="w-[75%] relative border-r border-[#333333]">
      <!-- Main editor area -->
      <div
        class="absolute top-0 left-0 w-full h-8 bg-[#252526] flex items-center px-4 border-b border-[#333333]"
      >
        <span class="text-[#CCCCCC] text-sm">Preview</span>
      </div>
      <div class="h-full pt-8">
        <!-- Content area below tab -->
        <Viewport ref="viewportRef" class="bg-[#2D2D2D]" />
        <ObjectToolBar class="absolute transform -translate-x-1/2 bottom-4 left-1/2" />
      </div>
    </div>
    <div class="w-[25%] bg-[#252526]">
      <!-- Side panel -->
      <div class="h-8 bg-[#2D2D2D] flex items-center px-4 border-b border-[#333333]">
        <span class="text-[#CCCCCC] text-sm">Animation Controls</span>
      </div>
      <div class="p-6 px-8 overflow-x-clip overflow-y-auto h-[calc(100vh-66px)]">
        <AnimationController />
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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
</style>
