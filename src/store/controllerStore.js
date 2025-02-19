import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useControllerStore = defineStore('controller', () => {
  // const state
  const objectStore = useObjectStore()
  const { selectedObject, objects } = storeToRefs(objectStore)

  // state
  // const activeTab = ref({ //컨트롤러 탭 변경 있었을 경우 사용 현재 없음
  //   // 객체속성
  //   id: 'object',
  //   label: 'Object',
  // })

  // 액션 타입(페이지이동, 좌표로 이동...)
  const showSourcePreview = ref(false)
  const isEditingTrigger = ref(false) // 리스트 || 트리거 설정

  // 액션리스트에 들어가야 하는 필수 값
  const selectedTriggerType = ref('click')
  const selectedActionType = ref('translate')
  const actionTargetList = ref([])

  //==================================

  const animations = ref([])
  const targetPOS = ref({
    x: 0,
    y: 0,
  })

  const animationConfig = ref({
    x: 0,
    y: 0,
    opacityStart: 1,
    opacityEnd: 0,
    scaleStart: 1,
    scaleEnd: 0,
    rotate: {
      x: 0,
      y: 0,
      z: 0,
    },
    duration: 1000,
    easing: 'linear',
    loop: false,
    delay: 0,
  })

  // 트리거 설정 부분
  const setTriggerType = (type) => {
    // trigger
    selectedTriggerType.value = type
  }

  // 액션 설정 부분
  const setActionType = (type) => {
    // action
    selectedActionType.value = type
  }

  // Helper function to manage transforms
  const updateTransform = (element, newTransform) => {
    // Get current transform values from dataset or use defaults
    const currentTransform = {
      translate: element.dataset.translate || '0px, 0px',
      scale: element.dataset.scale || '1',
      rotate: element.dataset.rotate || '0deg',
    }

    // Update only the specified transform type
    if (newTransform.translate) {
      element.style.transform = `translate(${newTransform.translate})`
      element.dataset.translate = newTransform.translate
    } else if (newTransform.scale) {
      element.style.transform = `scale(${newTransform.scale})`
      element.dataset.scale = newTransform.scale
    } else if (newTransform.rotate) {
      element.style.transform = `rotate(${newTransform.rotate})`
      element.dataset.rotate = newTransform.rotate
    }
  }

  const removeAnimation = (animationId) => {
    const index = animations.value.findIndex((anim) => anim.id === animationId)
    if (index !== -1) {
      animations.value.splice(index, 1)
    }
  }

  const resetToInitialState = (element, initialState) => {
    // Reset position
    selectedObject.value.x = initialState.x
    selectedObject.value.y = initialState.y

    // Reset all transforms and opacity
    element.style.transform = ''
    element.style.opacity = initialState.opacity

    // Clear all dataset values
    element.dataset.translate = `${initialState.x}px, ${initialState.y}px`
    element.dataset.scale = '1'
    element.dataset.rotate = '0deg'
  }

  const updateAnimationConfig = (key, value) => {
    animationConfig.value[key] = value
  }

  // 애니메이션이 실제로 적용되는 객채
  const addActionTarget = (object) => {
    actionTargetList.value.push(object)
  }

  const removeActionTarget = (index) => {
    actionTargetList.value.splice(index, 1)
  }

  return {
    showSourcePreview,
    selectedTriggerType,
    selectedActionType,
    isEditingTrigger,
    actionTargetList,
    // activeTab,
    animations,
    targetPOS,
    animationConfig,

    setTriggerType,
    setActionType,
    removeAnimation,
    updateAnimationConfig,
    addActionTarget,
    removeActionTarget,
  }
})
