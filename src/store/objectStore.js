import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useObjectStore = defineStore('object', () => {
  // State
  const objects = ref([])
  const mediaList = ref([])
  const selectedObject = ref(null)
  // const actionTargetList = ref([])
  const objectStartFrom = ref(null)

  const generateUniqueId = () => {
    let fullId, shortId
    do {
      const uuid = crypto.randomUUID()
      fullId = `object-${uuid}`
      shortId = `${uuid.slice(0, 8)}`
    } while (objects.value.some((obj) => obj.id === fullId))
    return { fullId, shortId }
  }

  // Actions
  const addObject = (object, isMedia = false) => {
    const { fullId, shortId } = generateUniqueId()

    const newObject = {
      id: fullId,
      name: `${object.type}-${shortId}`,
      type: object.type || 'circle',
      animationJson: [], // tirgger, 타겟 객체, 액션, 액션타겟 정보
      ...object,
    }

    objects.value.push(newObject)
    return newObject.id
  }

  const addMedia = (object) => {
    const { fullId, shortId } = generateUniqueId()

    const newObject = {
      id: fullId,
      name: `${object.type}-${shortId}`,
      ...object,
    }

    mediaList.value.push(newObject)
    return newObject.id
  }

  const removeMedia = (objectId) => {
    const index = mediaList.value.findIndex((obj) => obj.id === objectId)
    if (index !== -1) {
      mediaList.value.splice(index, 1)
    }
  }

  const removeObject = (objectId) => {
    const controllerStore = useControllerStore()
    const { isEditingTrigger } = storeToRefs(controllerStore)

    const index = objects.value.findIndex((obj) => obj.id === objectId)
    if (index !== -1) {
      objects.value.splice(index, 1)
    }
    isEditingTrigger.value = false
    initSelectedObject()
  }

  /**
   * @param {string} objectId
   */
  const selectObject = (objectId) => {
    selectedObject.value = null
    const object = objects.value.find((obj) => obj.id === objectId)
    selectedObject.value = object || null
  }

  // 오브젝트 정렬
  const alignObject = (type) => {
    if (!selectedObject.value) return

    const canvasWidth = 720 // From Canvas.vue props default width
    const canvasHeight = 452 // From Canvas.vue props default height

    const object = selectedObject.value
    let newX = object.x
    let newY = object.y

    const isCircle = object.type === 'circle'

    // Calculate object dimensions based on type
    const objectWidth =
      object.type === 'circle' ? (object.radiusX || object.radius) * 2 : object.width

    const objectHeight =
      object.type === 'circle' ? (object.radiusY || object.radius) * 2 : object.height

    switch (type) {
      // Horizontal alignment
      case 'left':
        newX = objectWidth / 2
        break
      case 'center':
        newX = canvasWidth / 2
        break
      case 'right':
        newX = canvasWidth - objectWidth / 2
        break

      // Vertical alignment
      case 'top':
        newY = objectHeight / 2
        break
      case 'middle':
        newY = canvasHeight / 2
        break
      case 'bottom':
        newY = canvasHeight - objectHeight / 2
        break
    }

    // Update object position
    selectedObject.value.x = isCircle ? newX : newX - objectWidth / 2
    selectedObject.value.y = isCircle ? newY : newY - objectHeight / 2
  }

  // 오브젝트 이름 업데이트
  const updateObjectName = (objectId, newName) => {
    const object = objects.value.find((obj) => obj.id === objectId)
    if (object) {
      object.name = newName
    }
  }

  // 오브젝트 위치 업데이트
  const updateObjectPosition = (objectId, position) => {
    const object = objects.value.find((obj) => obj.id === objectId)
    if (object) {
      object.x = Math.round(position.x)
      object.y = Math.round(position.y)
    }
  }

  // 오브젝트 애니메이션 업데이트
  const updateObjectAnimation = () => {
    const objectId = selectedObject.value.id
    const targetObject = objects.value.find((obj) => obj.id === objectId)
    if (targetObject) {
      // 이값은 interfacet에서 액션리스트에 사용하고 finalobjectjson 에서는 animationData에 해당함
      targetObject.animationJson = 'hi 여기 이제 엄청 긴 jsob eㅡㄹ어간ㄷ가' 
    }
  }

  const initSelectedObject = () => {
    selectedObject.value = null
  }

  const setObjectStartFrom = (startFrom) => {
    objectStartFrom.value = startFrom
  }

  return {
    // State
    objects,
    mediaList,
    // actionTargetList,
    selectedObject,
    objectStartFrom,

    // Actions
    addObject,
    addMedia,
    removeObject,
    removeMedia,
    selectObject,
    updateObjectName,
    updateObjectPosition,
    initSelectedObject,
    setObjectStartFrom,
    updateObjectAnimation,
    alignObject,
  }
})
