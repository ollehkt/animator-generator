import { defineStore } from 'pinia'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useDataStore = defineStore('data', () => {
  const formatObjectData = () => {
    // objects value => sample object data 로 변환

    const objectStore = useObjectStore()
    const { objects } = storeToRefs(objectStore)

    const formattedObjects = objects.value.map((obj) => ({
      objectData: {
        uuid: obj.id, // Map 'id' to 'uuid'
        objectName: obj.name, // Assuming 'name' is the desired object name
        objectType: obj.objectType,
        diagramType: obj.diagramType,
        url: obj.url || null, // Assuming no URL is provided
        text: obj.text || null, // Assuming no text is provided
        position: obj.position,
        style: {
          background: obj.fillStyle,
          color: obj.fillStyle,
          opacity: 100, // Assuming full opacity
        },
        size: {
          width: obj.size ? obj.size.width : obj.radius * 2,
          height: obj.size ? obj.size.height : obj.radius * 2,
        },
      },
      animationData: [], // Assuming no animation data is provided
    }))
    return formattedObjects
  }

  // API JSON => UI JSON 형식으로 변환
  const setObjectsData = (data) => {
    const objectStore = useObjectStore()
    if (!Array.isArray(data)) {
      console.error('Expected data to be an array, but got:', data)
      return // Exit early if data is not an array
    }

    console.log('api data=>>>>>>>>>>>>>>>>>>>>>>>>', data)
    const formattedObjects = data.map((item) => {
      const obj = item.objectData // Access the objectData property
      return {
        id: obj.uuid, // Map 'id' to 'uuid'
        name: obj.objectName, // Assuming 'name' is the desired object name
        objectType: obj.objectType,
        ...(obj.objectType === 'diagram' && { diagramType: obj.diagramType }),
        position: {
          x: obj.position.x,
          y: obj.position.y,
        },
        ...(obj.objectType === 'diagram' && { fillStyle: obj.style.background }),
        ...(obj.objectType === 'diagram' &&
          obj.diagramType === 'circle' && { radius: obj.size.width / 2 }), // Assuming radius is half of width
        ...(obj.objectType !== 'diagram' && {
          size: {
            width: obj.size.width,
            height: obj.size.height,
          },
          ...(obj.objectType == 'text' && { text: obj.text }),
          ...(obj.objectType == 'url' && { url: obj.url }),
        }),
        isVisible: true,
      }
    })
    objectStore.setObjects(formattedObjects)
  }

  /** 단수의 특정 Object 데이터를 포맷팅 하는 함수 */
  // const formatObjectData = (obj) => {
  //   const objectData = {
  //     uuid: obj.id, // Map 'id' to 'uuid'
  //     objectName: obj.name, // Assuming 'name' is the desired object name
  //     objectType: obj.objectType,
  //     diagramType: obj.diagramType,
  //     url: null, // Assuming no URL is provided
  //     text: null, // Assuming no text is provided
  //     position: obj.position,
  //     style: {
  //       background: obj.fillStyle,
  //       color: obj.fillStyle,
  //       opacity: 100, // Assuming full opacity
  //     },
  //     size: {
  //       width: obj.size ? obj.size.width : obj.radius * 2,
  //       height: obj.size ? obj.size.height : obj.radius * 2,
  //     },
  //   }

  //   const formattedObject = {
  //     objectData,
  //     animationData: [], // Assuming no animation data is provided
  //   }

  //   // console.log(formattedObject, '🟢🟢🟢')
  //   return formattedObject
  // }
  return {
    formatObjectData,
    setObjectsData,
  }
})
