import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/helpers/api'
import { API_ROUTES } from '@/helpers/env'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const getProjectList = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get(API_ROUTES.PROJECTS.LIST)
      projects.value = response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch projects'
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    isLoading,
    error,
    getProjectList,
  }
})
