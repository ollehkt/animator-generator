<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
// const { objects } = storeToRefs(objectStore)
const objects = ref([
  {
    objectData: {
      uuid: 'text-4df82a71-e2d1-4340-9054-69ebc39bb9bf',
      objectType: 'text',
      // diagramType: 'circle',
      url: '',
      text: '텍스트를 입력하세요',
      points: {
        x: 100,
        y: 100,
      },
      style: {
        background: '#825feb',
        opacity: 100,
        color: '#825feb',
      },
      size: {
        width: 200,
        height: 200,
      },
      radiusX: 121.37890625,
      radiusY: 49.66796875,
    },
    animationData: [
      {
        triggerType: 'click',
        // keyCode: '40',
        animation: [
          {
            triggerTarget: 'text-4df82a71-e2d1-4340-9054-69ebc39bb9bf',
            // actionType: 'move',
            // points: [
            //   { x: 200, y: 200 },
            //   { x: 100, y: 400 },
            // ],
            // ease: 'linear',
            // duration: 2,
            // delay: 0,
            // count: null,
            // direction: 'normal',
            // fillMode: null,
            // actionSetting: {
            //   moveType: 'curve',
            //   curviness: 1.5,
            // },
            actionType: 'size',
            points: null,
            ease: 'linear',
            duration: 2,
            delay: 0,
            count: null,
            direction: 'normal',
            fillMode: null,
            actionSetting: {
              width: 500,
              height: 500,
            },
          },
        ],
        isSimultaneousness: true,
        callbackFunction: null,
      },
    ],
  },
  {
    objectData: {
      uuid: 'circle-cc3ee06c-7a46-42c5-9c50-e4a1a1fcbdb7',
      objectType: 'diagram',
      diagramType: 'circle',
      url: '',
      text: 'hello world',
      points: {
        x: 220,
        y: 200,
      },
      style: {
        background: '#000000',
        opacity: 100,
        color: '#825feb',
      },
      size: {
        width: 150,
        height: 200,
      },
    },
    animationData: [
      {
        triggerType: 'click',
        animation: [
          {
            triggerTarget: 'circle-cc3ee06c-7a46-42c5-9c50-e4a1a1fcbdb7',
            actionType: 'move',
            points: [
              {
                x: 120,
                y: 100,
              },
              {
                x: 300,
                y: 100,
              },
            ],
            ease: 'linear',
            duration: 2,
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

const updateElementPosition = (element, objectData) => {
  const { points, size, objectType } = objectData

  switch (objectType) {
    case 'image':
      element.setAttribute('x', points.x - size.width / 2)
      element.setAttribute('y', points.y - size.height / 2)
      break

    case 'text':
      // text는 중앙 정렬을 위해 text-anchor="middle" 속성이 필요
      element.setAttribute('x', points.x)
      element.setAttribute('y', points.y)
      // element.setAttribute('text-anchor', 'middle')
      // element.setAttribute('dominant-baseline', 'middle')
      break

    case 'diagram':
      if (element.tagName.toLowerCase() === 'ellipse') {
        element.setAttribute('cx', points.x)
        element.setAttribute('cy', points.y)
      }
      break
  }
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
    // case 'move':
    //   const keyframes = [
    //     {
    //       transform: `translate(0,0)`,
    //     },
    //     ...animation.points.map((point) => ({
    //       transform: `translate(${point.x}px, ${point.y}px)`,
    //     })),
    //   ]

    //   element.animate(keyframes, animationConfig)
    //   break
    case 'move':
      const moveTargetId = animation.triggerTarget || objectId
      const moveTargetElement = document.getElementById(moveTargetId)
      const moveTargetObject = objects.value.find((obj) => obj.objectData.uuid === moveTargetId)

      if (!moveTargetElement || !moveTargetObject) return

      const animPoints = animation.points
      if (!animPoints || !Array.isArray(animPoints)) return

      const targetElement = moveTargetElement.querySelector('image, text, ellipse')
      if (!targetElement) return

      const getPoints = () => {
        if (animPoints.length === 1) {
          return {
            startPoint: moveTargetObject.objectData.points,
            endPoint: animPoints[0],
          }
        }
        return {
          startPoint: animPoints[0],
          endPoint: animPoints[1],
        }
      }

      const { startPoint, endPoint } = getPoints()

      if (animPoints.length >= 2) {
        moveTargetObject.objectData.points = { ...startPoint }
        updateElementPosition(targetElement, moveTargetObject.objectData)
      }

      const createLineKeyframes = (start, end) => {
        const deltaX = end.x - start.x
        const deltaY = end.y - start.y
        return [
          { transform: 'translate(0, 0)' },
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
        ]
      }

      const createCurveKeyframes = (start, end, curviness) => {
        const controlX = (start.x + end.x) / 2
        const controlY = start.y - (Math.abs(end.x - start.x) * curviness) / 2

        return Array.from({ length: 21 }, (_, i) => {
          const t = i * 0.05
          const x =
            Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * end.x
          const y =
            Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * end.y

          return {
            transform: `translate(${x - start.x}px, ${y - start.y}px)`,
          }
        })
      }

      const keyframes =
        animation.actionSetting.moveType === 'line'
          ? createLineKeyframes(startPoint, endPoint)
          : createCurveKeyframes(startPoint, endPoint, animation.actionSetting.curviness || 1)

      moveTargetElement.animate(keyframes, animationConfig)

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

    // case 'size':
    //   const sizeElement = getCircleElement(element)
    //   if (!sizeElement) return

    //   // 타원일 경우 반지름 업데이트
    //   const newRadiusWidth = animation.actionSetting.width / 2
    //   const newRadiusHeight = animation.actionSetting.height / 2
    //   sizeElement.animate([{ rx: newRadiusWidth, ry: newRadiusHeight }], animationConfig)

    //   //TODO: 이미지나 텍스트일 경우 업데이트 로직 필요

    //   // TODO: font-size 애니메이션 적용 후 실제 속성 업데이트
    //   const currentSize = parseFloat(getComputedStyle(sizeElement).fontSize)
    //   const newSize = animation.actionSetting.height / 10 // height 값을 font-size로 변환
    //   sizeElement.animate(
    //     [{ fontSize: `${currentSize}px` }, { fontSize: `${newSize}px` }],
    //     animationConfig
    //   )

    //   break

    case 'size': {
      const sizeTargetId = animation.triggerTarget || objectId
      const sizeTargetElement = document.getElementById(sizeTargetId)
      const sizeTargetObject = objects.value.find((obj) => obj.objectData.uuid === sizeTargetId)

      if (!sizeTargetElement || !sizeTargetObject) return

      const targetElement = sizeTargetElement.querySelector('image, text, ellipse')
      if (!targetElement) return

      const currentSize = sizeTargetObject.objectData.size
      const newSize = {
        width: animation.actionSetting.width || currentSize.width,
        height: animation.actionSetting.height || currentSize.height,
      }
      const createSizeKeyframes = () => {
        switch (sizeTargetObject.objectData.objectType) {
          case 'image': {
            const startX = sizeTargetObject.objectData.points.x - currentSize.width / 2
            const startY = sizeTargetObject.objectData.points.y - currentSize.height / 2
            const endX = sizeTargetObject.objectData.points.x - newSize.width / 2
            const endY = sizeTargetObject.objectData.points.y - newSize.height / 2

            return [
              {
                width: `${currentSize.width}px`,
                height: `${currentSize.height}px`,
                x: `${startX}px`,
                y: `${startY}px`,
              },
              {
                width: `${newSize.width}px`,
                height: `${newSize.height}px`,
                x: `${endX}px`,
                y: `${endY}px`,
              },
            ]
          }

          case 'text': {
            // const sizeElement = getCircleElement(element)
            // const currentSize = parseFloat(getComputedStyle(sizeElement).fontSize)

            const currentFontSize = parseInt(targetElement.style.fontSize) || 16

            const scaleFactor = Math.min(
              newSize.width / currentSize.width,
              newSize.height / currentSize.height
            )
            const newFontSize = currentFontSize * scaleFactor

            return [{ fontSize: `${currentFontSize}px` }, { fontSize: `${newFontSize}px` }]
          }

          case 'diagram': {
            if (targetElement.tagName.toLowerCase() === 'ellipse') {
              return [
                {
                  rx: currentSize.width / 2,
                  ry: currentSize.height / 2,
                },
                {
                  rx: newSize.width / 2,
                  ry: newSize.height / 2,
                },
              ]
            }
            return []
          }

          default:
            return []
        }
      }

      const keyframes = createSizeKeyframes()
      const sizeAnimation = targetElement.animate(keyframes, animationConfig)

      sizeAnimation.onfinish = () => {
        sizeTargetObject.objectData.size = { ...newSize }

        switch (sizeTargetObject.objectData.objectType) {
          case 'image':
            targetElement.setAttribute('width', newSize.width)
            targetElement.setAttribute('height', newSize.height)
            targetElement.setAttribute(
              'x',
              sizeTargetObject.objectData.points.x - newSize.width / 2
            )
            targetElement.setAttribute(
              'y',
              sizeTargetObject.objectData.points.y - newSize.height / 2
            )
            break

          case 'text':
            const scaleFactor = Math.min(
              newSize.width / currentSize.width,
              newSize.height / currentSize.height
            )
            const currentFontSize = parseInt(targetElement.style.fontSize) || 16
            targetElement.style.fontSize = `${currentFontSize * scaleFactor}px`
            break

          case 'diagram':
            if (targetElement.tagName.toLowerCase() === 'ellipse') {
              targetElement.setAttribute('rx', newSize.width / 2)
              targetElement.setAttribute('ry', newSize.height / 2)
            }
            break
        }
      }

      break
    }

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

const handleKeyEvent = (event, eventType) => {
  objects.value.forEach((object) => {
    const matchingAnimation = object.animationData.find((data) => {
      if (data.triggerType === eventType) {
        return data.keyCode === String(event.keyCode) || data.keyCode === event.key
      }
      return false
    })

    if (matchingAnimation) {
      handleTrigger(object.objectData.uuid, eventType)
    }
  })
}

onMounted(() => {
  objects.value.forEach((object) => {
    handleTrigger(object.objectData.uuid, 'load')
  })
  window.addEventListener('keypress', (event) => {
    handleKeyEvent(event, 'keypress')
  })
  window.addEventListener('keydown', (event) => {
    handleKeyEvent(event, 'keydown')
  })
  window.addEventListener('keyup', (event) => {
    handleKeyEvent(event, 'keyup')
  })
})

onUnmounted(() => {
  window.removeEventListener('keypress', handleKeyEvent)
  window.removeEventListener('keydown', handleKeyEvent)
  window.removeEventListener('keyup', handleKeyEvent)
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
          class="cursor-pointer outline-none"
        >
          {{ object.objectData.text }}
        </text>
      </g>
    </svg>
  </div>
</template>
