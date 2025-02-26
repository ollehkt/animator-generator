<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useObjectStore, useControllerStore, usePreviewStore, useProjectsStore } from '@/store'
import { storeToRefs } from 'pinia'

import Header from '@/components/Header.vue'
import Viewport from '@/components/Viewport/index.vue'
import Layers from '@/components/Layers/index.vue'
import AnimationController from '@/components/AnimationController/index.vue'
import Toolbox from '@/components/Toolbox/index.vue'

import SourcePreview from '@/components/SourcePreview.vue'

const controllerStore = useControllerStore()
const previewStore = usePreviewStore()
const projectsStore = useProjectsStore()
const { showSourcePreview, isLayersMinimized } = storeToRefs(controllerStore)
const { objectJson } = storeToRefs(previewStore)
const route = useRoute()
const viewportRef = ref(null)

const toggleLayersMinimized = () => {
  controllerStore.toggleLayersMinimized()
}

onMounted(async () => {
  const result = await projectsStore.getProjectDetail(route.params.id)
  console.log('result', result)
})
</script>

<template>
  <div class="flex h-full pt-[50px] bg-[#1e1e1e] overflow-hidden">
    <SourcePreview v-if="showSourcePreview" />

    <Header />
    <!-- Layers -->
    <section
      class="transition-[width] duration-300 flex-shrink-0"
      :class="[isLayersMinimized ? 'w-0' : 'w-[15%]']"
    >
      <Layers />
    </section>
    <!-- Main editor area -->
    <section
      class="transition-[width] duration-300 relative border-r border-[#333333] flex-grow"
      :style="{ width: isLayersMinimized ? '85%' : '65%' }"
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
    <section class="bg-[#252526] w-[20%] min-w-[342px] flex-shrink-0">
      <div class="overflow-x-clip">
        <AnimationController />
      </div>
    </section>
  </div>
</template>
