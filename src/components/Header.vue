<script setup>
import { useRouter } from 'vue-router'
import { useControllerStore } from '@/store'
import { storeToRefs } from 'pinia'

const router = useRouter()

const controllerStore = useControllerStore()
const { showSourcePreview } = storeToRefs(controllerStore)

const openPreview = () => {
  window.open('/preview', '_blank')
}
</script>
<template>
  <header
    class="h-[50px] absolute top-0 left-0 w-full border-b border-[#000] flex items-center justify-end gap-6 px-10"
  >
    <h1 class="mr-auto text1-lg">🍟L🏀O⛱️GO</h1>
    <slot></slot>
    <button 
      @click="showSourcePreview = true"
      class="text-[#CCCCCC] flex items-center gap-1 text-xs group hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#CCCCCC"
        class="w-4 h-4 group-hover:stroke-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      </svg>
      소스코드
    </button>
    <button 
      @click="openPreview"
      class="text-[#CCCCCC] flex items-center gap-1 text-xs group hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#CCCCCC"
        class="w-4 h-4 group-hover:stroke-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
        />
      </svg>
      미리보기
    </button>
  </header>
</template>
