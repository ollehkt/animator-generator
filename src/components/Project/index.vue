<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/store'
import ProjectSetting from './ProjectSetting.vue'

const router = useRouter()
const projectsStore = useProjectsStore()

const { projects, showProejctSetting } = storeToRefs(projectsStore)

const handleProjectClick = (project) => {
  router.push(`/project/${project.projectNo}`)
}

const deleteProject =  (project) => {
  if (confirm('Are you sure you want to delete this project?')) {
    projectsStore.deleteProject(project.projectNo)
  }
}

onMounted(async () => {
  await projectsStore.getProjectList()
})
</script>
<template>
  <div class="w-[1280px] mx-auto py-10 h-full">
    <button @click="router.back()" class="border-none btn-dark">뒤로가기</button>
    <!-- LIST -->
    <div
      v-if="projects.totalCount > 0"
      class="grid grid-cols-[repeat(auto-fill,minmax(374px,1fr))] auto-rows-[218px] gap-6 mt-6 h-full"
    >
      <div
        v-for="project in projects.list"
        :key="project.id"
        class="relative p-6 transition-colors border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-700 group"
        @click="handleProjectClick(project)"
      >
        <!-- Delete Icon -->
        <button
          @click.stop="deleteProject(project)"
          class="absolute hidden text-gray-400 top-3 right-3 hover:text-red-500 group-hover:block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
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
          <h3 class="text-xl font-semibold text-gray-100">{{ project.projectName }}</h3>
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
              <span class="text-gray-300">Last modified: {{ project.updatedAt }}</span>
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
              <span class="text-gray-300">{{ project.author || 'unknown' }}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="projectsStore.toggleProjectSetting()"
        class="flex items-center justify-center gap-4 p-2 transition-colors border border-gray-200 rounded-lg hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
          />
        </svg>

        새 프로젝트 생성
      </button>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-full gap-6 pb-10">
      <div class="text-gray-400">No projects found 🔍</div>
      <button @click="projectsStore.toggleProjectSetting" class="btn-primary">프로젝트 생성</button>
      <router-link to="/project/projetid" class="btn-dark">
        에디터화면은 paht: /project/:id 입니다
      </router-link>
    </div>
    <ProjectSetting v-if="showProejctSetting" />
  </div>
</template>
