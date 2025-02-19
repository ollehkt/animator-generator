<script setup>
import { storeToRefs } from 'pinia'
import { useObjectStore } from '@/store'

const objectStore = useObjectStore()
const { objects, mediaList, selectedObject } = storeToRefs(objectStore)

const getObjectIcon = (type) => {
  switch (type) {
    case 'media':
      return 'M'
    default:
      return 'M'
  }
}

const handleDeleteMedia = (id) => {
  objectStore.removeMedia(id)
}
</script>
<template>
  <!-- MEDIA LIST -->
  <div v-if="mediaList.length > 0" :class="{ 'mt-4': objects.length === 0 }">
    <h4
      class="text-xs font-medium tracking-wide border-b border-[#2A2A2A] text-[#CCC] p-2 px-3 bg-[#1A1A1A]"
    >
      Audio
    </h4>
    <ul class="text-[#E5E5E5] bg-[#262626] border-t border-[#2A2A2A] rounded-sm">
      <li
        v-for="object in mediaList"
        :key="object.id"
        class="px-2 flex items-center h-[44px] transition-all duration-200 text-sm text-[#CCC] shadow-inner cursor-pointer hover:bg-[#2F2F2F] group"
      >
        <div class="flex items-center gap-2 grow">
          <p
            class="flex items-center justify-center text-sm w-5 h-5 bg-[#404040] text-[#E5E5E5] rounded-sm"
          >
            {{ getObjectIcon(object.type) }}
          </p>
          <span class="max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap">
            {{ object.name }}
          </span>
          <button
            @click="handleDeleteMedia(object.id)"
            class="hidden w-8 h-8 px-2 ml-auto text-gray-400 rounded hover:text-red-400 hover:bg-gray-700 group-hover:block"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
