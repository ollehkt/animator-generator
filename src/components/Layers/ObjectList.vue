<script setup>
import { storeToRefs } from 'pinia'
import { useObjectStore } from '@/store'
import { ref, nextTick } from 'vue'

const objectStore = useObjectStore()
const { objects, selectedObject } = storeToRefs(objectStore)

const editingId = ref(null)
const inputRef = ref([])

const getObjectIcon = (type) => {
  switch (type) {
    case 'text':
      return 'T'
    case 'image':
      return 'I'
    default: // circle, rect, polygon
      return 'O'
  }
}

const selectThisObject = (object) => {
  objectStore.selectObject(object.id)
}

const startEditing = async (object) => {
  editingId.value = object.id
  await nextTick()
  const inputs = Array.isArray(inputRef.value) ? inputRef.value : [inputRef.value]
  const input = inputs.find((el) => el)
  input?.focus()
}

const handleNameUpdate = (object, event) => {
  if (event.key === 'Backspace') {
    event.stopPropagation()
    return
  }

  if (!['Enter', 'Escape'].includes(event.key) && event.type !== 'blur') {
    return
  }

  if (event.key === 'Escape') {
    event.stopPropagation()
    editingId.value = null
    return
  }

  const newName = event.target.value.trim()
  if (newName && newName !== object.name) {
    objectStore.updateObjectName(object.id, newName)
  }
  editingId.value = null
}

const toggleVisibility = (object) => {
  objectStore.toggleVisibility(object.id)
}
</script>
<template>
  <!-- LIST -->
  <ul
    v-if="objects.length > 0"
    class="text-[#E5E5E5] bg-[#262626] border-t border-[#2A2A2A] rounded-sm"
  >
    <li
      v-for="object in objects"
      :key="object.id"
      @click="selectThisObject(object)"
      class="p-2 py-3 transition-all duration-200 text-sm text-[#CCC] shadow-inner cursor-pointer hover:bg-[#2F2F2F]"
      :class="{ 'bg-[#323232] text-white': selectedObject?.id === object.id }"
    >
      <div class="flex items-center gap-2 group">
        <p
          class="flex items-center justify-center text-sm w-5 h-5 bg-[#404040] text-[#E5E5E5] rounded-sm"
          :class="{ '!bg-[#4F46E5] text-white': selectedObject?.id === object.id }"
        >
          {{ getObjectIcon(object.objectType) }}
        </p>
        <span
          v-if="editingId !== object.id"
          @dblclick.stop="startEditing(object)"
          class="max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {{ object.name }}
        </span>
        <input
          v-else
          ref="inputRef"
          type="text"
          :value="object.name"
          class="bg-[#404040] max-w-[78%] q0 px-2 rounded outline-none focus:ring-1 focus:ring-[#4F46E5]"
          @keyup.enter="handleNameUpdate(object, $event)"
          @keyup.esc="handleNameUpdate(object, $event)"
          @keydown.backspace.stop
          @blur="handleNameUpdate(object, $event)"
          @click.stop
        />
        <!-- visibility -->
        <div @click.stop="toggleVisibility(object)" class="h-0 ml-auto mr-2 overflow-hidden group-hover:block group-hover:h-fit">
          <svg
            v-if="object.isVisible"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        </div>
      </div>
    </li>
  </ul>
  <p
    v-else
    class="p-4 mx-3 text-xs text-center text-gray-400 border border-gray-700 border-dashed rounded-md"
  >
    오브젝트가 없습니다.
  </p>
</template>
