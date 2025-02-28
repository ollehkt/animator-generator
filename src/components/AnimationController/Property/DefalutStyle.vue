<script setup>
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)

</script>

<template>
  <div class="space-y-4">
    <!-- 사이즈 위치 오파시티 중심점 객채 회전도-->
    <section class="flex flex-col gap-4">
      <!-- 사이즈 -->
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
      <!-- 오파시티 -->
      <div class="box-border flex gap-2">
        <p class="flex flex-col gap-2 overflow-hidden">
          <label class="pl-1 text-xs text-gray-400">투명도</label>
          <input type="number" v-model="selectedObject.opacity" class="input-dark" />
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
