<script setup>
import { ref, onMounted } from 'vue'
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
      points: { x: 100, y: 100 },
      style: {
        background: '#825feb',
        opacity: 100,
        color: '#825feb',
      },
      size: {
        width: 140,
        height: 100,
      },
    },
    animationData: [
      {
        triggerType: 'click',
        animation: [
          {
            triggerTarget: 'svg-da3k1nk5ljk2l4-34nkl1j3-123',
            actionType: 'size',
            points: null,
            ease: 'linear',
            duration: 0.9,
            delay: 0,
            count: null,
            direction: 'normal',
            fillMode: null,
            actionSetting: {
              width: 500,
              height: 300,
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

const handleTrigger = (objectId, triggerType) => {
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
    matchingAnimations.animation.forEach((anim, index) => {
      setTimeout(() => {
        executeAnimation(anim.triggerTarget || objectId, anim)
      }, (anim.delay || 0) * 1000 + index * 100)
    })
  }

  // 콜백 함수 실행
  if (matchingAnimations.callbackFunction) {
    window[matchingAnimations.callbackFunction]?.()
  }
}

const executeAnimation = (objectId, animation) => {
  const element = document.getElementById(objectId)
  if (!element) {
    console.log('Element not found:', objectId)
    return
  }

  // 애니메이션을 실행할 객체의 objectData 찾기
  const targetObject = objects.value.find((obj) => obj.objectData.uuid === objectId)
  if (!targetObject) return

  const bbox = element.getBBox()
  const centerX = bbox.x + bbox.width / 2
  const centerY = bbox.y + bbox.height / 2

  const animationConfig = {
    duration: (animation.duration || 1) * 1000,
    easing: animation.ease || 'linear',
    fill: animation.fillMode || 'forwards',
    delay: (animation.delay || 0) * 1000,
    iterations: animation.count || 1,
    direction: animation.direction || 'normal',
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

      moveTargetElement.animate(keyframes, animationConfig)

      break
    }

    case 'scale':
      const scale = animation.actionSetting.scaleMagnification
      element.animate(
        [
          { transformOrigin: `${centerX}px ${centerY}px` },
          { transformOrigin: `${centerX}px ${centerY}px`, transform: `scale(${scale})` },
        ],
        animationConfig
      )
      break

    case 'rotate':
      element.animate(
        [
          { transformOrigin: `${centerX}px ${centerY}px` },
          {
            transform: `rotate(${animation.actionSetting.degree}deg)`,
            transformOrigin: `${centerX}px ${centerY}px`,
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
      const colorTargetId = animation.triggerTarget || objectId
      const colorTargetElement = document.getElementById(colorTargetId)
      if (!colorTargetElement) return

      const colorCircleElement = colorTargetElement.querySelector('circle')
      if (!colorCircleElement) return
      colorCircleElement.animate(
        [
          { fill: colorCircleElement.getAttribute('fill') },
          { fill: animation.actionSetting.color },
        ],
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

// 이미지 위치 업데이트 헬퍼 함수
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
      element.setAttribute('text-anchor', 'middle')
      element.setAttribute('dominant-baseline', 'middle')
      break

    case 'diagram':
      if (element.tagName.toLowerCase() === 'ellipse') {
        element.setAttribute('cx', points.x)
        element.setAttribute('cy', points.y)
      }
      break
  }
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-screen bg-white">
    <svg ref="svgRef" :width="720" :height="452" class="bg-white border border-black outline-none">
      <g v-for="object in objects" :key="object.objectData.uuid" :id="object.objectData.uuid">
        <!-- Circle -->
        <ellipse
          class="outline-none"
          v-if="
            object.objectData.objectType === 'diagram' && object.objectData.diagramType === 'circle'
          "
          :cx="object.objectData.points.x"
          :cy="object.objectData.points.y"
          :rx="object.objectData.radiusX || object.objectData.size.width / 2"
          :ry="object.objectData.radiusY || object.objectData.size.height / 2"
          :fill="object.objectData.style.background"
          @click="handleTrigger(object.objectData.uuid, 'click')"
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
