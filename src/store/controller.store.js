import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useControllerStore = defineStore('controller', () => {
  // 화면 컨트롤, 객체 애니메이션 컨트롤

  // const state
  const objectStore = useObjectStore()
  const { selectedObject, objects } = storeToRefs(objectStore)


  // 트리거 타겟 change 되기 전 값 할당하기 위함
  watch(selectedObject, (newValue) => {
    if (newValue) {
      selectedTriggerTarget.value = newValue.id
    } else {
      selectedTriggerTarget.value = null
    }
  })

  // state
  const activeTab = ref('property')

  const isLayersMinimized = ref(false)
  const isViewportAction = ref(true) // 오브젝트는 생성이나 선택전 뷰포트만 존재

  // 액션 타입(페이지이동, 좌표로 이동...)
  const showSourcePreview = ref(false)
  const isSettingTrigger = ref(false) // 리스트 || 트리거 설정
  const isEditingTrigger = ref(false) // 기존 저장된 액션내용 수정

  // 액션리스트에 들어가야 하는 필수 값 ==================================
  const selectedTriggerType = ref('click')
  const selectedTriggerTarget = ref(null)
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
    objectStore.selectObject(target)
    selectedTriggerTarget.value = target
  }

  // 액션 설정 부분
  const setActionType = (type) => {
    selectedActionType.value = type
  }

  // 트리거 설정 초기화
  const initTriggerSetting = () => {
    console.log('트리거 세팅 초기화')
    selectedTriggerType.value = 'click'
    selectedTriggerTarget.value = null
    selectedActionType.value = 'translate'
    actionTargetList.value = []
  }

  // 애니메이션이 실제로 적용되는 객채
  const addActionTarget = (object) => {
    actionTargetList.value.push(object)
  }

  const updateActionTarget = (index, payload) => {
    actionTargetList.value[index] = payload
  }

  const removeActionTarget = (index) => {
    actionTargetList.value.splice(index, 1)
  }

  const updateAnimationConfig = (key, value) => {
    animationConfig.value[key] = value
  }

  const initViewportAction = () => {
    isViewportAction.value = true
  }

  return {
    activeTab,
    isLayersMinimized,
    isViewportAction, // 오브젝트가 없는데 액션추가 하면 화면 기준 액션 생성
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
    updateActionTarget,
    removeActionTarget,
    updateAnimationConfig,
    initViewportAction,
    initTriggerSetting,
  }
})
