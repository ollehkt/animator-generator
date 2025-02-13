<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import ObjectProperty from './ObjectProperty.vue'
import AnimationTrigger from './AnimationTrigger.vue'
import AnimationProperty from './AnimationProperty.vue'




</script>
<template>
  <div class="flex flex-col gap-6">
    <!-- <ObjectProperty /> -->
    <AnimationTrigger />
    <AnimationProperty />
  </div>
</template>
