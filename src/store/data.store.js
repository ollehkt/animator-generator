import { defineStore } from 'pinia'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useDataStore = defineStore('data', () => {
  const formatObjectData = (data) => {
    // objects value => sample object data 로 변환

    const objectStore = useObjectStore()
    const { objects } = storeToRefs(objectStore)

    const formattedObjects = objects.value.map((obj) => ({
      objectData: {
        uuid: obj.id, // Map 'id' to 'uuid'
        objcetName: obj.name, // Assuming 'name' is the desired object name
        objectType: obj.objectType,
        diagramType: obj.diagramType,
        url: null, // Assuming no URL is provided
        text: null, // Assuming no text is provided
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
  const setObjectsJsonData = (data) => {
    console.log('data =>', data)
  }

  const parseStringToObjectJSON = (data) => {
    return JSON.parse(data)
  }

  /** 단수의 특정 Object 데이터를 포맷팅 하는 함수 */
  // const formatObjectData = (obj) => {
  //   const objectData = {
  //     uuid: obj.id, // Map 'id' to 'uuid'
  //     objcetName: obj.name, // Assuming 'name' is the desired object name
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
    parseStringToObjectJSON,
    setObjectsJsonData,
  }
})
