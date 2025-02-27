import { defineStore } from 'pinia'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useDataStore = defineStore('data', () => {
  /**
   * UI DATA => API FORMATTING
   * 프리뷰에 필요한 데이터 형태로 포맷팅
   * @returns sampleJson => 🟠 objectData 에 해당
   */
  const formatObjectData = () => {
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
      animationData: formatAnimationData(obj), // Assuming no animation data is provided
    }))
    return formattedObjects
  }

  /**
   * UI DATA => API FORMATTING
   * 프리뷰에 필요한 데이터 형태로 포맷팅
   * @returns sampleJson => 🟠 animationData 에 해당
   */

  const formatAnimationData = (targetObject) => {
    if(targetObject.objectActionList.length === 0) return []

    const formattedAnimationData = []

    targetObject.objectActionList.forEach((obj) => {
      const actionList = obj.actionTargetList.map((target) => ({
        actionTargetId: target.id,
        triggerTarget: obj.triggerTarget || null, // 이게 굳이 필요한가 object uuid인데??
        actionType: obj.actionType,
        points: obj.points,
        duration: obj.duration,
        delay: obj.delay,
        count: obj.count,
        direction: obj.direction,
        fillMode: obj.fillMode || null,
        ...(obj.actionType === 'rotate' && { rotate: obj.rotate }),
        ...(obj.actionType === 'scale' && { scaleStart: obj.scaleStart, scaleEnd: obj.scaleEnd }),
        ...(obj.actionType === 'opacity' && { opacityStart: obj.opacityStart, opacityEnd: obj.opacityEnd }),
        // actionSetting: obj.actionSetting,
      }))

      const triggerType = obj.triggerType

      formattedAnimationData.push({
        triggerType: triggerType,
        animation: actionList.length > 0 ? actionList : [], 
        isSimultaneousness: obj.isSimultaneousness || true, 
        callbackFunction: obj.callbackFunction || 'preprocessTestFunction', 
      })
    })

    return formattedAnimationData
  }

  

  /**
   * API => UI DATA FORMATTING
   * API Reponse jsonData => ObectStore 🟠objects JSON 형식으로 변환
   * @param {Array} data
   */
  const setObjectsData = (data) => {
    const objectStore = useObjectStore()
    if (!Array.isArray(data)) {
      console.error('Expected data to be an array, but got:', data)
    }

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
        objectActionList: [], // todo 액션 데이터 포맷 및 추가
      }
    })
    objectStore.setObjects(formattedObjects)
  }

  /** 단수의 특정 Object 데이터를 포맷팅 하는 함수 */
  const formatSingularObjectData = (obj) => {
    const objectData = {
      uuid: obj.id, 
      objectName: obj.name, 
      objectType: obj.objectType,
      diagramType: obj.diagramType,
      url: null, 
      text: null, 
      position: obj.position,
      style: {
        background: obj.fillStyle,
        color: obj.fillStyle,
        opacity: 100, 
      },
      size: {
        width: obj.size ? obj.size.width : obj.radius * 2,
        height: obj.size ? obj.size.height : obj.radius * 2,
      },
    }

    const formattedObject = {
      objectData,
      animationData: [], 
    }

    // console.log(formattedObject, '🟢🟢🟢')
    return formattedObject
  }
  return {
    formatObjectData,
    formatAnimationData,
    setObjectsData,
  }
})
