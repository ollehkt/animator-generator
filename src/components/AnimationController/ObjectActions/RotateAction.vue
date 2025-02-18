<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useControllerStore, useObjectStore } from '@/store'
import RangeInput from '@/components/Common/RangeInput.vue'

// Store setup
const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const { animationConfig } = storeToRefs(controllerStore)

// Constants
const DIRECTIONS = [
  { value: 'clockwise', label: '시계방향' },
  { value: 'counterclockwise', label: '반시계방향' },
]

// Reactive state
const rotateConfig = ref({
  startAngle: animationConfig.value.rotate.x,
  unit: 'deg',
  direction: 'clockwise',
})

// Methods
const updateRotateConfig = (value) => {
  const numValue = Number(value)
  const direction = rotateConfig.value.direction
  rotateConfig.value.startAngle = direction === 'counterclockwise' ? -numValue : numValue
  syncWithStore()
}

const setDirection = (value) => {
  rotateConfig.value.direction = value
  const currentAngle = Math.abs(rotateConfig.value.startAngle)
  rotateConfig.value.startAngle = value === 'counterclockwise' ? -currentAngle : currentAngle
  syncWithStore()
}

// Helper function to sync with store
const syncWithStore = () => {
  animationConfig.value.rotate.x = rotateConfig.value.startAngle
}

// Watch for store changes
watch(
  () => animationConfig.value.rotate.x,
  (newValue) => {
    rotateConfig.value.startAngle = newValue
    rotateConfig.value.direction = newValue < 0 ? 'counterclockwise' : 'clockwise'
  }
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- DEG -->
    <div>
      <label class="pl-1 text-xs text-gray-400">회전 각도</label>
      <RangeInput
        :range-value="Math.abs(rotateConfig.startAngle)"
        :updateRangeValue="updateRotateConfig"
        :unit="rotateConfig.unit"
      />
    </div>
    <!-- 방향 -->
    <div class="flex flex-col gap-4 items-center1">
      <label class="pl-1 text-xs text-gray-400">회전 방향</label>
      <div class="flex items-center border border-gray-700 rounded-md">
        <label
          v-for="direction in DIRECTIONS"
          :key="direction.value"
          class="relative w-1/2 text-center grow"
        >
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
</template>
