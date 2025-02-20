<script setup>
import { useObjectStore } from '@/store/objectStore'
import { storeToRefs } from 'pinia'
import { TRIGGER_CONFIG } from '@/helpers/consts'

const objectStore = useObjectStore()
const { viewportActionList } = storeToRefs(objectStore)

// const getTriggerTargetName = (data) => {
//   return data.actionTargetList.length > 1
//     ? data.actionTargetList[0].name + '<br> (  ... +' + data.actionTargetList.length + ' )'
//     : data.actionTargetList[0].name
// }

// const getActionTypeString = (actionType) => {
//   for (const category of Object.values(TRIGGER_CONFIG.actions.value)) {
//     const action = category.value.find((a) => a.value === actionType)
//     if (action) return action.label
//   }
//   return actionType
// }
</script>
<template>
  <div>
    <!-- <pre>{{ viewportActionList }}</pre> -->
    <ul class="mt-4 space-y-2">
      <li
        v-for="action in viewportActionList"
        :key="action.id"
        class="h-[58px] p-3 transition-colors duration-200 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-700"
      >
        <div class="flex items-center justify-between h-full">
          <div class="flex items-center gap-3 grow">
            <!-- <span>{{ getActionTypeString(action.actionType) }}</span> -->
            <!-- <span>{{ getTriggerTargetName(action) }}</span> -->
            {{ action.actionType }}
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
  </div>
</template>
