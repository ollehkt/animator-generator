<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useObjectStore, useControllerStore, usePreviewStore, useProjectsStore } from '@/store'
import { storeToRefs } from 'pinia'

import Header from '@/components/Header.vue'
import Viewport from '@/components/Viewport/index.vue'
import Layers from '@/components/Layers/index.vue'
import AnimationController from '@/components/AnimationController/index.vue'
import Toolbox from '@/components/Toolbox/index.vue'

import ProjectSetting from '@/components/Project/ProjectSetting.vue'
import SourcePreview from '@/components/SourcePreview.vue'

const controllerStore = useControllerStore()
const previewStore = usePreviewStore()
const projectsStore = useProjectsStore()
const { showSourcePreview, isLayersMinimized } = storeToRefs(controllerStore)
const { projectDetail, showProejctSetting } = storeToRefs(projectsStore)
const route = useRoute()
const router = useRouter()
const viewportRef = ref(null)

const isLoaded = ref(false)

const toggleLayersMinimized = () => {
  controllerStore.toggleLayersMinimized()
}

onMounted(async () => {
  const result = await projectsStore.getProjectDetail(route.params.id)
  if (result.projectNo) {
    isLoaded.value = true
  } else {
    router.push('/not-found')
  }
})

onUnmounted(() => {
  projectsStore.initProjectDetail()
  // todo => 프로젝트 디테일 초기화
})
</script>

<template>
  <div v-if="isLoaded" class="flex h-full pt-[50px] bg-[#1e1e1e] overflow-hidden">
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
        <p class="font-medium">{{ projectDetail.projectName }}</p>
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
        <!-- PROJECT 설정 버튼 -->
        <button
          @click="projectsStore.toggleProjectSetting()"
          class="group absolute z-10 flex items-center justify-center w-10 h-10 border bg-[#333]/80 border-gray-700 rounded-full shadow-md group bottom-8 right-6 hover:bg-[#4F46E5]/60 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#9CA3AF"
            class="w-6 h-6 transition-transform duration-300 group-hover:rotate-180 group-hover:stroke-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
      </div>
    </section>
    <!-- Animation controller -->
    <section class="bg-[#252526] w-[20%] min-w-[342px] flex-shrink-0">
      <div class="overflow-x-clip">
        <AnimationController />
      </div>
    </section>
  </div>
  <ProjectSetting v-if="showProejctSetting" />
</template>
