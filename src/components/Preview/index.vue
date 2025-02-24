<script setup>
import { ref, onMounted } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
// const { objects } = storeToRefs(objectStore)
const objects = ref([
  {
    objectData: {
      uuid: 'circle-25d46a09-4bc0-4dfc-96f7-21ee3daa522d',
      objectType: 'diagram',
      diagramType: 'circle',
      url: '',
      text: '타원입니다',
      points: {
        x: 220,
        y: 200,
      },
      style: {
        background: '#825feb',
        opacity: 100,
        color: '#825feb',
      },
      size: {
        width: 174,
        height: 108,
      },
    },
    animationData: [
      {
        triggerType: 'click',
        animation: [
          {
            triggerTarget: 'circle-25d46a09-4bc0-4dfc-96f7-21ee3daa522d',
            actionType: 'scale',
            points: null,
            ease: 'linear',
            duration: 2,
            delay: 0,
            count: null,
            direction: 'normal',
            fillMode: null,
            actionSetting: {
              scaleMagnification: 1.5,
            },
          },
        ],
        isSimultaneousness: true,
        callbackFunction: null,
      },
    ],
  },
  // {
  //   objectData: {
  //     uuid: null,
  //     objectType: 'diagram',
  //     diagramType: 'circle',
  //     url: '',
  //     text: '',
  //     points: {
  //       x: 220,
  //       y: 200,
  //     },
  //     style: {
  //       background: '#825feb',
  //       opacity: 100,
  //       color: '#825feb',
  //     },
  //     size: {
  //       width: 150,
  //       height: 200,
  //     },
  //   },
  //   animationData: [
  //     {
  //       triggerType: 'click',
  //       animation: [
  //         {
  //           triggerTarget: 'circle-20a0bba6-c2a6-495d-b2e6-b8dbcddf1c1e',
  //           actionType: 'move',
  //           points: [
  //             {
  //               x: 120,
  //               y: 100,
  //             },
  //             {
  //               x: 300,
  //               y: 100,
  //             },
  //           ],
  //           ease: 'linear',
  //           duration: 2,
  //           delay: 0,
  //           count: null,
  //           direction: 'normal',
  //           fillMode: null,
  //           actionSetting: {
  //             moveType: 'line',
  //             curviness: 1.5,
  //           },
  //         },
  //       ],
  //       isSimultaneousness: true,
  //       callbackFunction: null,
  //     },
  //   ],
  // },
])
const svgRef = ref(null)
const elementRefs = ref({})

const setRef = (el, objectId) => {
  if (el) {
    elementRefs.value[objectId] = el
  }
}

const handleTrigger = (objectId, triggerType) => {
  const targetObject = objects.value.find((obj) => obj.objectData.uuid === objectId)
  if (!targetObject) return

  // animationData에서 해당 트리거 타입에 맞는 애니메이션 찾기
  const matchingAnimations = targetObject.animationData.find(
    (data) => data.triggerType === triggerType
  )
  if (!matchingAnimations) return

  // 각 액션의 애니메이션 실행
  matchingAnimations.animation.forEach((anim) => {
    executeAnimation(anim.triggerTarget, anim)
  })
}

const getTransformOriginCenter = (element) => {
  const bbox = element.getBBox()
  const centerX = bbox.x + bbox.width / 2
  const centerY = bbox.y + bbox.height / 2

  return `${centerX}px ${centerY}px`
}

// g 태그의 첫 번째 자식 요소 리턴
const getCircleElement = (element) => {
  return element.firstElementChild
}

