import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useViewportStore = defineStore('viewport', () => {
  const viewport = ref(null)

  return {
    viewport
  }
})