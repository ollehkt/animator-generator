<script setup>
import { ref } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
const { selectedObject } = storeToRefs(objectStore)

const color = ref('#000000')
const isCopied = ref(false)

const copyColor = () => {
  navigator.clipboard.writeText(color.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 1000)
}
</script>
<template>
  <div>
    <p class="flex flex-col gap-2 overflow-hidden">
      <label class="pl-1 text-xs text-gray-400">색상 변경</label>
      <div class="flex items-center gap-2">
        <input type="color" v-model="color" class="cursor-pointer w-10 !p-0 input-color"/>
        <span @click="copyColor" class="font-mono text-xs text-gray-400 cursor-pointer">{{ color }}</span>
        <em v-if="isCopied" class="text-xs text-gray-400 copied-indicator">copied</em>
      </div>
    </p>
  </div>
</template>
<style scoped>
.copied-indicator {
  font-size: 0.75rem;
  color: rgb(156 163 175);
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}</style>