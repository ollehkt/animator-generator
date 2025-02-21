<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import { TRIGGER_CONFIG } from '@/helpers/consts'

import AnimationPropertySetting from './AnimationPropertySetting.vue'

const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const { selectedActionType, actionTargetList, isViewportAction } = storeToRefs(controllerStore)
const { objects, selectedObject } = storeToRefs(objectStore)

const triggerConfig = ref(TRIGGER_CONFIG)

const computedTriggerConfig = computed(() => {
  if (isViewportAction.value) {
    return {
      ...triggerConfig.value,
      triggers: {
        label: triggerConfig.value.triggers.label,
        value: [
          {
            label: '페이지 로드',
            value: 'pageload',
          },
        ],
      },
      triggerTarget: {
        label: triggerConfig.value.triggerTarget.label,
        value: [
          {
            label: '페이지',
            value: 'page',
          },
        ],
      },
    }
  }

  return {
    ...triggerConfig.value,
    triggerTarget: {
      label: triggerConfig.value.triggerTarget.label,
      value: objects.value,
    },
  }
})

const requireActionTarget = computed(() => {
  if (!selectedActionType.value) return true

  const actionTypesRequiringTarget = ['reload', 'close', 'translate', 'rotate', 'scale', 'opacity']

  return actionTypesRequiringTarget.includes(selectedActionType.value)
})

const handleChange = (key, event) => {
  const { target } = event

  const targetMethod = {
    triggers: () => controllerStore.setTriggerType(target.value),
    triggerTarget: () => controllerStore.setTriggerTarget(target.value),
    actions: () => controllerStore.setActionType(target.value),
  }

  targetMethod[key]()
}

const goToActionList = () => {
  controllerStore.isSettingTrigger = false
}

const addActionTarget = () => {
  controllerStore.addActionTarget({
    id: objects.value[0].id,
    name: objects.value[0].name,
  })
}

const handleDeleteActionTarget = (index) => {
  if (actionTargetList.value.length === 1) {
    return
  }
  controllerStore.removeActionTarget(index)
}

const addThisAnimation = () => {
  objectStore.updateObjectAnimation()
}

onMounted(() => {
  if (!selectedActionType.value) {
    controllerStore.setActionType('translate')
  }
  // if (!selectedObject.value && objects.value.length > 0) {
  //   objectStore.selectObject(objects.value[0].id)
  // }
  if (actionTargetList.value.length === 0 && objects.value.length > 0) {
    controllerStore.addActionTarget({
      id: objects.value[0].id,
      name: objects.value[0].name,
    })
  }
})

onUnmounted(() => {
  selectedActionType.value = null
})
</script>
<template>
  <div class="overflow-hidden text-gray-200 bg-gray-800 border border-gray-700 rounded-lg">
    <div class="flex items-center justify-between p-2 bg-gray-700 border-b border-gray-600">
      <h3 class="m-0 text-xs font-medium">트리거 설정</h3>
      <button @click="goToActionList" class="h-6 px-2 text-xs btn-primary min-w-fit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-3 h-3"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        뒤로
      </button>
    </div>
    <!-- 기본 설정: 트리거, 트리거타겟, 액션, 액션타겟 -->
    <div class="p-4 pb-0 space-y-4">
      <p v-for="(config, key) in computedTriggerConfig" :key="key" class="flex flex-col gap-2">
        <label class="pl-1 text-xs text-gray-400">{{ config.label }}</label>
        <select class="select-dark" @change="handleChange(key, $event)">
          <template v-if="Array.isArray(config.value)">
            <option v-for="item in config.value" :key="item.id" :value="item.value">
              {{ item.label || item.name }}
            </option>
          </template>

          <template v-else>
            <optgroup
              v-for="(group, groupKey) in config.value"
              :key="groupKey"
              :label="group.label"
            >
              <option v-for="item in group.value" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </optgroup>
          </template>
        </select>
      </p>
      <!-- 액션 타겟 분리 -->
      <div v-if="requireActionTarget" class="space-y-4">
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="pl-1 text-xs text-gray-400">액션 타겟</label>
            <button
              @click="addActionTarget"
              class="flex items-center h-6 gap-1 px-2 text-xs text-gray-400 border border-gray-600 rounded hover:text-primary-400 hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-3 h-3"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              타겟 추가
            </button>
          </div>
          <div v-for="(item, index) in actionTargetList" :key="item.id" class="flex gap-2">
            <select class="w-full select-dark" v-model="item.id">
              <option v-for="obj in objects" :key="obj.id" :value="obj.id">
                {{ obj.name }}
              </option>
            </select>
            <button
              @click="handleDeleteActionTarget(index)"
              class="px-2 text-gray-400 rounded hover:text-red-400 hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 액션 선택 후 바뀌는 부분 & Timing -->
    <AnimationPropertySetting v-if="selectedActionType" />
    <div class="p-4">
      <button @click="addThisAnimation" class="w-full h-6 px-2 text-xs btn-primary min-w-fit">
        이 액션을 저장
      </button>
      <!-- 객체 및에 animations으로 저장됨 -->
    </div>
  </div>
</template>
