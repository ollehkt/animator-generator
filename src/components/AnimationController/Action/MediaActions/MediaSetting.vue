<script setup>
import { ref, computed } from 'vue'
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

import RangeInput from '@/components/Common/RangeInput.vue'

const controllerStore = useControllerStore()
const { selectedActionType } = storeToRefs(controllerStore)

const { mediaList } = storeToRefs(controllerStore)
const volume = ref(50)
const audioConfig = ref([
  {
    label: 'Fade In',
    value: 0.5,
    unit: 's',
    showOn: ['play'],
  },
  {
    label: 'Fade Out',
    value: 0.5,
    unit: 's',
    showOn: ['play', 'mute', 'pause'],
  },
  {
    label: 'Delay',
    value: 0,
    unit: 's',
    showOn: ['play', 'mute', 'pause', 'volume'],
  },
  {
    label: 'Loop',
    value: false,
    boolean: true,
    showOn: ['play'],
  },
])

const filteredAudioConfig = computed(() => {
  return audioConfig.value.filter((item) => item.showOn.includes(selectedActionType.value))
})

const toggleLoop = () => {
  const loopConfig = audioConfig.value.find((item) => item.label === 'Loop')
  if (loopConfig) {
    loopConfig.value = !loopConfig.value
  }
}

const updateRangeValue = (value) => {
  volume.value = Number(value)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <RangeInput
      v-if="selectedActionType === 'volume'"
      :range-value="volume"
      :updateRangeValue="updateRangeValue"
      :unit="'%'"
    />
    <div v-for="item in filteredAudioConfig" :key="item.label">
      <!-- 반복재생 -->
      <p v-if="item.boolean" class="flex items-center gap-2">
        <label class="pl-1 text-xs text-gray-400">반복재생</label>
        <label
          :class="item.value ? 'bg-gray-800' : 'bg-gray-600'"
          class="relative flex items-center w-8 h-4 border border-gray-700 cursor-pointer rounded-2xl"
          for="loop"
          @click.prevent="toggleLoop"
        >
          <input v-model="item.value" class="hidden" name="loop" type="checkbox" />
          <div
            :class="item.value ? 'translate-x-[15px] bg-[#825feb]' : 'translate-x-[0px]'"
            class="w-3 h-3 rounded-full absolute top-[1px] transition-all duration-300 left-[1px] bg-gray-400"
          ></div>
        </label>
      </p>
      <!-- INPUT -->
      <p v-else class="flex flex-col w-full gap-2">
        <label class="pl-1 text-xs text-gray-400">
          {{ item.label }}
          <span v-if="item.unit" class="text-xs text-gray-400">({{ item.unit }})</span>
        </label>
        <input type="number" v-model="item.value" min="0" step="0.1" class="input-dark" />
      </p>
    </div>
  </div>
</template>
