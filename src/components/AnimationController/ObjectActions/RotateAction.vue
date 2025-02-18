<script setup>
import { ref } from 'vue'
import { useControllerStore, useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import RangeInput from '@/components/Common/RangeInput.vue'
const controllerStore = useControllerStore()
const objectStore = useObjectStore()
const { animationConfig } = storeToRefs(controllerStore)
const { selectedObject } = storeToRefs(objectStore)

const rotateConfig = ref({
  startAngle: 35,
  unit: 'deg',
})
const updateRotateConfig = (value) => {
  rotateConfig.value.startAngle = Number(value)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <RangeInput
      :range-value="rotateConfig.startAngle"
      :updateRangeValue="updateRotateConfig"
      :unit="rotateConfig.unit"
    />
  </div>
</template>
