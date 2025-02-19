import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

export const usePreviewStore = defineStore('preview', () => {
  const objectStore = useObjectStore()
  const controllerStore = useControllerStore()
  // const { selectedObject } = storeToRefs(objectStore)

  const objectJson = ref(null)

  const setObjectJson = () => {
    objectJson.value = {
      objectJSON: objectStore.objects.value.map(obj => ({
        objectData: {
          uuid: obj?.id || 'object-default',
          objectName: obj?.name || '',
          objectType: 'diagram',
          diagramType: obj?.type || 'circle',
          url: '',
          text: '',
          points: {
            x: obj?.x || 0,
            y: obj?.y || 0
          },
          background: obj?.fillStyle || '#825feb',
          size: {
            width: obj?.radius ? obj.radius * 2 : 100,
            height: obj?.radius ? obj.radius * 2 : 100
          },
          opacity: 100,
          color: obj?.fillStyle || '#825feb'
        },
        animationData: obj?.objectActionList || []
      }))
    }
  }
  
  return {
    objectJson,
    setObjectJson
  }
  
})