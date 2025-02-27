<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
// const { objects } = storeToRefs(objectStore)
const objects = ref([
  {
    objectData: {
      uuid: 'svg-da3k1nk5ljk2l4-34nkl1j3-123',
      objectType: 'image',
      diagramType: null,
      url: 'https://questbook-prod-bucket.s3.ap-northeast-2.amazonaws.com/user/1/Questbook_test_2024-12-17-14-09-497.png',
      text: '',
      points: {
        x: 100,
        y: 100,
      },
      style: {
        background: '#825feb',
        opacity: 100,
        color: '#424242',
      },
      size: {
        width: 200,
        height: 200,
      },
    },
    animationData: [
      {
        triggerType: 'click',
        animation: [
          {
            triggerTarget: 'svg-da3k1nk5ljk2l4-34nkl1j3-123',
            actionType: 'move',
            points: [{ x: 200, y: 200 }],
            ease: 'linear',
            duration: 1,
            delay: 0,
            count: '1',
            direction: 'normal',
            fillMode: 'forwards',
            actionSetting: {
              moveType: 'line',
              curviness: 1.5,
            },
          },
          {
            triggerTarget: 'svg-da3k1nk5ljk2l4-34nkl1j3-123',
            actionType: 'scale',
            points: null,
            ease: 'linear',
            duration: 1,
            delay: 0,
            count: '1',
            direction: 'normal',
            fillMode: 'forwards',
            actionSetting: { scaleMagnification: 1.5 },
          },
        ],
        isSimultaneousness: false,
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

const handleTrigger = (objectId, triggerType, isParent = false) => {
  const targetObject = objects.value.find((obj) => obj.objectData.uuid === objectId)
  if (!targetObject) return

  // animationData에서 해당 트리거 타입에 맞는 애니메이션 찾기
  const matchingAnimations = targetObject.animationData.find(
    (data) => data.triggerType === triggerType
  )
  if (!matchingAnimations) return

  // 동시 실행 여부 확인
  if (matchingAnimations.isSimultaneousness) {
    // 모든 애니메이션 동시 실행
    matchingAnimations.animation.forEach((anim) => {
      executeAnimation(anim.triggerTarget || objectId, anim)
    })
  } else {
    // 순차적으로 실행
    let delay = 0
    matchingAnimations.animation.reduce(async (promise, anim) => {
      await promise // 이전 애니메이션 완료 대기
      const currentDelay = delay
      delay += (anim.duration || 1) * 1000 // 다음 애니메이션을 위한 딜레이 누적

      return new Promise((resolve) => {
        setTimeout(() => {
          executeAnimation(anim.triggerTarget || objectId, anim)
          resolve()
        }, currentDelay)
      })
    }, Promise.resolve())
  }

  // 콜백 함수 실행
  if (matchingAnimations.callbackFunction) {
    window[matchingAnimations.callbackFunction]?.()
  }
}

const getTransformOriginCenter = (element) => {
  const bbox = element.getBBox()
  const centerX = bbox.x + bbox.width / 2
  const centerY = bbox.y + bbox.height / 2

  return `${centerX}px ${centerY}px`
}

const getCircleElement = (element) => {
  return element.firstElementChild
}

const executeAnimation = (objectId, animation) => {
  const element = elementRefs.value[objectId]
  if (!element) {
    console.log('Element not found:', objectId)
    return
  }

  // 애니메이션을 실행할 객체의 objectData 찾기
  const targetObject = objects.value.find((obj) => obj.objectData.uuid === objectId)
  if (!targetObject) return

  const bbox = element.getBBox()

  const animationConfig = {
    duration: (animation.duration || 1) * 1000,
    easing: animation.ease || 'linear',
    fill: animation.fillMode || 'forwards',
    delay: (animation.delay || 0) * 1000,
    iterations:
      animation.count === 'infinite' ? Infinity : animation.count ? parseInt(animation.count) : 1,
    direction: animation.direction || 'normal',
    composite: animation.fillMode === 'forwards' ? 'replace' : 'add',
  }

  switch (animation.actionType) {
    case 'move': {
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

      element.animate(keyframes, animationConfig)

      break
    }

    case 'scale': {
      const targetElement = getCircleElement(element)
      const scale = animation.actionSetting.scaleMagnification
      targetElement.animate(
        [
          { transformOrigin: getTransformOriginCenter(targetElement), transform: 'scale(1)' },
          {
            transformOrigin: getTransformOriginCenter(targetElement),
            transform: `scale(${scale})`,
          },
        ],
        animationConfig
      )
      break
    }

    case 'rotate': {
      const targetElement = getCircleElement(element)
      targetElement.animate(
        [
          { transformOrigin: getTransformOriginCenter(targetElement), transform: 'rotate(0deg)' },
          {
            transform: `rotate(${animation.actionSetting.degree}deg)`,
            transformOrigin: getTransformOriginCenter(targetElement),
          },
        ],
        animationConfig
      )
      break
    }

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

// 이미지 위치 업데이트 헬퍼 함수
const updateElementPosition = (element, objectData) => {
  const { points, size, objectType } = objectData

  switch (objectType) {
    case 'image':
      element.setAttribute('x', points.x - size.width / 2)
      element.setAttribute('y', points.y - size.height / 2)
      break

    case 'text':
      element.setAttribute('x', points.x)
      element.setAttribute('y', points.y)
      break

    case 'diagram':
      if (element.tagName.toLowerCase() === 'ellipse') {
        element.setAttribute('cx', points.x)
        element.setAttribute('cy', points.y)
      }
      break
  }
}

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
          @mouseenter.stop="handleTrigger(object.objectData.uuid, 'mouseenter')"
          @mouseleave.stop="handleTrigger(object.objectData.uuid, 'mouseleave')"
          @mouseover="handleTrigger(object.objectData.uuid, 'mouseover')"
          @mouseout="handleTrigger(object.objectData.uuid, 'mouseout')"
          @mouseup="handleTrigger(object.objectData.uuid, 'mouseup')"
          @mousedown="handleTrigger(object.objectData.uuid, 'mousedown')"
          @contextmenu.prevent="handleTrigger(object.objectData.uuid, 'contextmenu')"
          tabindex="0"
          @focus.stop="handleTrigger(object.objectData.uuid, 'focus')"
          @blur.stop="handleTrigger(object.objectData.uuid, 'blur')"
          @focusin="handleTrigger(object.objectData.uuid, 'focusin')"
          @focusout="handleTrigger(object.objectData.uuid, 'focusout')"
        />

        <!-- Image -->
        <image
          v-if="object.objectData.objectType === 'image'"
          :x="object.objectData.points.x - object.objectData.size.width / 2"
          :y="object.objectData.points.y - object.objectData.size.height / 2"
          :width="object.objectData.size.width"
          :height="object.objectData.size.height"
          :href="object.objectData.url"
          preserveAspectRatio="xMidYMid meet"
          @click="handleTrigger(object.objectData.uuid, 'click')"
          @dblclick="handleTrigger(object.objectData.uuid, 'dblclick')"
          @mouseenter.stop="handleTrigger(object.objectData.uuid, 'mouseenter')"
          @mouseleave.stop="handleTrigger(object.objectData.uuid, 'mouseleave')"
          @mouseover="handleTrigger(object.objectData.uuid, 'mouseover')"
          @mouseout="handleTrigger(object.objectData.uuid, 'mouseout')"
          @mouseup="handleTrigger(object.objectData.uuid, 'mouseup')"
          @mousedown="handleTrigger(object.objectData.uuid, 'mousedown')"
          @contextmenu.prevent="handleTrigger(object.objectData.uuid, 'contextmenu')"
          @focus.stop="handleTrigger(object.objectData.uuid, 'focus')"
          @blur.stop="handleTrigger(object.objectData.uuid, 'blur')"
          @focusin="handleTrigger(object.objectData.uuid, 'focusin')"
          @focusout="handleTrigger(object.objectData.uuid, 'focusout')"
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
          @mouseenter.stop="handleTrigger(object.objectData.uuid, 'mouseenter')"
          @mouseleave.stop="handleTrigger(object.objectData.uuid, 'mouseleave')"
          @mouseover="handleTrigger(object.objectData.uuid, 'mouseover')"
          @mouseout="handleTrigger(object.objectData.uuid, 'mouseout')"
          @mouseup="handleTrigger(object.objectData.uuid, 'mouseup')"
          @mousedown="handleTrigger(object.objectData.uuid, 'mousedown')"
          @contextmenu.prevent="handleTrigger(object.objectData.uuid, 'contextmenu')"
          @focus.stop="handleTrigger(object.objectData.uuid, 'focus')"
          @blur.stop="handleTrigger(object.objectData.uuid, 'blur')"
          @focusin="handleTrigger(object.objectData.uuid, 'focusin')"
          @focusout="handleTrigger(object.objectData.uuid, 'focusout')"
          tabindex="0"
          class="cursor-pointer"
        >
          {{ object.objectData.text }}
        </text>
      </g>
    </svg>
  </div>
</template>
