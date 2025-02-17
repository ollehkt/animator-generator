import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useObjectStore = defineStore('object', () => {
  // State
  const objects = ref([])
  const cloneObjects = ref([]) // marker 값을 위한 복사객체
  const selectedObject = ref(null)
  const actionTargetList = ref([])
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
  const addObject = (object, isClone = false) => {
    const { fullId, shortId } = generateUniqueId()

    const newObject = {
      id: fullId,
      name: `${object.type}-${shortId}`,
      type: object.type || 'circle',
      animations: [], // tirgger, 타겟 객체, 액션, 액션타겟 정보
      ...object,      
    }

    objects.value.push(newObject)
    return newObject.id
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

  const updateObjectPosition = (objectId, position) => {
    const object = objects.value.find((obj) => obj.id === objectId)
    if (object) {
      object.x = position.x
      object.y = position.y
    }
  }

  const initSelectedObject = () => {
    selectedObject.value = null
  }

  const setObjectStartFrom = (startFrom) => {
    objectStartFrom.value = startFrom
  }

  const addActionTarget = (object) => {
    actionTargetList.value.push(object)
  }

  const removeActionTarget = (index) => {
    actionTargetList.value.splice(index, 1)
  }

  return {
    // State
    objects,
    actionTargetList,
    selectedObject,
    objectStartFrom,

    // Actions
    addObject,
    removeObject,
    selectObject,
    updateObjectPosition,
    initSelectedObject,
    setObjectStartFrom,
    addActionTarget,
    removeActionTarget,
  }
})
