<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/store'
import ProjectSetting from './ProjectSetting.vue'

const router = useRouter()
const projectsStore = useProjectsStore()

const { projects, showProejctSetting } = storeToRefs(projectsStore)

onMounted(async () => {
  await projectsStore.getProjectList()
})
</script>
<template>
  
  <div
    v-if="projects.totalCount > 0"
    class="grid grid-cols-[repeat(auto-fill,minmax(374px,1fr))] auto-rows-max gap-6"
  >
    <div
      v-for="project in projects"
      :key="project.id"
      class="p-6 transition-colors border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-700"
      @click="handleProjectClick(project.id)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-8 h-8 mb-4 text-gray-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
        />
      </svg>

      <div class="flex flex-col gap-3 project-info">
        <h3 class="text-xl font-semibold text-gray-100">{{ project.name }}</h3>
        <div class="flex items-center gap-2 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span class="text-gray-300">Created: {{ project.createdAt }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="text-gray-300">Last modified: {{ project.lastModified }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="text-gray-300">{{ project.author }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center h-full gap-6 pb-10">
    <div class="text-gray-400">No projects found 🔍</div>
    <button @click="projectsStore.toggleProjectSetting" class="btn-primary">프로젝트 생성</button>
    <router-link to="/project/projetid" class="btn-dark">에디터화면은 paht: /project/:id 입니다</router-link>
  </div>
  <ProjectSetting v-if="showProejctSetting" />

</template>
