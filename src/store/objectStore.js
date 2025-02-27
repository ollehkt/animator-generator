import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useControllerStore, useAnimationStore, useDataStore, useProjectsStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useObjectStore = defineStore('object', () => {
  // State
  const objects = ref([])
  const mediaList = ref([])
  const selectedObject = ref(null)
  const objectStartFrom = ref(null)
  const viewportActionList = ref([])
  const dataStore = useDataStore()
  const generateUniqueId = (object) => {
    let fullId, shortId
    const objectName = object.diagramType || object.objectType
    do {
      const uuid = crypto.randomUUID()
      fullId = `${objectName}-${uuid}`
      shortId = `${uuid.slice(0, 8)}`
    } while (objects.value.some((obj) => obj.id === fullId))
    return { fullId, shortId }
  }

  // Actions
  const setObjects = (data) => {
    objects.value = data
  }

  const addObject = (object) => {
    /**
     * objectJson 에서 objectData에 해당하는 부분
     * objectActionList는 animationData 부분
     */
    const dataStore = useDataStore()
    const projectStore = useProjectsStore()
    const { projectDetail } = storeToRefs(projectStore)

    const { fullId, shortId } = generateUniqueId(object)

    const newObject = {
      id: fullId,
      name: `${object.diagramType || object.objectType}-${shortId}`,
      objectActionList: [], // tirgger, 타겟 객체, 액션, 액션타겟 정보
      isVisible: true,
      ...object,
    }

    objects.value.push(newObject)
    // TODO: 이 오브젝트 변환 => UDPATE "jsonData": {},
    const jsonArray = dataStore.formatObjectData()
    projectStore.updateProject(projectDetail.value.projectNo, {
      jsonData: jsonArray,
    })

    return newObject.id
  }

  const addMedia = (object) => {
    const { fullId, shortId } = generateUniqueId(object)

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
    // todo actionTargetList 에서 같은 ID 삭제
    const controllerStore = useControllerStore()
    const projectStore = useProjectsStore()
    const { projectDetail } = storeToRefs(projectStore)
    const { isSettingTrigger } = storeToRefs(controllerStore)

    // objects 에서 삭제
    const index = objects.value.findIndex((obj) => obj.id === objectId)
    if (index !== -1) {
      objects.value.splice(index, 1)
    }

    // 각 오브젝트에서 actionTargetList 에서 같은 ID 삭제
    objects.value.forEach((obj) => {
      if (obj.objectActionList) {
        obj.objectActionList = obj.objectActionList
          .map((action) => {
            // actionTargetList 배열에서 특정 id를 가진 target만 제거
            const filteredTargets = action.actionTargetList.filter(
              (target) => target.id !== objectId
            )

            // 나머지 속성들은 그대로 유지하면서 필터링된 actionTargetList만 업데이트
            return {
              ...action,
              actionTargetList: filteredTargets,
            }
          })
          // 액션 타겟 오브젝트다 지워지면 액션 자체를 지워버림
          .filter((action) => action.actionTargetList.length > 0)
          // actionTargetList가 완전히 비어있는 action만 제거
          .filter((action) => action.actionTargetList.length > 0)
      }
    })

    const jsonArray = dataStore.formatObjectData()
    projectStore.updateProject(projectDetail.value.projectNo, {
      jsonData: jsonArray,
    })

    isSettingTrigger.value = false
    initSelectedObject()
  }

  /**
   * Select an object
   * @param {string} objectId
   * 오브젝트가 선택되면 isViewportAction = false
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

  /**
   * Toggle visibility of an object
   * @param {string} objectId
   */
  const toggleVisibility = (objectId) => {
    const object = objects.value.find((obj) => obj.id === objectId)
    if (object) {
      object.isVisible = !object.isVisible
    }
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
    // todo object.name을 정적으로 사용하는 곳 모두 수정 (액션리스트...?)

    const object = objects.value.find((obj) => obj.id === objectId)
    if (object) {
      object.name = newName

      // 오브젝트 액션리스트 name 수정

      object.objectActionList.forEach((action) => {
        const actionTarget = action.actionTargetList.find((target) => target.id === objectId)
        if (actionTarget) {
          actionTarget.name = newName
        }
      })
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

  const updateObjectAnimation = () => {
    const controllerStore = useControllerStore()
    const animationStore = useAnimationStore()
    const {
      selectedTriggerType,
      selectedTriggerTarget,
      selectedActionType,
      actionTargetList,
      animationConfig,
      isViewportAction,
    } = storeToRefs(controllerStore)

    /**
     * @중요
     * sample.json 구조는 UI에 사용되지 않습니다.
     * sample.json 구조는 소스를 내보내기 할때 최종적으로 나가는 구조입니다
     * sample.json 구조는 미리보기를 할때 사용되는 구조입니다
     *   @중요 objectActionList 에 사용되는 JSON 구조는 변경하지 마세요
     * - 구조 변경 시 연결된 모든 UI 컴포넌트가 작동하지 않습니다
     * - newAnimation JSON 형식으로 변경 시 전체 UI 리팩토링이 필요합니다.
     *
     */
    const actions = {
      triggerType: selectedTriggerType.value,
      triggerTarget: selectedTriggerTarget.value,
      actionType: selectedActionType.value,
      actionTargetList: actionTargetList.value,
      isSimultaneousness: true,
      callbackFunction: null,
      ease: animationConfig.value.easing,
      duration: animationConfig.value.duration,
      delay: animationConfig.value.delay,
      fillMode: null,
    }

    // console.log('actions', actions)

    const newAnimation = animationStore.createAnimationConfig(
      selectedTriggerType.value,
      selectedTriggerTarget.value,
      actionTargetList.value,
      selectedActionType.value,
      animationConfig.value
    )

    // console.log('newAnimation', newAnimation)

    if (isViewportAction.value) {
      viewportActionList.value.push(newAnimation)
    } else {
      const objectId = selectedObject.value?.id
      const targetObject = objects.value.find((obj) => obj.id === objectId)
      if (targetObject) {
        targetObject.objectActionList.push(newAnimation)
      }
    }
    controllerStore.isSettingTrigger = false
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

  // In your object store
  const updateObjectText = (id, newText) => {
    const object = objects.value.find((obj) => obj.id === id)
    if (object) {
      object.text = newText
    }
  }

  return {
    // State
    objects,
    mediaList,
    selectedObject,
    objectStartFrom,
    viewportActionList,
    // Actions
    setObjects,
    addObject,
    addMedia,
    removeObject,
    removeMedia,
    selectObject,
    toggleVisibility,
    updateObjectName,
    updateObjectPosition,
    initSelectedObject,
    setObjectStartFrom,
    updateObjectAnimation,
    deleteObjectAnimation,
    alignObject,
    updateObjectText,
  }
})
