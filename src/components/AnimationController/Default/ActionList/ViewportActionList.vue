<script setup>
import { useObjectStore } from '@/store/objectStore'
import { storeToRefs } from 'pinia'
import { TRIGGER_CONFIG } from '@/helpers/consts'

const objectStore = useObjectStore()
const { viewportActionList } = storeToRefs(objectStore)

const getActionTargetName = (data) => {
  return data.actionTargetList.length > 1
    ? data.actionTargetList[0].name + '<br> (  ... +' + data.actionTargetList.length + ' )'
    : data.actionTargetList[0].name
}

const getActionTypeString = (actionType) => {
  for (const category of Object.values(TRIGGER_CONFIG.actions.value)) {
    const action = category.value.find((a) => a.value === actionType)
    if (action) return action.label
  }
  return actionType
}
</script>
<template>
  <div class="mt-4 border1">
    <ul v-if="viewportActionList.length" class="mt-2 space-y-2">
      <li
        v-for="action in viewportActionList"
        :key="action.id"
        class="h-[58px] p-3 transition-colors duration-200 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-700"
      >
        <div class="flex items-center justify-between h-full">
          <div class="flex items-center gap-3 grow">
            <span class="w-[70px] text-xs font-medium text-white shrink-0">
              {{ getActionTypeString(action.actionType) }}
            </span>
            <span class="w-[2px] h-4 bg-gray-400 rounded-full"></span>
            <span
              class="ml-auto grow text-xs font-medium text-[#CCC] pl-1"
              v-html="getActionTargetName(action)"
            ></span>
            
          </div>
          <button class="px-2 text-gray-400 rounded hover:text-red-400">
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
  </div>
</template>
