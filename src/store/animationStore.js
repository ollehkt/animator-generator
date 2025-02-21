import { defineStore } from 'pinia'
import { useObjectStore, useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useAnimationStore = defineStore('animation', () => {
  const objectStore = useObjectStore()
  const controllerStore = useControllerStore()
  const { objects, selectedObject, viewportActionList } = storeToRefs(objectStore)

  const updatePreviewAnimation = () => {
    const {
      selectedTriggerType,
      selectedTriggerTarget,
      selectedActionType,
      actionTargetList,
      animationConfig,
      isViewportAction,
    } = storeToRefs(controllerStore)

    const createAnimationConfig = (triggerType, triggerTarget) => {
      const animationData = actionTargetList.value.map((target) => {
        const animData = {
          triggerTarget: target.id || null,
          triggerTargetName: target.name || null,
          actionType: selectedActionType.value,
          ease: animationConfig.value.easing,
          duration: animationConfig.value.duration,
          delay: animationConfig.value.delay,
          fillMode: null,
        }

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
      })

      return {
        triggerType,
        triggerTarget,
        actionType: selectedActionType.value,
        actionTargetList: actionTargetList.value,
        isSimultaneousness: true,
        callbackFunction: null,
        ease: animationConfig.value.easing,
        duration: animationConfig.value.duration,
        delay: animationConfig.value.delay,
        fillMode: null,
        animation: animationData,
      }
    }

    if (isViewportAction.value) {
      const viewportAnimation = createAnimationConfig('pageload', 'page')
      viewportActionList.value.push(viewportAnimation)
    } else {
      const objectId = selectedObject.value?.id
      const targetObject = objects.value.find((obj) => obj.id === objectId)

      if (targetObject) {
        const newAnimation = createAnimationConfig(
          selectedTriggerType.value,
          selectedTriggerTarget.value
        )
        targetObject.objectActionList.push(newAnimation)
      }
    }

    controllerStore.isSettingTrigger = false
  }

  return {
    updatePreviewAnimation,
  }
})
