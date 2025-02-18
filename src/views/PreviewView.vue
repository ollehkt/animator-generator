<script setup>
import { ref, onMounted } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import Preview from '@/components/Preview/index.vue'
import ProgressBar from '@/components/Common/ProgressBar.vue'
const objectStore = useObjectStore()
const { objects } = storeToRefs(objectStore)

const isLoading = ref(true)
const progress = ref(0)

onMounted(() => {
  const duration = 1200
  const startTime = Date.now()
  
  const animate = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    progress.value = Math.min((elapsed / duration) * 100, 100)
    
    if (elapsed < duration) {
      requestAnimationFrame(animate)
    } else {
      isLoading.value = false
    }
  }
  
  requestAnimationFrame(animate)
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-[#1E1E1E]">
    <ProgressBar v-if="isLoading" :progress="progress" />
    <Preview v-else />
  </div>
</template>
