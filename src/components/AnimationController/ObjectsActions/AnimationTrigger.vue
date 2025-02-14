<script setup>
import { ref, computed } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import { TRIGGER_CONFIG } from '@/helpers/consts'

import AnimationPropertySetting from './AnimationPropertySetting.vue'

const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const { objects } = storeToRefs(objectStore)

const triggerConfig = ref(TRIGGER_CONFIG)
const computedTriggerConfig = computed(() => {
  return {
    ...triggerConfig.value,
    targetObjects: {
      label: triggerConfig.value.targetObjects.label,
      value: objects.value,
    },
    actionTarget: {
      label: triggerConfig.value.actionTarget.label,
      value: objects.value,
    },
  }
})

const setActionType = (key, value) => {
  if (key !== 'actions') return
  controllerStore.setActionType(value)
}

const goToActionList = () => {
  controllerStore.isEditingTrigger = false
}
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
        <!-- <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg> -->

        
      </button>
    </div>
    <!-- 기본 설정 -->
    <div class="p-4 pb-0 space-y-2">
      <template v-for="(value, key, index) in computedTriggerConfig" :key="key">
        <p class="flex flex-col gap-2">
          <label class="pl-1 text-xs text-gray-400">{{ value.label }}</label>
          <select class="select-dark" @change="(e) => setActionType(key, e.target.value)">
            <template v-if="Array.isArray(value.value)">
              <option v-for="item in value.value" :key="item.value" :value="item.value">
                {{ item.label || item.name }}
              </option>
            </template>
            <template v-else>
              <option v-for="(optValue, key) in value.value" :key="key" :value="key">
                {{ key }}
              </option>
            </template>
          </select>
        </p>
      </template>
    </div>
    <!-- 액션 선택 후 각각 설정 -->
    <AnimationPropertySetting />
  </div>
</template>
