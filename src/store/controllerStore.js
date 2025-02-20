import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useControllerStore = defineStore('controller', () => {
  // 화면 컨트롤, 객체 애니메이션 컨트롤

  // const state
  const objectStore = useObjectStore()
  const { selectedObject, objects } = storeToRefs(objectStore)

  // state
  // const activeTab = ref({ //컨트롤러 탭 변경 있었을 경우 사용 현재 없음
  //   // 객체속성
  //   id: 'object',
  //   label: 'Object',
  // })
  const isLayersMinimized = ref(false)

  // 액션 타입(페이지이동, 좌표로 이동...)
  const showSourcePreview = ref(false)
  const isSettingTrigger = ref(false) // 리스트 || 트리거 설정
  const isEditingTrigger = ref(false) // 기존 저장된 액션내용 수정

  // 액션리스트에 들어가야 하는 필수 값 ==================================
  const selectedTriggerType = ref('click')
  const selectedTriggerTarget = ref([])
  const selectedActionType = ref('translate')
  const actionTargetList = ref([])

  //==============================================================
  
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

  const toggleLayersMinimized = () => {
    isLayersMinimized.value = !isLayersMinimized.value
  }

  // 트리거 설정 부분
  const setTriggerType = (type) => {
    // trigger
    selectedTriggerType.value = type
  }

  // 트리거 타겟 설정
  const setTriggerTarget = (target) => {
    selectedTriggerTarget.value = target
  }

  // 액션 설정 부분
  const setActionType = (type) => {
    selectedActionType.value = type
  }

  // 애니메이션이 실제로 적용되는 객채
  const addActionTarget = (object) => {
    actionTargetList.value.push(object)
  }

  const removeActionTarget = (index) => {
    actionTargetList.value.splice(index, 1)
  }

  const updateAnimationConfig = (key, value) => {
    animationConfig.value[key] = value
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

  return {
    isLayersMinimized,
    showSourcePreview,
    selectedTriggerType,
    selectedActionType,
    isSettingTrigger,
    isEditingTrigger,
    actionTargetList,
    selectedTriggerTarget,
    targetPOS,
    animationConfig,

    toggleLayersMinimized,
    setTriggerType,
    setTriggerTarget,
    setActionType,
    addActionTarget,
    removeActionTarget,
    updateAnimationConfig,
  }
})
