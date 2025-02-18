import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

export const usePreviewStore = defineStore('preview', () => {
  // const objectStore = useObjectStore()
  // const { selectedObject } = storeToRefs(objectStore)

  const preview = ref(null)
  
  return {
    preview
  }
  
})