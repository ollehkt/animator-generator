<script setup>
defineProps({
  object: {
    type: Object,
    required: true,
  },
  editingObjectId: {
    type: String,
    required: false,
  },
  handleObjectPointerDown: {
    type: Function,
    required: true,
  },
  handleClick: {
    type: Function,
    required: true,
  },
  handleDoubleClick: {
    type: Function,
    required: true,
  },
  finishEditing: {
    type: Function,
    required: true,
  },
  handleTextChange: {
    type: Function,
    required: true,
  },
})
</script>
<template>
  <text>{{ editingObjectId }}</text>
  <text
    v-if="editingObjectId !== object.id"
    :x="object.position.x"
    :y="object.position.y"
    :fill="object.fillStyle || '#000'"
    dominant-baseline="hanging"
    text-anchor="start"
    @pointerdown="(e) => handleObjectPointerDown(e, object)"
    @click="(e) => handleClick(e, object)"
    @dblclick="(e) => handleDoubleClick(e, object)"
    :class="{ 'cursor-move': true }"
  >
    {{ object.text }}
    {{ editingObjectId }}
  </text>

  <!-- Editable text -->
  <foreignObject
    v-if="editingObjectId === object.id"
    :x="object.position.x"
    :y="object.position.y"
    :width="object.size.width || 200"
    :height="object.size.height || 50"
  >
    <textarea
      :id="`text-edit-${object.id}`"
      xmlns="http://www.w3.org/1999/xhtml"
      :value="object.text"
      @input="(e) => handleTextChange(object, e)"
      @blur="finishEditing(object)"
      @keydown.enter="finishEditing(object)"
      :style="{
        border: 'none',
        background: 'transparent',
        resize: 'none',
        color: object.fillStyle || '#000',
        width: '100%',
        height: '100%',
        outline: 'none',
        font: 'inherit',
        padding: '0',
        margin: '0',
        overflow: 'hidden',
      }"
    />
  </foreignObject>
</template>
