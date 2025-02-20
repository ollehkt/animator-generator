<script setup>
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
const { mediaList } = storeToRefs(objectStore)

import MediaList from './MediaList.vue'
import MediaSetting from './MediaSetting.vue'
</script>
<template>
  <MediaList />
  <MediaSetting v-if="mediaList.length > 0" />
</template>
