<script setup>
import { ref } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
const { mediaList } = storeToRefs(objectStore)
</script>
<template>
  <div>
    <p class="flex flex-col gap-2 overflow-hidden">
      <label class="pl-1 text-xs text-gray-400">미디어 타겟</label>
      <select 
        class="select-dark" @change="handleChange(key, $event)"
        :disabled="mediaList.length === 0"
      >
        <option v-for="media in mediaList" :key="media.id" :value="media.id">
          {{ media.name }}
        </option>
      </select>
    </p>
  </div>
</template>
