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
      text: '',
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
        width: 100,
        height: 400,
      },
      // TODO: 타원에 꼭 필요한지 확인 필요
      // radiusX: 101.37890625,
      // radiusY: 49.66796875,
    },
    animationData: [
      {
        triggerType: 'click',
        animation: [
          {
            triggerTarget: 'circle-25d46a09-4bc0-4dfc-96f7-21ee3daa522d',
            actionType: 'move',
            points: [
              {
                x: 400,
                y: 100,
              },
              {
                x: 400,
                y: 200,
              },
              {
                x: -120,
                y: -120,
              },
              {
                x: 400,
                y: 200,
              },
            ],
            ease: 'linear',
            duration: 5,
            delay: 0,
            count: null,
            direction: 'normal',
            fillMode: null,
            actionSetting: {
              moveType: 'line',
              curviness: 1.5,
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

const handleTrigger = (objectId, triggerType) => {
  const targetObject = objects.value.find((obj) => obj.objectData.uuid === objectId)
  if (!targetObject) return

  // animationData에서 해당 트리거 타입에 맞는 애니메이션 찾기
  const matchingAnimations = targetObject.animationData.find(
    (data) => data.triggerType === triggerType
  )

  // 각 액션의 애니메이션 실행

  matchingAnimations.animation.forEach((anim) => {
    executeAnimation(anim.triggerTarget, anim)
  })
}

const executeAnimation = (objectId, animation) => {
  const element = document.getElementById(objectId)
  if (!element) {
    console.log('Element not found:', objectId)
    return
  }
  // TODO: 모든 스위치문에 loop냐 아니냐에 따라 분기 처리 필요

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
      const circleColorElement = getCircleElement(element)
      if (!circleColorElement) return
      circleColorElement.animate(
        [
          { fill: circleColorElement.getAttribute('fill') },
          { fill: animation.actionSetting.color },
        ],
        animationConfig
      )
      // TODO: 텍스트에 색상 애니메이션 적용 필요
      // if (element.tagName === 'text') {
      // }
      break

    case 'size':
      const circleSizeElement = getCircleElement(element)
      if (!circleSizeElement) return
      const newRadius = animation.actionSetting.width / 2

      circleSizeElement.animate([{ r: newRadius }], animationConfig)

      // 애니메이션 완료 후 실제 속성 업데이트

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
const handleKeyEvent = (event, eventType) => {
  objects.value.forEach((object) => {
    const matchingAnimation = object.animationData.find((data) => {
      if (eventType === 'keyup' && data.triggerType === 'keyup') {
        return data.keyCode === event.key
      }
      return data.triggerType === eventType
    })

    if (matchingAnimation) {
      handleTrigger(object.objectData.uuid, eventType)
    }
  })
}

// 컴포넌트 마운트 시 load 이벤트 트리거
// onMounted(() => {
//   objects.value.forEach((object) => {
//     handleTrigger(object.objectData.uuid, 'load')
//   })
// })
</script>

<template>
  <div class="flex items-center justify-center w-full h-screen bg-white">
    <svg ref="svgRef" :width="720" :height="452" class="bg-white border border-black outline-none">
      <g v-for="object in objects" :key="object.objectData.uuid" :id="object.objectData.uuid">
        <!-- Circle -->
        <circle
          class="outline-none"
          v-if="
            object.objectData.objectType === 'diagram' && object.objectData.diagramType === 'circle'
          "
          :cx="object.objectData.points.x"
          :cy="object.objectData.points.y"
          :r="object.objectData.size.width / 2"
          :fill="object.objectData.style.background"
          @click="handleTrigger(object.objectData.uuid, 'click')"
        />

        <!-- Image -->
        <image
          v-if="object.objectData.objectType === 'image'"
          :x="object.objectData.points.x"
          :y="object.objectData.points.y"
          :width="object.objectData.size.width"
          :height="object.objectData.size.height"
          :href="object.objectData.url"
          preserveAspectRatio="xMidYMid meet"
          @click="handleTrigger(object.objectData.uuid, 'click')"
          @dblclick="handleTrigger(object.objectData.uuid, 'dblclick')"
          @mouseenter="handleTrigger(object.objectData.uuid, 'mouseover')"
          @mouseleave="handleTrigger(object.objectData.uuid, 'mouseleave')"
          @mouseup="handleTrigger(object.objectData.uuid, 'mouse-up')"
          @mousedown="handleTrigger(object.objectData.uuid, 'mousedown')"
          @focus="handleTrigger(object.objectData.uuid, 'focus')"
          @blur="handleTrigger(object.objectData.uuid, 'blur')"
          tabindex="0"
        />

        <!-- Text -->
        <text
          v-if="object.objectData.objectType === 'text'"
          :x="object.objectData.points.x"
          :y="object.objectData.points.y"
          :fill="object.objectData.style.color || '#000'"
          @click="handleTrigger(object.objectData.uuid, 'click')"
          @dblclick="handleTrigger(object.objectData.uuid, 'dblclick')"
          @mouseenter="handleTrigger(object.objectData.uuid, 'mouseover')"
          @mouseleave="handleTrigger(object.objectData.uuid, 'mouseleave')"
          @mouseup="handleTrigger(object.objectData.uuid, 'mouse-up')"
          @mousedown="handleTrigger(object.objectData.uuid, 'mousedown')"
          @focus="handleTrigger(object.objectData.uuid, 'focus')"
          @blur="handleTrigger(object.objectData.uuid, 'blur')"
          tabindex="0"
        >
          {{ object.objectData.text }}
        </text>
      </g>
    </svg>
  </div>
</template>
