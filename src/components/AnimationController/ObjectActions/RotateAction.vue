<script setup>
import { ref } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import RangeInput from '@/components/Common/RangeInput.vue'
const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const { animationConfig } = storeToRefs(controllerStore)

const direction = ref('clockwise') // local state

const rotateConfig = ref({
  startAngle: animationConfig.value.rotate.x,
  unit: 'deg',
})

const updateRotateConfig = (value) => {
  rotateConfig.value.startAngle = Number(value)
}

const setDirection = (value) => {
  direction.value = value
  
  const currentAngle = Math.abs(rotateConfig.value.startAngle)
  rotateConfig.value.startAngle = value === 'counterclockwise' ? -currentAngle : currentAngle
  // Sync with store
  animationConfig.value.rotate.x = rotateConfig.value.startAngle
}

const directions = [
  { value: 'clockwise', label: '시계방향' },
  { value: 'counterclockwise', label: '반시계방향' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <RangeInput
      :range-value="Math.abs(rotateConfig.startAngle)"
      :updateRangeValue="updateRotateConfig"
      :unit="rotateConfig.unit"
    />
    <div>
      <div class="flex items-center gap-2">
        <label class="pl-1 text-xs text-gray-400">회전 방향</label>
        <div class="flex items-center border border-gray-700 rounded-md">
          <label v-for="direction in directions" :key="direction.value" class="relative">
            <input
              type="radio"
              v-model="rotateConfig.direction"
              :value="direction.value"
              class="absolute w-full h-full opacity-0 cursor-pointer"
              @change="setDirection(direction.value)"
            />
            <span
              class="block px-2 py-1 text-xs transition-colors rounded-md cursor-pointer text-"
              :class="[
                rotateConfig.direction === direction.value
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
              ]"
            >
              {{ direction.label }}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
