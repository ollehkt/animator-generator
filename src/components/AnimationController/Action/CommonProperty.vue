<script setup>
import { ref } from 'vue'
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'
import { EASING_OPTIONS } from '@/helpers/consts'

const controllerStore = useControllerStore()
const { animationConfig } = storeToRefs(controllerStore)
const easingOptions = ref(EASING_OPTIONS)

const toggleLoop = () => {
  animationConfig.value.loop = !animationConfig.value.loop
}

const getEasingPath = (easingType) => {
  // Convert cubic-bezier values to SVG path
  if (easingType.includes('cubic-bezier')) {
    const values = easingType.match(/\d+\.?\d*/g).map(Number);
    return `M0,100 C${values[0] * 100},${100 - values[1] * 100} ${values[2] * 100},${100 - values[3] * 100} 100,0`;
  }

  const curves = {
    // Simple
    'linear': 'M0,100 L100,0',
    'ease': 'M0,100 C25,100 25,0 100,0',
    
    // Standard
    'ease-in': 'M0,100 C50,100 100,0 100,0',
    'ease-out': 'M0,100 C0,100 50,0 100,0',
    'ease-in-out': 'M0,100 C25,100 25,0 100,0',
    
    // Expo (using the cubic-bezier values from your options)
    // (0.95, 0.05, 0.795, 0.035)
    'expo-in': 'M0,100 C95,95 79.5,96.5 100,0',
    // (0.19, 1, 0.22, 1)
    'expo-out': 'M0,100 C19,0 22,0 100,0',
    // (0.87, 0, 0.13, 1)
    'expo-in-out': 'M0,100 C87,100 13,0 100,0',
    
    // Elastic (using the same cubic-bezier values as specified)
    // (0.95, 0.05, 0.795, 0.035)
    'elastic-in': 'M0,100 C95,95 79.5,96.5 100,0',
    // (0.37, 0, 0.63, 1)
    'elastic-out': 'M0,100 C37,100 63,0 100,0',
    // (0.87, 0, 0.13, 1)
    'elastic-in-out': 'M0,100 C87,100 13,0 100,0'
  }
  
  return curves[easingType.toLowerCase()] || curves['ease-in-out']
}
</script>
<template>
  <!-- COMMON: Duration, Timing -->
  <div class="flex flex-col gap-4">
    <!-- TIMING -->
    <div class="flex gap-4">
      <div class="relative w-[60px] h-[60px] overflow-hidden bg-gray-800 border border-gray-700 rounded shrink-0">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <!-- Grid lines -->
          <line x1="0" y1="0" x2="0" y2="100" stroke="#374151" stroke-width="1" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="#374151" stroke-width="1" />
  
          <!-- Easing curve -->
          <path
            :d="getEasingPath(animationConfig.easing)"
            fill="none"
            stroke="#825feb"
            stroke-width="2"
          />
        </svg>
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="pl-1 text-xs text-gray-400">Timing</label>
        <select v-model="animationConfig.easing" class="select-dark">
          <template v-for="category in ['Simple', 'Standard', 'Expo', 'Elastic']" :key="category">
            <optgroup :label="category">
              <option
                v-for="option in easingOptions.filter((opt) => opt.category === category)"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </optgroup>
          </template>
        </select>
      </div>

    </div>
    <!-- 애니메이션 타이밍 그래프 -->

    <!-- DURATION -->
    <div class="flex flex-col gap-2">
      <label class="pl-1 text-xs text-gray-400">Duration (ms)</label>
      <input
        type="number"
        v-model="animationConfig.duration"
        min="0"
        step="100"
        class="input-dark"
      />
    </div>

    <!-- DELAY -->
    <div class="flex flex-col gap-2">
      <label class="pl-1 text-xs text-gray-400">Delay (ms)</label>
      <input type="number" v-model="animationConfig.delay" min="0" step="100" class="input-dark" />
    </div>

    <!-- LOOP -->
    <div class="flex items-center gap-2">
      <label class="pl-1 text-xs text-gray-400">Loop/Infinite</label>
      <label
        :class="animationConfig.loop ? 'bg-gray-800' : 'bg-gray-600'"
        class="relative flex items-center w-8 h-4 border border-gray-700 cursor-pointer rounded-2xl"
        for="loop"
        @click.prevent="toggleLoop"
      >
        <input v-model="animationConfig.loop" class="hidden" name="loop" type="checkbox" />
        <div
          :class="animationConfig.loop ? 'translate-x-[15px] bg-[#825feb]' : 'translate-x-[0px]'"
          class="w-3 h-3 rounded-full absolute top-[1px] transition-all duration-300 left-[1px] bg-gray-400"
        ></div>
      </label>
    </div>
  </div>
</template>
