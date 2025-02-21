<script setup>
import { storeToRefs } from 'pinia'
import { useObjectStore, useControllerStore } from '@/store'
import { TRIGGER_CONFIG } from '@/helpers/consts'


const objectStore = useObjectStore()
const controllerStore = useControllerStore()
const { selectedObject } = storeToRefs(objectStore)

const getTriggerTypeString = (triggerType) => {
  const trigger = TRIGGER_CONFIG.triggers.value.find((t) => t.value === triggerType)
  return trigger ? trigger.label : triggerType
}

const getActionTypeString = (actionType) => {
  for (const category of Object.values(TRIGGER_CONFIG.actions.value)) {
    const action = category.value.find((a) => a.value === actionType)
    if (action) return action.label
  }
  return actionType
}

const getTriggerTargetName = (data) => {
  return data.actionTargetList.length > 1
    ? data.actionTargetList[0].name + '<br> (  ... +' + data.actionTargetList.length + ' )'
    : data.actionTargetList[0].name
}

const editAction = (data) => {
  // todo 액션아이디가 필요한디
  console.log(data, '???')
  isSettingTrigger.value = true
}

const deleteAction = (data) => {
  objectStore.deleteObjectAnimation(data.index)
}
</script>
<template>
  <!-- OBJECT ACTION -->
  <ul v-if="selectedObject?.objectActionList?.length" class="mt-4 space-y-2">
    <li
      v-for="(data, index) in selectedObject.objectActionList"
      :key="index"
      class="h-[58px] p-3 transition-colors duration-200 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-700"
      @click="editAction(data)"
    >
      <div class="flex items-center justify-between h-full">
        <div class="flex items-center gap-3 grow">
          <!-- 트리거 -->
          <span class="w-[70px] text-xs font-medium text-white shrink-0">
            {{ getTriggerTypeString(data.triggerType) }}
          </span>
          <span class="w-[2px] h-4 bg-gray-400 rounded-full"></span>
          <!-- 트리거 타겟 이름 -->
          <span
            class="ml-auto grow text-xs font-medium text-[#CCC] pl-1"
            v-html="getTriggerTargetName(data)"
          ></span>
          <!-- 액션 rotate, scale, ... -->
          <!-- <span class="w-[70px] text-xs font-medium text-white shrink-0">
                {{ getActionTypeString(data.actionType) }}
              </span> -->
        </div>
        <button
          @click.stop="deleteAction(data)"
          class="px-2 text-gray-400 rounded hover:text-red-400"
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
    </li>
  </ul>
  <div
    v-else
    class="flex items-center justify-center h-20 mt-4 text-xs text-gray-400 border border-gray-700 border-dashed rounded-md"
  >
    액션이 없습니다
  </div>
</template>
