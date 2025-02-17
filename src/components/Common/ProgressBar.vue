<script setup>
const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
})
</script>
<template>
  <div class="w-full max-w-md px-4">
    <div class="mb-2 text-sm text-center text-gray-400">Loading preview...</div>
    <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div
        class="h-full transition-all duration-300 ease-out rounded-full bg-[#4F46E5]"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>
