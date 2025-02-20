import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'


export const useObjectStore = defineStore('object', () => {
  // State
  const objects = ref([])
  const mediaList = ref([])
  const selectedObject = ref(null)
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
  const addObject = (object) => {
    /**
     * objectJson 에서 objectData에 해당하는 부분
     * objectActionList는 animationData 부분
     */
    const { fullId, shortId } = generateUniqueId()

    const newObject = {
      id: fullId,
      name: `${object.diagramType || object.objectType}-${shortId}`,
      objectActionList: [], // tirgger, 타겟 객체, 액션, 액션타겟 정보
      ...object,
    }

    objects.value.push(newObject)

    // 트리거타겟객체도 동기화
    const controllerStore = useControllerStore()
    const { selectedTriggerTarget } = storeToRefs(controllerStore)
    selectedTriggerTarget.value.push({
      id: newObject.id,
      name: newObject.name,
    })
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
    const { isSettingTrigger } = storeToRefs(controllerStore)

    const index = objects.value.findIndex((obj) => obj.id === objectId)
    if (index !== -1) {
      objects.value.splice(index, 1)
    }
    isSettingTrigger.value = false
    initSelectedObject()
  }

  /**
   * @param {string} objectId
   */
  const selectObject = (objectId) => {
    // todo action 으로 따로 정리!!
    const controllerStore = useControllerStore()
    const { isViewportAction } = storeToRefs(controllerStore)
    isViewportAction.value = false

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
    let newX = object.position.x
    let newY = object.position.y

    const isCircle = object.objectType === 'diagram' && object.diagramType === 'circle'

    // Calculate object dimensions based on type
    const objectWidth =
      object.objectType === 'diagram' && object.diagramType === 'circle'
        ? (object.radiusX || object.radius) * 2
        : object.size.width

    const objectHeight =
      object.objectType === 'diagram' && object.diagramType === 'circle'
        ? (object.radiusY || object.radius) * 2
        : object.size.height

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
    selectedObject.value.position.x = isCircle ? newX : newX - objectWidth / 2
    selectedObject.value.position.y = isCircle ? newY : newY - objectHeight / 2
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
      object.position.x = Math.round(position.x)
      object.position.y = Math.round(position.y)
    }
  }

  // 오브젝트 애니메이션 업데이트 (이 액션을 저장)
  const updateObjectAnimation = () => {
    const controllerStore = useControllerStore()
    const {
      selectedTriggerType,
      selectedTriggerTarget,
      selectedActionType,
      actionTargetList,
      animationConfig,
    } = storeToRefs(controllerStore)

    const objectId = selectedObject.value.id
    const targetObject = objects.value.find((obj) => obj.id === objectId)

    if (targetObject) {
      const newAnimation = {
        // 트리거 타입, 트리거 타겟 객체, 액션, 액션 타겟(복수가능), common config
        triggerType: selectedTriggerType.value, // click, dbclick...
        triggerTarget: selectedTriggerTarget.value, // 트리거 타겟 UUID
        actionType: selectedActionType.value, // translate, scale, rotate...
        actionTargetList, // 액션을 하는 객체 UUID
        isSimultaneousness: true,
        callbackFunction: null,
        hello: 'world',
        ease: animationConfig.value.easing,
        duration: animationConfig.value.duration,
        delay: animationConfig.value.delay,
        fillMode: null,

        // 액션 타겟리스트 이거는 똑같은거 값을 두애니메이션으로 넣을때
        // animation: actionTargetList.value.map((target) => ({
        //   triggerTarget: target.id || null,
        //   triggerTargetName: target.name || null,
        //   actionType: selectedActionType.value,
        //   ease: animationConfig.value.easing,
        //   duration: animationConfig.value.duration,
        //   delay: animationConfig.value.delay,
        //   fillMode: null,

        // })),
        animation: actionTargetList.value.map((target) => {
          const animData = {
            triggerTarget: target.id || null,
            triggerTargetName: target.name || null,
            actionType: selectedActionType.value,
            ease: animationConfig.value.easing,
            duration: animationConfig.value.duration,
            delay: animationConfig.value.delay,
            fillMode: null,
          }

          // 액션 타입에 따라 필요한 속성 추가
          switch (selectedActionType.value) {
            case 'translate':
              animData.targetPOS = {
                x: animationConfig.value.x,
                y: animationConfig.value.y,
              }
              break
            case 'rotate':
              animData.rotate = animationConfig.value.rotate
              break
            case 'scale':
              animData.scaleStart = animationConfig.value.scaleStart
              animData.scaleEnd = animationConfig.value.scaleEnd
              break
            case 'opacity':
              animData.opacityStart = animationConfig.value.opacityStart
              animData.opacityEnd = animationConfig.value.opacityEnd
              break
          }

          return animData
        }),
      }

      targetObject.objectActionList.push(newAnimation)
      controllerStore.isSettingTrigger = false
    }
  }

  const deleteObjectAnimation = (actionIndex) => {
    const objectId = selectedObject.value.id
    const object = objects.value.find((obj) => obj.id === objectId)
    if (object) {
      object.objectActionList.splice(actionIndex, 1)
    }
  }

  const initSelectedObject = () => {
    // deselct object and init viewport ref true
    selectedObject.value = null
    const controllerStore = useControllerStore()
    controllerStore.initViewportAction()
  }

  const setObjectStartFrom = (startFrom) => {
    objectStartFrom.value = startFrom
  }

  return {
    // State
    objects,
    mediaList,
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
    deleteObjectAnimation,
    alignObject,
  }
})
