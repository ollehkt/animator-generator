<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-8">
    <p class="text-2xl font-medium text-gray-300">존재하지 않는 프로젝트입니다.</p>
    <button class="btn-primary" @click="router.push('/')">프로젝트 목록으로</button>
  </div>
</template>
