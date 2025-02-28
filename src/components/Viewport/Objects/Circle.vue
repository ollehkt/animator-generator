<script setup>
import { computed } from 'vue'

const props = defineProps({
  object: {
    type: Object,
    required: true,
  },
  handleObjectPointerDown: {
    type: Function,
    required: true,
  },
  handleClick: {
    type: Function,
    required: true,
  },
})
const computedOpacity = computed(() => {
  return Math.min(Math.max(props.object.opacity / 100, 0), 1) // Convert to decimal
})
</script>
<template>
  <g :transform="`rotate(${object.rotationAngle}, ${object.position.x}, ${object.position.y})`">
    <ellipse
      :cx="object.position.x"
      :cy="object.position.y"
      :rx="object.radius.radiusX"
      :ry="object.radius.radiusY"
      :fill="object.fillStyle"
      :opacity="computedOpacity"
      @pointerdown="(e) => handleObjectPointerDown(e, object)"
      @click="(e) => handleClick(e, object)"
      :class="{ 'cursor-move': true }"
    />
  </g>
</template>
