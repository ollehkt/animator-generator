<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/store'
import { storeToRefs } from 'pinia'

// TEMP GIF
import a0 from '@/assets/a0.gif'
import a1 from '@/assets/a1.gif'
import a2 from '@/assets/a2.gif'
import a3 from '@/assets/a3.gif'

const projectsStore = useProjectsStore()
const title = ref('')
const selectedPreset = ref('')
const titleInputRef = ref(null)

const { projectDetail } = storeToRefs(projectsStore)

const isEditSetting = computed(() => {
  return !!projectDetail.value
})

const presets = [
  { name: 'Web Slide', width: 1280, height: 720, image: a0 },
  { name: 'Card News', width: 800, height: 800, image: a1 },
  { name: 'Mobile', width: 720, height: 1080, image: a2 },
  { name: 'TV Standard', width: 1200, height: 900, image: a3 },
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
      preset: selectedPreset.value,
      width: presets.find((preset) => preset.name === selectedPreset.value).width,
      height: presets.find((preset) => preset.name === selectedPreset.value).height,
    },
    jsonData: {},
  }
  try {
    const result = await projectsStore.postProject(params)
    console.log('result', result)
    if (result.projectNo) {
      projectsStore.toggleProjectSetting()
      projectsStore.getProjectList()
    }
  } catch (error) {
    console.error(error)
  }
}

const updateProjectSettings = async (e) => {
  if (!title.value) {
    alert('프로젝트 이름을 입력해주세요.')
    titleInputRef.value.focus()
    return
  }

  const params = {
    projectName: title.value,
    canvas: {
      preset: selectedPreset.value,
      width: presets.find((preset) => preset.name === selectedPreset.value).width,
      height: presets.find((preset) => preset.name === selectedPreset.value).height,
    },
    // jsonData: {},
  }
  try {
    await projectsStore.updateProject(projectDetail.value.projectNo, params, true)

  } catch (error) {
    console.error(error)
  }
}

const handleButtonClick = () => {
  if (isEditSetting.value) {
    updateProjectSettings()
  } else {
    saveProjectSettings()
  }
}

onMounted(() => {
  if (!!projectDetail.value) {
    title.value = projectDetail.value.projectName
    selectedPreset.value = projectDetail.value.canvas.preset
  }
  if (!title.value) {
    titleInputRef.value.focus()
  }
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] shadow-lg bg-black/20 bg-opacity-70 text-gray-300"
  >
    <div class="rounded-lg w-[540px] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 bg-gray-700 rounded-t-lg">
        <h2 class="flex items-center gap-1 font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 transition-transform duration-300 group-hover:rotate-180 group-hover:stroke-white"
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
          프로젝트 설정
        </h2>
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
            ref="titleInputRef"
            class="w-full !h-10 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
              class="p-4 transition-colors border rounded-lg cursor-pointer group hover:border-indigo-500"
              :class="{
                'border-indigo-500 bg-indigo-900': selectedPreset === preset.name,
                'border-gray-600': selectedPreset !== preset.name,
              }"
            >
              <div
                class="flex items-center justify-center mb-2 1bg-gray-700 !bg-[#E6ECF0] rounded aspect-video"
              >
                <img :src="preset.image" alt="" class="transition-all group-hover:scale-110" />
              </div>
              <p class="font-medium text-gray-300">{{ preset.name }}</p>
              <p class="text-sm text-gray-500">{{ preset.width }} x {{ preset.height }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-6 p-4 bg-gray-700 border-t border-gray-600">
        <button
          @click="projectsStore.toggleProjectSetting"
          class="px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          닫기
        </button>
        <button
          @click="handleButtonClick"
          class="px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-500"
        >
          {{ isEditSetting ? '프로젝트 수정' : '프로젝트 생성' }}
        </button>
      </div>
    </div>
  </div>
</template>
