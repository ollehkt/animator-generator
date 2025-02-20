<script setup>
import { ref, onMounted } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
const { objects } = storeToRefs(objectStore)
const svgRef = ref(null)

const handleTrigger = (objectId, triggerType) => {
  const targetObject = objects.value.find((obj) => obj.id === objectId)
  if (!targetObject) return

  // 트리거 타입에 맞는 액션 찾기
  const matchingActions = targetObject.objectActionList.filter(
    (action) => action.triggerType === triggerType
  )

  // 각 액션의 애니메이션 실행
  matchingActions.forEach((action) => {
    action.animation.forEach((anim) => {
      executeAnimation(anim.triggerTarget, anim)
    })
  })
}

const executeAnimation = (objectId, animation) => {
  const element = document.getElementById(objectId)
  if (!element) {
    console.log('Element not found:', objectId)
    return
  }

  const animationConfig = {
    duration: animation.duration || 1000,
    easing: animation.ease || 'linear',
    fill: 'forwards',
  }

  switch (animation.actionType) {
    case 'translate':
      element.animate(
        [
          { transform: 'translate(0, 0)' },
          { transform: `translate(${animation.targetPOS.x}px, ${animation.targetPOS.y}px)` },
        ],
        animationConfig
      )
      break

    case 'scale':
      element.animate(
        [
          { transform: `scale(${animation.scaleStart || 1})` },
          { transform: `scale(${animation.scaleEnd})` },
        ],
        animationConfig
      )
      break

    case 'rotate':
      element.animate(
        [{ transform: 'rotate(0deg)' }, { transform: `rotate(${animation.rotate}deg)` }],
        animationConfig
      )
      break

    case 'opacity':
      element.animate(
        [{ opacity: animation.opacityStart || 1 }, { opacity: animation.opacityEnd }],
        animationConfig
      )
      break
  }
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-screen bg-white">
    <svg ref="svgRef" :width="720" :height="452" class="bg-white">
      <g v-for="object in objects" :key="object.id" :id="object.id">
        <!-- Circle -->
        <ellipse
          v-if="object.objectType === 'diagram' && object.diagramType === 'circle'"
          :cx="object.position.x"
          :cy="object.position.y"
          :rx="object.radius"
          :ry="object.radius"
          :fill="object.fillStyle"
          @click="handleTrigger(object.id, 'click')"
          @mouseenter="handleTrigger(object.id, 'hover')"
        />

        <!-- Image -->
        <image
          v-if="object.objectType === 'image'"
          :x="object.position.x"
          :y="object.position.y"
          :width="object.size.width"
          :height="object.size.height"
          :href="object.url"
          preserveAspectRatio="xMidYMid meet"
          @click="handleTrigger(object.id, 'click')"
          @mouseenter="handleTrigger(object.id, 'hover')"
        />

        <!-- Text -->
        <text
          v-if="object.objectType === 'text'"
          :x="object.position.x"
          :y="object.position.y"
          :fill="object.color || '#000'"
          @click="handleTrigger(object.id, 'click')"
          @mouseenter="handleTrigger(object.id, 'hover')"
        >
          {{ object.text }}
        </text>
      </g>
    </svg>
  </div>
</template>
