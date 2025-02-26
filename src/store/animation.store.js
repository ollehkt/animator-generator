import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAnimationStore = defineStore('animation', () => {
  const animationJSON = ref(null)
  
  const createAnimationConfig = (
    triggerType,
    triggerTarget,
    actionTargetList,
    actionType,
    animConfig
  ) => {
    const animationData = actionTargetList.map((target) => {
      const animData = {
        triggerTarget: target.id || null,
        triggerTargetName: target.name || null,
        actionType: actionType,
        ease: animConfig.easing,
        duration: animConfig.duration,
        delay: animConfig.delay,
        fillMode: null,
      }

      switch (actionType) {
        case 'translate':
          animData.targetPOS = {
            x: animConfig.x,
            y: animConfig.y,
          }
          break
        case 'rotate':
          animData.rotate = animConfig.rotate
          break
        case 'scale':
          animData.scaleStart = animConfig.scaleStart
          animData.scaleEnd = animConfig.scaleEnd
          break
        case 'opacity':
          animData.opacityStart = animConfig.opacityStart
          animData.opacityEnd = animConfig.opacityEnd
          break
      }
      console.log('animData', animData)
      return animData
    })

    return {
      triggerType,
      triggerTarget,
      actionType: actionType,
      actionTargetList: actionTargetList,
      isSimultaneousness: true,
      callbackFunction: null,
      ease: animConfig.easing,
      duration: animConfig.duration,
      delay: animConfig.delay,
      fillMode: null,
      animation: animationData,
    }
  }

  return {
    createAnimationConfig,
  }
})
