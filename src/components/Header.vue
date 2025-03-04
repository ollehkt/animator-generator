<script setup>
import { useRouter } from 'vue-router'
import { useControllerStore, useObjectStore, useProjectsStore, useDataStore } from '@/store'
import { storeToRefs } from 'pinia'
import { OBJECT_ALIGN } from '@/helpers/consts'

const router = useRouter()
const objectStore = useObjectStore()
const controllerStore = useControllerStore()
const projectsStore = useProjectsStore()
const dataStore = useDataStore()
const { showSourcePreview } = storeToRefs(controllerStore)
const { selectedObject } = storeToRefs(objectStore)
const { objects } = storeToRefs(objectStore)

const headerButtons = [
  {
    id: 'setting',
    label: 'Setting',
    koreanLabel: '프로젝트 설정',
    action: () => projectsStore.toggleProjectSetting(),
    icon: 'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  },
  {
    id: 'save',
    label: 'Save',
    koreanLabel: '저장하기',
    action: () => handleSave(),
    icon: 'm9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z',
  },
  {
    id: 'load',
    label: 'Load',
    koreanLabel: '불러오기',
    action: () => loadProject(),
    icon: 'M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z',
  },
  {
    id: 'source',
    label: 'Source Code',
    koreanLabel: '소스코드',
    action: () => (showSourcePreview.value = true),
    icon: 'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',
  },
  {
    id: 'preview',
    label: 'Preview',
    koreanLabel: '미리보기',
    action: () => openPreview(),
    icon: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z',
  },
]

const handleSave = () => {
  projectsStore.saveCurrentProject()
}

const loadProject = () => {
  router.push('/project')
}

const openPreview = () => {
  if (objects.value && objects.value.length > 0) {
    return router.push('/preview')
  }

  return alert('미리보기할 객체가 없습니다.')
}

const handleAlign = (type) => {
  objectStore.alignObject(type)
}
</script>
<template>
  <header
    class="h-[50px] absolute top-0 left-0 w-full border-b border-[#000] flex items-center justify-end gap-6 px-10"
  >
    <!-- <h1 class="mr-auto text-lg">🍟L🏀O⛱️GO</h1> -->
    <h1 class="mr-auto text-lg"><img src="@/assets/svg/logo.svg" alt="logo" class="" /></h1>
    <!-- ALLIGN -->
    <div class="absolute flex items-center gap-4 mx-auto -translate-x-1/2 left-1/2">
      <button
        v-for="align in OBJECT_ALIGN.slice(0, 3)"
        :key="align.id"
        class="mini-btn !bg-transparent text-[#ccc] hover:text-white"
        @click="handleAlign(align.type)"
        v-html="align.icon"
      ></button>
      <p class="w-[2px] h-4 bg-gray-700 rounded-full"></p>
      <button
        v-for="align in OBJECT_ALIGN.slice(3)"
        :key="align.id"
        class="mini-btn !bg-transparent text-[#ccc] hover:text-white"
        @click="handleAlign(align.type)"
        v-html="align.icon"
      ></button>
    </div>
    <slot></slot>
    <button
      v-for="button in headerButtons"
      :key="button.id"
      @click="button.action()"
      class="text-[#CCCCCC] flex items-center gap-1 text-xs group hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        :stroke="'#CCCCCC'"
        class="w-4 h-4 group-hover:stroke-white"
      >
        <path stroke-linecap="round" stroke-linejoin="round" :d="button.icon" />
      </svg>
      {{ button.koreanLabel }}
    </button>
  </header>
</template>
