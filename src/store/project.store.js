import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_ROUTES } from '@/helpers/env'
import { api } from '@/helpers/api'
import { useViewportStore } from './viewport.store'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const projectDetail = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const showProejctSetting = ref(false)
  const toggleProjectSetting = () => {
    showProejctSetting.value = !showProejctSetting.value
  }

  /**
   * @GET /project
   */
  const getProjectList = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get(API_ROUTES.PROJECTS.LIST)
      // console.log("response", response)
      projects.value = response
    } catch (err) {
      error.value = err.message || 'Failed to fetch projects'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * @GET /project/:id
   */
  const getProjectDetail = async (no) => {
    const viewportStore = useViewportStore()

    // Convert to number and validate
    const projectNo = parseInt(no, 10)
    
    if (isNaN(projectNo)) {
      error.value = 'Invalid project number'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await api.get(API_ROUTES.PROJECTS.DETAIL(projectNo))
      projectDetail.value = response
      viewportStore.setCanvasSize(response.canvas.width, response.canvas.height)
      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch project detail'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * @POST /project
   */
  const postProject = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post(API_ROUTES.PROJECTS.CREATE, params)

      console.log('response', response)
      return response
    } catch (err) {
      error.value = err.message || 'Failed to create project'
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    projectDetail,
    isLoading,
    showProejctSetting,
    error,
    getProjectList,
    getProjectDetail,
    postProject,
    toggleProjectSetting,
  }
})
