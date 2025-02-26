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
  <!-- preserveAspectRatio="xMidYMid meet" : keep ratio -->
  <!-- 원본이미지 비율 무시: preserveAspectRatio="none" -->
  <image
    preserveAspectRatio="xMidYMid meet"
    :x="Number(object.position.x) || 0"
    :y="Number(object.position.y) || 0"
    :width="Number(object.size.width) || 100"
    :height="Number(object.size.height) || 100"
    :href="object.url"
    :class="{ 'cursor-move': true }"
    @pointerdown="(e) => handleObjectPointerDown(e, object)"
    @click="(e) => handleClick(e, object)"
  />
</template>
