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
</script>
<template>
  <!-- COMMON: Duration, Timing -->
  <div class="flex flex-col gap-1">
    <label class="pl-1 text-xs text-gray-400">Duration (ms)</label>
    <input type="number" v-model="animationConfig.duration" min="0" step="100" class="input-dark" />
  </div>

  <div class="flex flex-col gap-1">
    <label class="pl-1 text-xs text-gray-400">Timing</label>
    <select v-model="animationConfig.easing" class="select-dark">
      <option v-for="option in easingOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>

  <div class="flex items-center gap-2 mt-2">
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
</template>
