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
      <div class="flex items-center gap-2">
        <p
          class="flex items-center justify-center text-sm w-5 h-5 bg-[#404040] text-[#E5E5E5] rounded-sm"
          :class="{ '!bg-[#4F46E5] text-white': selectedObject?.id === object.id }"
        >
          {{ getObjectIcon(object.type) }}
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
