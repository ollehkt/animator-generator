import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

export const usePreviewStore = defineStore('preview', () => {
  const objectStore = useObjectStore()
  const { objects } = storeToRefs(objectStore)

  const objectJson = ref(null)

  const setObjectJson = () => {
    if (!objects.value || objects.value.length === 0) {
      objectJson.value = { objectJSON: [] }
      return
    }

    objectJson.value = {
      objectJSON: objects.value.map((obj) => {
        if (obj.objectActionList && obj.objectActionList.length > 0) {
          obj.objectActionList.forEach((action) => {
            const animationData = action.animation[0]
          })
        }

        return {
          objectData: {
            uuid: obj.id,
            objectName: obj.name,
            objectType: obj.objectType,
            diagramType: obj.diagramType,
            points: {
              x: obj.position?.x || 0,
              y: obj.position?.y || 0,
            },
            background: obj.fillStyle,
            size: {
              width: obj.size?.width || 100,
              height: obj.size?.height || 100,
            },
            opacity: obj.opacity || 100,
            color: obj.fillStyle,
            text: obj.text || '',
            url: obj.url || '',
          },
          animationData: obj.objectActionList || [],
        }
      }),
    }
  }

  return {
    objectJson,
    setObjectJson,
  }
})