const executeAnimation = (objectId, animation) => {
  const element = elementRefs.value[objectId]
  if (!element) {
    console.log('Element not found:', objectId)
    return
  } // TODO: 모든 스위치문에 loop냐 아니냐에 따라 분기 처리 필요

  const animationConfig = {
    duration: (animation.duration || 1) * 1000,
    easing: animation.ease || 'linear',
    fill: animation.fillMode || 'forwards',
    delay: (animation.delay || 0) * 1000,
    iterations: animation.count || 1,
    direction: animation.direction || 'normal',
  }

  switch (animation.actionType) {
    case 'move':
      const keyframes = [
        {
          transform: `translate(0,0)`,
        },
        ...animation.points.map((point) => ({
          transform: `translate(${point.x}px, ${point.y}px)`,
        })),
      ]

      element.animate(keyframes, animationConfig)
      break

    case 'scale':
      const scale = animation.actionSetting.scaleMagnification
      element.animate(
        [
          { transformOrigin: getTransformOriginCenter(element) },
          { transformOrigin: getTransformOriginCenter(element), transform: `scale(${scale})` },
        ],
        animationConfig
      )
      break

    case 'rotate':
      element.animate(
        [
          { transformOrigin: getTransformOriginCenter(element) },
          {
            transform: `rotate(${animation.actionSetting.degree}deg)`,
            transformOrigin: getTransformOriginCenter(element),
          },
        ],
        animationConfig
      )
      break

    case 'opacity':
      element.animate(
        [{ opacity: 1 }, { opacity: animation.actionSetting.opacity / 100 }],
        animationConfig
      )
      break

    case 'color':
      const colorElement = getCircleElement(element)
      if (!colorElement) return
      colorElement.animate(
        [{ fill: colorElement.getAttribute('fill') }, { fill: animation.actionSetting.color }],
        animationConfig
      )

      break

    case 'size':
      const sizeElement = getCircleElement(element)
      if (!sizeElement) return

      // 타원일 경우 반지름 업데이트
      const newRadiusWidth = animation.actionSetting.width / 2
      const newRadiusHeight = animation.actionSetting.height / 2
      sizeElement.animate([{ rx: newRadiusWidth, ry: newRadiusHeight }], animationConfig)

      //TODO: 이미지나 텍스트일 경우 업데이트 로직 필요

      break

    case 'display':
      if (animation.actionSetting.isHidden) {
        element.style.display = 'none'
      } else {
        element.style.display = 'block'
      }
      break

    case 'open':
      if (animation.actionSetting.url) {
        window.open(
          animation.actionSetting.url,
          animation.actionSetting.isBlank ? '_blank' : '_self'
        )
      }
      break
  }
}

// 키보드 이벤트 처리를 위한 새로운 메서드
// const handleKeyEvent = (event, objects, eventType) => {
//   objects.forEach((object) => {
//     /**
//      * objectData{} -> animationData[] -> triggerType이 keyboard 이벤트일 때, animation 배열 실행
//      *
//      */
//     object.objectData
//     const matchingAnimation = object.animationData.find((data) => {
//       if (eventType === 'keyup' && data.triggerType === 'keyup') {
//         return data.keyCode === event.key
//       }
//       return data.triggerType === eventType
//     })
//   })
//   handleTrigger(object.objectData.uuid, eventType)
// }

// 컴포넌트 마운트 시 load 이벤트 트리거
onMounted(() => {
  objects.value.forEach((object) => {
    handleTrigger(object.objectData.uuid, 'load')
  })
})
</script>

<template>
  <div class="flex items-center justify-center w-full h-screen bg-white">
    <svg ref="svgRef" :width="720" :height="452" class="bg-white border border-black outline-none">
      <g
        v-for="object in objects"
        :key="object.objectData.uuid"
        :id="object.objectData.uuid"
        :ref="(el) => setRef(el, object.objectData.uuid)"
      >
        <!-- Ellipse -->
        <ellipse
          class="outline-none"
          v-if="
            object.objectData.objectType === 'diagram' && object.objectData.diagramType === 'circle'
          "
          :cx="object.objectData.points.x"
          :cy="object.objectData.points.y"
          :rx="object.objectData.size.width / 2"
          :ry="object.objectData.size.height / 2"
          :fill="object.objectData.style.background"
          @click="handleTrigger(object.objectData.uuid, 'click')"
          @dblclick="handleTrigger(object.objectData.uuid, 'dblclick')"
          @mouseenter="handleTrigger(object.objectData.uuid, 'mouseenter')"
          @mouseleave="handleTrigger(object.objectData.uuid, 'mouseleave')"
          @mouseover="handleTrigger(object.objectData.uuid, 'mouseover')"
          @mouseout="handleTrigger(object.objectData.uuid, 'mouseout')"
          @mouseup="handleTrigger(object.objectData.uuid, 'mouseup')"
          @mousedown="handleTrigger(object.objectData.uuid, 'mousedown')"
          @contextmenu="handleTrigger(object.objectData.uuid, 'contextmenu')"
          tabindex="0"
          @focus="handleTrigger(object.objectData.uuid, 'focus')"
          @focusin="handleTrigger(object.objectData.uuid, 'focusin')"
          @focusout="handleTrigger(object.objectData.uuid, 'focusout')"
          @blur="handleTrigger(object.objectData.uuid, 'blur')"
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
