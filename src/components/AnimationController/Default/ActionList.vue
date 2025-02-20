<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useObjectStore, useControllerStore } from '@/store'
import { TRIGGER_CONFIG } from '@/helpers/consts'

const objectStore = useObjectStore()
const controllerStore = useControllerStore()
const { objects, selectedObject } = storeToRefs(objectStore)
const { isSettingTrigger } = storeToRefs(controllerStore)

const handleAddAction = () => {
  isSettingTrigger.value = true
}

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
  <div class="overflow-hidden text-gray-200 bg-gray-800 border border-gray-700 rounded-lg">
    <div class="p-2 bg-gray-700 border-b border-gray-600">
      <h3 class="m-0 text-xs font-medium">애니메이션 목록</h3>
    </div>
    <div
      v-if="objects.length === 0"
      class="flex items-center justify-center h-20 m-4 text-xs text-gray-400 border border-gray-700 border-dashed rounded-md"
    >
      오브젝트가 없습니다.
    </div>
    <div v-else class="p-4">
      <button @click="handleAddAction" class="justify-center w-full btn-primary">
        <svg
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
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
        액션 추가
      </button>
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
        등록된 애니메이션이 없습니다
      </div>
    </div>
  </div>
</template>
