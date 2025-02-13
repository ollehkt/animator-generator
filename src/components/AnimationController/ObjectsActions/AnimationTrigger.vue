<script setup>
import { ref, computed } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import { TRIGGER_CONFIG } from '@/helpers/consts'

const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const { objects } = storeToRefs(objectStore)

const triggerConfig = ref(TRIGGER_CONFIG)
const computedTriggerConfig = computed(() => {
  console.log('objects value:', objects.value)
  return {
    ...triggerConfig.value,
    targetObjects: {
      label: triggerConfig.value.targetObjects.label,
      value: objects.value,
    },
  }
})
</script>
<template>
  <div class="overflow-hidden text-gray-200 bg-gray-800 border border-gray-700 rounded-lg">
    <div class="p-2 bg-gray-700 border-b border-gray-600">
      <h3 class="m-0 text-xs font-medium">트리거 설정</h3>
    </div>
    <div class="p-4 space-y-4">
      <template v-for="(value, key, index) in computedTriggerConfig" :key="key">
        <p class="flex flex-col gap-2">
          <label class="pl-1 text-xs text-gray-400">{{ value.label }}</label>
          <select name="" id="" class="h-10 indent-2 border border-[#333] rounded bg-[#252526]">
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
  </div>
</template>
