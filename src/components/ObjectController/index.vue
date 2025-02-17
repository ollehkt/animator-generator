<script setup>
import CurrentObject from './CurrentObject.vue'
import ObjectList from './ObjectList.vue'

</script>

<template>
  <div>
    <div class="h-8 bg-[#1E1E1E] flex items-center px-4 border-b border-[#2A2A2A]">
      <span class="text-[#CCC] text-sm">Objects</span>
    </div>
    <section class="space-y-2">
      <CurrentObject />
      <ObjectList />
    </section>
  </div>
</template>
