<script setup>
import { HANDLE_SIZE } from '@/helpers/consts'

const props = defineProps({
  object: {
    type: Object,
    required: true
  },
  handlePositions: {
    type: Array,
    required: true
  },
  handleCursors: {
    type: Array,
    required: true
  },
  onStartResize: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <ellipse
    v-if="object.objectType === 'diagram' && object.diagramType === 'circle'"
    :cx="object.position.x"
    :cy="object.position.y"
    :rx="(object.radiusX || object.radius) + 2"
    :ry="(object.radiusY || object.radius) + 2"
    fill="none"
    stroke="#4a9eff"
    stroke-width="1"
    stroke-dasharray="4 2"
  />

  <rect
    v-if="object.objectType === 'image' || object.objectType === 'text'"
    :x="handlePositions[0].x"
    :y="handlePositions[0].y"
    :width="handlePositions[2].x - handlePositions[0].x"
    :height="handlePositions[6].y - handlePositions[0].y"
    fill="none"
    stroke="#4a9eff"
    stroke-width="1"
    stroke-dasharray="4 2"
  />

  <!-- <rect
    v-if="object.type === 'image' || object.type === 'text'"
    :x="Number(object.x) - 2"
    :y="object.type === 'text' ? Number(object.y) - Number(object.height) + 1 : Number(object.y) - 2"
    :width="Number(object.width) + 4"
    :height="Number(object.height) + 4"
    fill="none"
    stroke="#4a9eff"
    stroke-width="1"
    stroke-dasharray="4 2"
  /> -->

  <!-- Resize handles -->
  <rect
    v-for="(pos, index) in handlePositions"
    :key="index"
    :x="pos.x - HANDLE_SIZE / 2"
    :y="pos.y - HANDLE_SIZE / 2"
    :width="HANDLE_SIZE"
    :height="HANDLE_SIZE"
    fill="white"
    stroke="#4a9eff"
    stroke-width="1"
    class="handle"
    :data-direction="handleCursors[index].split('-')[0]"
    @pointerdown="(e) => onStartResize(e, object, index)"
  />
</template>

<style scoped>
.handle {
  cursor: default;
}
.handle[data-direction='nw'] { cursor: nw-resize; }
.handle[data-direction='n'] { cursor: n-resize; }
.handle[data-direction='ne'] { cursor: ne-resize; }
.handle[data-direction='e'] { cursor: e-resize; }
.handle[data-direction='se'] { cursor: se-resize; }
.handle[data-direction='s'] { cursor: s-resize; }
.handle[data-direction='sw'] { cursor: sw-resize; }
.handle[data-direction='w'] { cursor: w-resize; }
</style>
