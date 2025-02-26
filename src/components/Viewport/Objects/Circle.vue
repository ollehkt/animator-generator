<script setup>
defineProps({
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
</script>
<template>
  <ellipse
    :cx="object.position.x"
    :cy="object.position.y"
    :rx="object.radiusX || object.radius"
    :ry="object.radiusY || object.radius"
    :fill="object.fillStyle"
    @pointerdown="(e) => handleObjectPointerDown(e, object)"
    @click="(e) => handleClick(e, object)"
    :class="{ 'cursor-move': true }"
  />
</template>
