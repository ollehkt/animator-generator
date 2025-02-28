<script setup>
import { ref, computed } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import RangeInput from '@/components/Common/RangeInput.vue'
const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)

const computedObjectSize = computed(() => {
  return selectedObject.value.objectType === 'diagram' &&
    selectedObject.value.diagramType === 'circle'
    ? {
        width: Math.round(selectedObject.value.radius.radiusX * 2),
        height: Math.round(selectedObject.value.radius.radiusY * 2),
      }
    : selectedObject.value.size
})
const updateOpacity = (value) => {
  selectedObject.value.opacity = value
}

const updateDimension = (value, dimension) => {
  if (selectedObject.value.objectType === 'diagram' && selectedObject.value.diagramType === 'circle') {
    // 원형 
    selectedObject.value.radius.radiusX = dimension === 'width' ? value / 2 : selectedObject.value.radius.radiusX;
    selectedObject.value.radius.radiusY = dimension === 'height' ? value / 2 : selectedObject.value.radius.radiusY;
  } else {
    if (dimension === 'width') {
      selectedObject.value.size.width = value;
    } else if (dimension === 'height') {
      selectedObject.value.size.height = value;
    }
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- 중심점 객채 회전도-->
    <section class="flex flex-col gap-4">
      <!-- POSITION -->
      <div class="box-border flex gap-2">
        <p class="flex flex-col gap-2 overflow-hidden">
          <label class="pl-1 text-xs text-gray-400">X</label>
          <input type="number" v-model="selectedObject.position.x" class="input-dark" />
        </p>
        <p class="flex flex-col gap-2 overflow-hidden">
          <label class="pl-1 text-xs text-gray-400">Y</label>
          <input type="number" v-model="selectedObject.position.y" class="input-dark" />
        </p>
      </div>
      <!-- SIZE || RADIUS -->
      <div class="box-border flex gap-2">
        <p class="flex flex-col gap-2 overflow-hidden">
          <label class="pl-1 text-xs text-gray-400">너비</label>
          <input
            type="number"
            v-model="computedObjectSize.width"
            @input="updateDimension($event.target.value, 'width')"
            class="input-dark"
          />
        </p>
        <p class="flex flex-col gap-2 overflow-hidden">
          <label class="pl-1 text-xs text-gray-400">높이</label>
          <input
            type="number"
            v-model="computedObjectSize.height"
            @input="updateDimension($event.target.value, 'height')"
            class="input-dark"
          />
        </p>
      </div>
      <!-- OPACITY -->
      <div class="box-border flex gap-2">
        <p class="flex flex-col gap-2 overflow-hidden">
          <label class="pl-1 text-xs text-gray-400">투명도</label>
          <RangeInput
            :rangeValue="selectedObject.opacity"
            :updateRangeValue="updateOpacity"
            :max="100"
            unit="%"
          />
        </p>
      </div>
    </section>
    <!-- 색상, 보더 -->
    <section class="flex flex-col gap-4 border-t">
      <div class="flex flex-col gap-2">
        <label class="pl-1 text-xs text-gray-400">색상</label>
        <p class="flex items-center gap-2">
          <input
            type="color"
            v-model="selectedObject.fillStyle"
            class="cursor-pointer w-10 !p-0 input-color"
          />
          <span class="font-mono text-xs text-gray-400 cursor-pointer">
            {{ selectedObject.fillStyle }}
          </span>
        </p>
      </div>
    </section>
  </div>
</template>
