<script setup>
import { ref, computed } from 'vue'
import { useProjectsStore } from '@/store'
import { storeToRefs } from 'pinia'
const projectsStore = useProjectsStore()
const title = ref('')
const selectedPreset = ref('')

const { projectDetail } = storeToRefs(projectsStore)

const presets = [
  { name: 'Web Slide', width: 1280, height: 720 },
  { name: 'Card News', width: 800, height: 800 },
  { name: 'Mobile', width: 720, height: 1080 },
  { name: 'TV Standard', width: 1200, height: 900 },
]

const selectPreset = (preset) => {
  selectedPreset.value = preset.name
}

const saveProjectSettings = async () => {
  if (!title.value) return alert('프로젝트 이름을 입력해주세요.')
  if (!selectedPreset.value) return alert('프로젝트 프리셋을 선택해주세요.')

  const params = {
    projectName: title.value,
    canvas: {
      width: presets.find((preset) => preset.name === selectedPreset.value).width,
      height: presets.find((preset) => preset.name === selectedPreset.value).height,
    },
    jsonData: {},
  }
  try {
    const result =  await projectsStore.postProject(params)
    console.log("result", result)
    if(result.projectNo) {

      projectsStore.toggleProjectSetting()
      projectsStore.getProjectList()
    }
  } catch (error) {
    console.error(error)
  }
}

const isEditSetting = computed(() => {
  return !!projectDetail.value
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] shadow-lg bg-black/20 bg-opacity-70 text-gray-300">
    <div class="rounded-lg w-[540px] overflow-hidden bg-gray-800">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 bg-gray-900 rounded-t-lg">
        <h2 class="font-semibold">프로젝트 설정</h2>
        {{ isEditSetting }}
        <button
          @click="projectsStore.toggleProjectSetting"
          class="text-gray-400 transition-colors hover:text-white"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6 bg-gray-800">
        <!-- Project Title -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">프로젝트 이름</label>
          <input
            type="text"
            v-model="title"
            class="w-full !h-10 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded"
            placeholder="Enter project title"
          />
        </div>

        <!-- Presets -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">프로젝트 프리셋</label>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="preset in presets"
              :key="preset.name"
              @click="selectPreset(preset)"
              class="p-4 transition-colors border rounded-lg cursor-pointer hover:border-indigo-500"
              :class="{ 'border-indigo-500 bg-indigo-900': selectedPreset === preset.name, 'border-gray-600': selectedPreset !== preset.name }"
            >
              <div class="mb-2 bg-gray-700 rounded aspect-video"></div>
              <p class="font-medium text-gray-300">{{ preset.name }}</p>
              <p class="text-sm text-gray-500">{{ preset.width }} x {{ preset.height }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-6 p-4 bg-gray-900 border-t border-gray-700">
        <button
          @click="projectsStore.toggleProjectSetting"
          class="px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          닫기
        </button>
        <button @click="saveProjectSettings" class="px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-500">프로젝트 생성</button>
      </div>
    </div>
  </div>
</template>
